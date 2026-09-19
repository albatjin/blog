'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  SendIcon,
  XIcon,
  LoaderIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  LogInIcon,
} from '@/components/icons'
import type { User } from '@supabase/supabase-js'

interface PublishModalProps {
  isOpen: boolean
  title: string
  tags: string[]
  content: string
  coverImage?: string
  onClose: () => void
  onSuccess?: () => void
}

const CATEGORIES = [
  '백엔드',
  '프론트엔드',
  'DevOps & 인프라',
  'AI/ML',
  '커리어',
]

const SUB_TAGS = ['Featured Log', 'Deep Dive', 'Hot System', 'Architecture', 'Tutorial', 'Case Study']

// 슬러그 생성 유틸리티 (한국어/영어 지원)
function generateSlug(text: string): string {
  const clean = text
    .toLowerCase()
    .replace(/[^\w\sㄱ-ㅎ가-힣-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50)
  const rand = Math.random().toString(36).substring(2, 7)
  return clean ? `${clean}-${rand}` : `post-${Date.now()}`
}

// 읽기 시간 계산 유틸리티
function calculateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 150))
  return `${minutes}분 분량`
}

function extractExcerpt(text: string): string {
  if (!text) return ''
  const plain = text
    .replace(/^#+.*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    .replace(/[*_~`>#|]/g, '')
    .trim()

  const firstSentence = plain.split('\n').filter((l) => l.trim().length > 10)[0] || plain.slice(0, 150)
  return firstSentence.slice(0, 180) + (firstSentence.length > 180 ? '...' : '')
}

export function PublishModal({
  isOpen,
  title,
  tags,
  content,
  coverImage = '',
  onClose,
  onSuccess,
}: PublishModalProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [category, setCategory] = useState('백엔드')
  const [subTag, setSubTag] = useState('Deep Dive')
  const [excerpt, setExcerpt] = useState(() => extractExcerpt(content))
  const [authorName, setAuthorName] = useState('개발자')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // 인라인 로그인 폼 상태
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [showAuthForm, setShowAuthForm] = useState(false)

  const supabase = createClient()

  // 세션 정보 확인
  useEffect(() => {
    if (!isOpen) return

    // 현재 로그인된 유저 확인
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        const name = data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'DevLog 작가'
        setAuthorName(name)
        setShowAuthForm(false)
      } else {
        setUser(null)
      }
    })
  }, [isOpen, supabase])

  if (!isOpen) return null

  // 인라인 로그인 처리
  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail.trim(),
        password: authPassword,
      })

      if (error) {
        setAuthError(error.message)
        return
      }

      if (data.user) {
        setUser(data.user)
        const name = data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'DevLog 작가'
        setAuthorName(name)
        setShowAuthForm(false)
        setErrorMsg(null)
      }
    } catch {
      setAuthError('로그인 처리 중 오류가 발생했습니다.')
    } finally {
      setAuthLoading(false)
    }
  }

  // Supabase에 포스트 발행 (INSERT)
  const handlePublish = async () => {
    if (!title.trim()) {
      setErrorMsg('제목을 입력해 주세요.')
      return
    }

    if (!content.trim()) {
      setErrorMsg('본문 내용을 작성해 주세요.')
      return
    }

    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      // 1. 현재 사용자 세션 다시 확인
      const { data: sessionData } = await supabase.auth.getUser()
      const currentUser = sessionData.user

      const postSlug = generateSlug(title)
      const primaryTag = tags[0] || 'DevLog'
      const readTime = calculateReadTime(content)
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.')

      const newPost = {
        title: title.trim(),
        slug: postSlug,
        excerpt: excerpt.trim() || title.trim(),
        content: content,
        tag: primaryTag,
        sub_tag: subTag,
        category: category,
        author_name: authorName || 'DevLog 엔지니어',
        author_avatar:
          currentUser?.user_metadata?.avatar_url ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        read_time: readTime,
        published_date: today,
        likes_count: 0,
        comments_count: 0,
        is_featured: false,
        user_id: currentUser ? currentUser.id : null,
      }

      const { data, error } = await supabase.from('posts').insert(newPost).select().single()

      if (error) {
        // RLS 정책 위반 (비로그인 사용자)
        if (error.code === '42501' || error.message.includes('row-level security')) {
          setShowAuthForm(true)
          throw new Error('Supabase 보안 정책(RLS)에 따라 포스트 발행을 위해서는 로그인이 필요합니다. 아래에서 로그인해 주세요.')
        }
        throw error
      }

      setSuccessMsg('성공적으로 블로그 포스트가 발행되었습니다!')
      onSuccess?.()

      // 생성된 포스트 상세 페이지로 이동
      setTimeout(() => {
        if (data?.slug) {
          router.push(`/posts/${data.slug}`)
        } else if (data?.id) {
          router.push(`/posts/${data.id}`)
        } else {
          router.push('/')
        }
      }, 1200)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '포스트 발행 중 문제가 발생했습니다.'
      setErrorMsg(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#121722] border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* 모달 상단 헤더 */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <SendIcon className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">블로그 포스트 발행</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                포스트 메타데이터를 확인하고 Supabase 데이터베이스에 등록합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 에러 및 성공 알림 */}
        {errorMsg && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircleIcon className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1 leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            <CheckCircleIcon className="w-4 h-4 shrink-0 text-emerald-400" />
            <div className="flex-1 font-semibold">{successMsg}</div>
          </div>
        )}

        {/* 인라인 로그인 폼 (비로그인 상태 또는 RLS 에러 시) */}
        {showAuthForm && !user && (
          <div className="p-4 rounded-xl bg-[#0e131c] border border-amber-500/30 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <LogInIcon className="w-4 h-4" />
              <span>포스트 발행을 위한 계정 로그인</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              작성하신 글은 안전하게 보관되어 있습니다. 로그인 후 바로 발행이 진행됩니다.
            </p>

            <form onSubmit={handleInlineLogin} className="space-y-2.5 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="email"
                  required
                  placeholder="이메일 (email@example.com)"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="bg-[#161f2e] text-slate-200 px-3 py-2 rounded-lg border border-slate-700 text-xs focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="password"
                  required
                  placeholder="비밀번호"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="bg-[#161f2e] text-slate-200 px-3 py-2 rounded-lg border border-slate-700 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {authError && <p className="text-rose-400 text-[11px]">{authError}</p>}

              <div className="flex items-center justify-between pt-1">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {authLoading && <LoaderIcon className="w-3.5 h-3.5 animate-spin" />}
                  <span>로그인 및 계속하기</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.open('/auth', '_blank')}
                  className="text-slate-400 hover:text-emerald-400 underline transition-colors text-[11px]"
                >
                  새 계정 회원가입
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 발행 메타데이터 설정 폼 */}
        <div className="space-y-4 text-xs">
          {/* 커버 이미지 미리보기 (설정된 경우) */}
          {coverImage && (
            <div className="space-y-1.5">
              <span className="text-slate-400 font-medium">설정된 커버 이미지</span>
              <div className="relative aspect-[21/8] rounded-xl overflow-hidden border border-slate-700/80 bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverImage} alt="포스트 커버" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* 제목 미리보기 */}
          <div className="space-y-1.5">
            <span className="text-slate-400 font-medium">제목</span>
            <div className="p-3 rounded-xl bg-[#0e131c] border border-slate-800 text-sm font-bold text-white">
              {title || '제목 없음'}
            </div>
          </div>

          {/* 태그 리스트 미리보기 */}
          <div className="space-y-1.5">
            <span className="text-slate-400 font-medium">설정된 태그 ({tags.length}개)</span>
            <div className="flex flex-wrap gap-1.5">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px]"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="text-slate-500 italic">태그가 없습니다.</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 카테고리 선택 */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0e131c] text-slate-200 rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 서브 태그(뱃지) 선택 */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">시리즈 / 서브 뱃지</label>
              <select
                value={subTag}
                onChange={(e) => setSubTag(e.target.value)}
                className="w-full bg-[#0e131c] text-slate-200 rounded-xl px-3 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {SUB_TAGS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 포스트 요약(Excerpt) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold">포스트 요약 (피드에 노출되는 설명문)</label>
              <span className="text-[11px] text-slate-500">{excerpt.length}/200자</span>
            </div>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value.slice(0, 200))}
              rows={3}
              placeholder="피드 카드 및 메타태그에 사용될 핵심 요약을 입력하세요."
              className="w-full bg-[#0e131c] text-slate-200 rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-emerald-500 transition-colors text-xs leading-relaxed"
            />
          </div>

          {/* 저자명 */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">작성자 명</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-[#0e131c] text-slate-200 rounded-xl px-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            돌아가기
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00dc82] hover:bg-[#00c976] text-[#0B0F17] font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <LoaderIcon className="w-4 h-4 animate-spin" />
                <span>Supabase 데이터베이스 등록 중...</span>
              </>
            ) : (
              <>
                <SendIcon className="w-4 h-4 stroke-[2.5]" />
                <span>즉시 발행 완료</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

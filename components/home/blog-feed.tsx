/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Post } from '@/types/blog'
import {
  HeartIcon,
  MessageSquareIcon,
  BookmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpDownIcon,
  GridIcon,
  ListIcon,
} from '@/components/icons'

// home.png 기준 초기 시드 데이터 (Supabase 연동 전/데이터가 없을 때 완벽 폴백)
const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    slug: 'react-19-server-actions-guide',
    title: 'React 19 Server Actions 완벽 실전 가이드',
    excerpt:
      '서버 액션과 낙관적 UI 업데이트(useOptimistic), 새로운 useActionState 훅을 결합해 복잡한 비동기 양식 제출 상태를 보일러플레이트 없이 안전하게 다루는 실...',
    tag: 'React 19',
    sub_tag: 'Featured Log',
    category: '프론트엔드',
    author_name: '정하은',
    author_avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    read_time: '5분 분량',
    published_date: '2025.02.24',
    likes_count: 142,
    comments_count: 28,
  },
  {
    id: 'post-2',
    slug: 'scalable-kafka-redis-architecture',
    title: '대규모 트래픽 처리를 위한 Kafka & Redis 아키텍처 개선기',
    excerpt:
      '초당 12만 TPS 급증 상황에서 데이터베이스 커넥션 고갈을 극복하기 위해 분산 락, Write-Behind 캐시 전략, 파티션 리밸런싱을 최적화한 실전 장애 회고록입니다.',
    tag: 'Kafka & Redis',
    sub_tag: 'Hot System',
    category: '백엔드',
    author_name: '강민석',
    author_avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    read_time: '9분 분량',
    published_date: '2025.02.23',
    likes_count: 319,
    comments_count: 45,
  },
  {
    id: 'post-3',
    slug: 'building-local-cache-engine-in-rust',
    title: 'Rust로 직접 구현해보는 가벼운 로컬 캐시 엔진',
    excerpt:
      'Lock-Free 알고리즘과 ARC, Crossbeam을 활용한 세밀한 멀티스레드 동시성 제어부터 TinyLFU 기반의 캐시 퇴출 정책을 Rust 메모리 안전성 원칙 아래 빌드합...',
    tag: 'Rust',
    sub_tag: 'Deep Dive',
    category: '백엔드',
    author_name: '오준혁',
    author_avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    read_time: '12분 분량',
    published_date: '2025.02.21',
    likes_count: 288,
    comments_count: 19,
  },
  {
    id: 'post-4',
    slug: 'kubernetes-zero-downtime-argocd-patterns',
    title: 'Kubernetes 무중단 배포 전략과 ArgoCD 실무 패턴',
    excerpt:
      'Argo Rollouts를 통한 Progressive Delivery 및 블루/그린 배포 검증, 실시간 프로메테우스 메트릭 자동 롤백 파이프라인을 프로덕션 클러스터에 배포한 사례...',
    tag: 'Kubernetes',
    sub_tag: 'Infra Ops',
    category: 'DevOps & 인프라',
    author_name: '서지우',
    author_avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    read_time: '8분 분량',
    published_date: '2025.02.20',
    likes_count: 174,
    comments_count: 14,
  },
  {
    id: 'post-5',
    slug: 'llm-realtime-search-agent-rag-optimization',
    title: 'LLM 기반 실시간 검색 에이전트 설계 및 RAG 최적화',
    excerpt:
      '하이브리드 서치(BM25 + Dense Vector), 리랭커(Cross-Encoder) 도입, 그리고 지연시간 단축을 위한 스트리밍 청크 디코딩 처리 기법을 소개합니다.',
    tag: 'AI / RAG',
    sub_tag: 'AI Research',
    category: 'AI/ML',
    author_name: '임도현',
    author_avatar:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    read_time: '11분 분량',
    published_date: '2025.02.19',
    likes_count: 492,
    comments_count: 61,
  },
  {
    id: 'post-6',
    slug: 'typescript-advanced-types-conditional-template',
    title: '타입스크립트 고급 타입 테크닉: Conditional Types와 Template...',
    excerpt:
      '타입 수준 연산(Type-Level Computation)으로 엄격한 라우트 정의, 유효성 스키마 타입 추론, 그리고 제네릭 제약 조건을 통한 런타임 오류 방지 노하우를 정리합...',
    tag: 'TypeScript 5.5',
    sub_tag: 'Type Safety',
    category: '프론트엔드',
    author_name: '윤서연',
    author_avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    read_time: '6분 분량',
    published_date: '2025.02.18',
    likes_count: 185,
    comments_count: 22,
  },
]

const CATEGORIES = [
  '전체',
  '프론트엔드',
  '백엔드',
  'DevOps & 인프라',
  'AI/ML',
  '커리어',
]

// 태그별 뱃지 스타일 맵핑
function getTagColorClass(tag: string) {
  if (tag.includes('React')) return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
  if (tag.includes('Kafka') || tag.includes('Redis')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  if (tag.includes('Rust')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  if (tag.includes('Kubernetes')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  if (tag.includes('AI') || tag.includes('RAG')) return 'bg-teal-500/10 text-teal-400 border-teal-500/20'
  if (tag.includes('TypeScript')) return 'bg-sky-500/10 text-sky-400 border-sky-500/20'
  return 'bg-slate-800 text-slate-300 border-slate-700'
}

export function BlogFeed() {
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [sortOption, setSortOption] = useState<'latest' | 'popular'>('latest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS)
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())
  const [likedMap, setLikedMap] = useState<Record<string, { count: number; liked: boolean }>>({})

  // 클라이언트 사이드 Supabase SDK 연동
  useEffect(() => {
    async function fetchPostsFromSupabase() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })

        if (!error && data && data.length > 0) {
          setPosts(data)
        }
      } catch {
        // Supabase 테이블이 아직 마이그레이션되지 않았을 경우 기본 시드 데이터 유지
      }
    }

    fetchPostsFromSupabase()
  }, [])

  // 북마크 토글 핸들러
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setBookmarkedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // 좋아요 토글 핸들러
  const toggleLike = (id: string, originalLikes: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setLikedMap((prev) => {
      const current = prev[id] || { count: originalLikes, liked: false }
      const newLiked = !current.liked
      return {
        ...prev,
        [id]: {
          count: newLiked ? current.count + 1 : current.count - 1,
          liked: newLiked,
        },
      }
    })
  }

  // 카테고리 필터링 & 정렬
  const filteredPosts = useMemo(() => {
    let list = [...posts]

    if (selectedCategory !== '전체') {
      list = list.filter((p) => p.category === selectedCategory)
    }

    if (sortOption === 'popular') {
      list.sort((a, b) => {
        const likesA = likedMap[a.id]?.count ?? a.likes_count
        const likesB = likedMap[b.id]?.count ?? b.likes_count
        return likesB - likesA
      })
    }

    return list
  }, [posts, selectedCategory, sortOption, likedMap])

  return (
    <div className="space-y-6">
      {/* 카테고리 필터 바 및 툴바 (home.png 100% 동일 구현) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* 카테고리 탭 버튼 목록 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat)
                  setCurrentPage(1)
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00dc82] text-[#0B0F17] shadow-sm shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* 우측 도구: 정렬 드롭다운 & 뷰 모드(그리드/리스트) 토글 */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* 정렬 버튼 */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setSortOption((prev) => (prev === 'latest' ? 'popular' : 'latest'))
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121722] hover:bg-slate-800/80 border border-slate-800 text-xs font-medium text-slate-300 transition-colors"
            >
              <ArrowUpDownIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>{sortOption === 'latest' ? '최신순' : '인기순'}</span>
            </button>
          </div>

          {/* 뷰 모드 토글 (그리드 / 리스트) */}
          <div className="flex items-center bg-[#121722] border border-slate-800 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="그리드 뷰"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <GridIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="리스트 뷰"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 블로그 글 카드 리스트 그리드 (home.png 2열 레이아웃) */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
            : 'flex flex-col gap-4'
        }
      >
        {filteredPosts.length === 0 ? (
          <div className="col-span-2 py-16 text-center text-slate-400 bg-[#121722]/50 border border-slate-800 rounded-2xl">
            선택한 카테고리에 해당하는 게시글이 없습니다.
          </div>
        ) : (
          filteredPosts.map((post) => {
            const currentLikes = likedMap[post.id]?.count ?? post.likes_count
            const isLiked = likedMap[post.id]?.liked ?? false
            const isBookmarked = bookmarkedIds.has(post.id)

            return (
              <article
                key={post.id}
                className="group relative bg-[#121722]/80 hover:bg-[#151c2a]/90 border border-slate-800/90 hover:border-slate-700/90 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-black/40 cursor-pointer"
              >
                <div>
                  {/* 상단 태그 & 서브태그 영역 */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-md border font-medium ${getTagColorClass(
                        post.tag
                      )}`}
                    >
                      {post.tag}
                    </span>
                    {post.sub_tag && (
                      <span className="text-[11px] font-medium text-slate-400">
                        {post.sub_tag}
                      </span>
                    )}
                  </div>

                  {/* 글 제목 & 요약 (상세 페이지 링크) */}
                  <Link
                    href={`/posts/${post.id}`}
                    className="block group/link"
                  >
                    <h2 className="text-[15px] sm:text-base font-bold text-white group-hover/link:text-emerald-400 transition-colors line-clamp-2 leading-snug mb-2 tracking-tight">
                      {post.title}
                    </h2>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-5">
                      {post.excerpt}
                    </p>
                  </Link>
                </div>

                {/* 하단 메타 정보 (작성자, 읽기 시간, 발행일) 및 인터랙션 */}
                <div className="pt-3 border-t border-slate-800/60 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-800 border border-slate-700">
                        {post.author_avatar ? (
                          <img
                            src={post.author_avatar}
                            alt={post.author_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-emerald-400">
                            {post.author_name[0]}
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-slate-300">
                        {post.author_name}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400">{post.read_time}</span>
                    </div>
                    <time className="font-mono text-[11px] text-slate-400">
                      {post.published_date}
                    </time>
                  </div>

                  {/* 좋아요, 댓글, 북마크 바 */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-3">
                      {/* 좋아요 */}
                      <button
                        type="button"
                        onClick={(e) => toggleLike(post.id, post.likes_count, e)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isLiked
                            ? 'text-rose-400'
                            : 'hover:text-rose-400 text-slate-400'
                        }`}
                      >
                        <HeartIcon
                          className={`w-3.5 h-3.5 ${
                            isLiked ? 'fill-rose-400 stroke-rose-400' : ''
                          }`}
                        />
                        <span className="font-mono text-[11px]">{currentLikes}</span>
                      </button>

                      {/* 댓글 수 */}
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <MessageSquareIcon className="w-3.5 h-3.5" />
                        <span className="font-mono text-[11px]">
                          {post.comments_count}
                        </span>
                      </div>
                    </div>

                    {/* 북마크 */}
                    <button
                      type="button"
                      onClick={(e) => toggleBookmark(post.id, e)}
                      aria-label="북마크"
                      className={`transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'text-emerald-400'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <BookmarkIcon
                        className={`w-4 h-4 ${
                          isBookmarked
                            ? 'fill-emerald-400 stroke-emerald-400'
                            : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>

      {/* 블로그 글 카드 리스트 페이지네이션 (home.png 디자인 기준) */}
      <div className="pt-8 pb-4 flex items-center justify-center gap-1.5 text-xs select-none">
        {/* 이전 버튼 */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-[#121722] text-slate-400 hover:text-white hover:bg-slate-800/80 disabled:opacity-40 disabled:pointer-events-none transition-colors mr-1 cursor-pointer"
        >
          <ChevronLeftIcon className="w-3.5 h-3.5" />
          <span>이전</span>
        </button>

        {/* 1 ~ 5 번호 버튼 */}
        {[1, 2, 3, 4, 5].map((pageNum) => {
          const isActive = currentPage === pageNum
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 rounded-lg font-semibold flex items-center justify-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00dc82] text-[#0B0F17] shadow-sm shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {pageNum}
            </button>
          )
        })}

        {/* 말줄임표 */}
        <span className="text-slate-600 px-1 font-mono">...</span>

        {/* 24 페이지 버튼 */}
        <button
          type="button"
          onClick={() => setCurrentPage(24)}
          className={`w-8 h-8 rounded-lg font-semibold flex items-center justify-center transition-all cursor-pointer ${
            currentPage === 24
              ? 'bg-[#00dc82] text-[#0B0F17]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          24
        </button>

        {/* 다음 버튼 */}
        <button
          type="button"
          onClick={() => setCurrentPage((p) => Math.min(24, p + 1))}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-[#121722] text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors ml-1 cursor-pointer"
        >
          <span>다음</span>
          <ChevronRightIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}


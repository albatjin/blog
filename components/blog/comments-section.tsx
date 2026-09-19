/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import {
  ThumbsUpIcon,
  CodeXmlIcon,
  LinkIcon,
  ImageIcon,
  SmileIcon,
} from '@/components/icons'

interface CommentItem {
  id: string
  author: string
  roleTag: string
  avatar?: string
  timeAgo: string
  content: string
  likes: number
  isAuthor?: boolean
  replies?: CommentItem[]
}

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    author: '임철우',
    roleTag: 'Cloud SRE',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    timeAgo: '2시간 전',
    content:
      '잘 읽었습니다! 저희도 Redis Cluster 도입 시 Jitter 적용으로 Thundering Herd 문제를 상당 부분 해결했었는데, Kafka Consumer Group의 Rebalance 지연 이슈는 어떻게 완화하셨는지 궁금합니다. Cooperative Sticky Assignor를 사용하셨나요?',
    likes: 12,
    replies: [
      {
        id: 'c1-r1',
        author: 'Alex Kim',
        roleTag: 'Tech Lead',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        timeAgo: '1시간 전',
        isAuthor: true,
        content:
          '네, 정확히 짚으셨습니다! 이번에 CooperativeStickyAssignor 를 반영하여 Consumer 스케일 아웃 시 Stop-the-world 시간을 80% 이상 절감할 수 있었습니다. 추후 별도 글로 다뤄보겠습니다.',
        likes: 4,
      },
    ],
  },
  {
    id: 'c2',
    author: '박민수',
    roleTag: 'Backend Dev',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    timeAgo: '5시간 전',
    content:
      '낙관적 락을 거는 패턴 예시 코드가 매우 깔끔하네요. Node.js 프로세스 단위의 메모리 캐시(LRU)와 Redis를 함께 구성하는 2계층 캐시 방식도 고려해보셨는지 궁금합니다!',
    likes: 4,
  },
]

export function CommentsSection() {
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS)
  const [commentText, setCommentText] = useState('')
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest')
  const [likedComments, setLikedComments] = useState<Record<string, number>>({})

  // 총 댓글 수 (대댓글 포함)
  const totalCount = comments.reduce(
    (acc, c) => acc + 1 + (c.replies ? c.replies.length : 0),
    0
  )

  const handleLike = (id: string, initialLikes: number) => {
    setLikedComments((prev) => {
      const current = prev[id] !== undefined ? prev[id] : initialLikes
      const hasLiked = current > initialLikes
      return {
        ...prev,
        [id]: hasLiked ? initialLikes : initialLikes + 1,
      }
    })
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      author: '엔지니어 게스트',
      roleTag: 'Dev',
      timeAgo: '방금 전',
      content: commentText.trim(),
      likes: 0,
    }

    setComments([newComment, ...comments])
    setCommentText('')
    setActiveTab('write')
  }

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'popular') {
      const likesA = likedComments[a.id] ?? a.likes
      const likesB = likedComments[b.id] ?? b.likes
      return likesB - likesA
    }
    return 0 // latest 기본 순서
  })

  return (
    <section className="mt-16 pt-10 border-t border-slate-800/80 space-y-8">
      {/* 댓글 헤더 & 정렬 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h3 className="text-lg font-bold text-white tracking-tight">댓글</h3>
          <span className="px-2 py-0.5 rounded-full bg-slate-800/90 border border-slate-700/60 text-xs font-mono font-medium text-emerald-400">
            {totalCount}개
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>정렬:</span>
          <button
            type="button"
            onClick={() => setSortBy('latest')}
            className={`font-medium transition-colors ${
              sortBy === 'latest' ? 'text-emerald-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            최신순
          </button>
          <span className="text-slate-600">|</span>
          <button
            type="button"
            onClick={() => setSortBy('popular')}
            className={`font-medium transition-colors ${
              sortBy === 'popular' ? 'text-emerald-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            추천순
          </button>
        </div>
      </div>

      {/* 댓글 입력 폼 박스 */}
      <form
        onSubmit={handleAddComment}
        className="bg-[#121722]/90 border border-slate-800 rounded-xl overflow-hidden focus-within:border-emerald-500/50 transition-colors shadow-lg shadow-black/20"
      >
        {/* 입력기 상단 탭 헤더 */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e131c] border-b border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-slate-400">
            <span>✏️ 150자 남겨주세요 (markdown 지원)</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'write'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              작성
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              미리보기
            </button>
          </div>
        </div>

        {/* 텍스트 영역 또는 미리보기 */}
        {activeTab === 'write' ? (
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={3}
            placeholder="코드 스니펫이나 아키텍처 토론 환영합니다. 상대방을 존중하는 어조로 작성해주세요."
            className="w-full bg-transparent p-4 text-sm text-slate-200 placeholder-slate-500 resize-y focus:outline-none leading-relaxed font-sans"
          />
        ) : (
          <div className="p-4 min-h-[96px] text-sm text-slate-300 leading-relaxed font-sans bg-[#0B0F17]/40">
            {commentText ? (
              <p className="whitespace-pre-wrap">{commentText}</p>
            ) : (
              <span className="text-slate-500 text-xs italic">
                미리 볼 댓글 내용이 없습니다. 작성 탭에서 내용을 입력하세요.
              </span>
            )}
          </div>
        )}

        {/* 하단 툴바 & 제출 버튼 */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e131c]/70 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-slate-400">
            <button
              type="button"
              title="코드 추가"
              onClick={() => setCommentText((prev) => `${prev}\`\`\`\n\n\`\`\``)}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              <CodeXmlIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="링크 추가"
              onClick={() => setCommentText((prev) => `${prev}[링크](url)`)}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="이미지 추가"
              className="p-1.5 rounded hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="이모지 추가"
              onClick={() => setCommentText((prev) => `${prev} 👍 `)}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              <SmileIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!commentText.trim()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00dc82] hover:bg-[#00c976] disabled:opacity-40 disabled:pointer-events-none text-[#0B0F17] font-semibold text-xs transition-colors shadow-sm cursor-pointer active:scale-98"
          >
            <span>댓글 작성</span>
          </button>
        </div>
      </form>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {sortedComments.map((comment) => {
          const currentLikes = likedComments[comment.id] ?? comment.likes
          const isLiked = currentLikes > comment.likes

          return (
            <div
              key={comment.id}
              className="bg-[#121722]/80 border border-slate-800/90 rounded-xl p-5 space-y-3.5"
            >
              {/* 유저 헤더 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-emerald-400 font-bold">
                    {comment.avatar ? (
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      comment.author[0]
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {comment.author}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      ({comment.roleTag})
                    </span>
                  </div>
                  <span className="text-slate-600 text-xs">·</span>
                  <span className="text-xs text-slate-500">{comment.timeAgo}</span>
                </div>
              </div>

              {/* 본문 */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {comment.content}
              </p>

              {/* 하단 반응 버튼 */}
              <div className="flex items-center gap-4 text-xs pt-1">
                <button
                  type="button"
                  onClick={() => handleLike(comment.id, comment.likes)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isLiked
                      ? 'text-emerald-400 font-medium'
                      : 'text-slate-400 hover:text-emerald-400'
                  }`}
                >
                  <ThumbsUpIcon className="w-3.5 h-3.5" />
                  <span className="font-mono text-[11px]">{currentLikes}</span>
                </button>
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-xs"
                >
                  답글 쓰기
                </button>
              </div>

              {/* 대댓글 (Replies) */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/60 pl-4 sm:pl-6 space-y-3">
                  {comment.replies.map((reply) => {
                    const replyLikes = likedComments[reply.id] ?? reply.likes
                    const replyIsLiked = replyLikes > reply.likes

                    return (
                      <div
                        key={reply.id}
                        className="bg-[#0e131c]/80 border border-slate-800/70 rounded-lg p-3.5 space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            작성자
                          </span>
                          <span className="text-xs font-semibold text-white">
                            {reply.author}
                          </span>
                          <span className="text-slate-600 text-xs">·</span>
                          <span className="text-[11px] text-slate-500">
                            {reply.timeAgo}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {reply.content}
                        </p>
                        <div className="flex items-center gap-3 text-xs pt-1">
                          <button
                            type="button"
                            onClick={() => handleLike(reply.id, reply.likes)}
                            className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                              replyIsLiked
                                ? 'text-emerald-400 font-medium'
                                : 'text-slate-400 hover:text-emerald-400'
                            }`}
                          >
                            <ThumbsUpIcon className="w-3 h-3" />
                            <span className="font-mono text-[11px]">
                              {replyLikes}
                            </span>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}


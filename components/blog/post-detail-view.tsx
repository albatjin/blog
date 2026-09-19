/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { Post } from '@/types/blog'
import {
  HeartIcon,
  BookmarkIcon,
  Share2Icon,
  CopyIcon,
  CheckIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  CompassIcon,
} from '@/components/icons'
import { CommentsSection } from './comments-section'
import { MarkdownPreview } from '@/components/write/markdown-preview'

interface PostDetailViewProps {
  post?: Post
}

// detail.png 기준 기본 샘플 포스트 데이터 (Supabase에 데이터가 없더라도 완벽하게 렌더링)
const DEFAULT_DETAIL_POST = {
  id: 'scalable-kafka-redis-architecture',
  title: '대규모 트래픽 처리를 위한 Kafka & Redis 아키텍처 개선기: 초당 5만 건의 요청 견디기',
  category: '백엔드',
  categorySub: '대규모 트래픽 아키텍처',
  tags: ['BACKEND ARCHITECTURE', 'Case Study', '• Level: Advanced'],
  authorName: 'Alex Kim',
  authorRole: 'Tech Lead',
  authorBio:
    'Distributed Systems Engineer & Tech Speaker. 고가용성 마이크로서비스 설계, 이벤트 기반 아키텍처, 그리고 성능 최적화에 대해 연구하고 글을 씁니다.',
  authorAvatar:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  authorStats: '게시글 48 • 팔로워 3,420 • Seoul, KR',
  handle: '@techlead',
  publishedDate: '2025년 2월 24일',
  readTime: '8분 읽기',
  views: '5.4k 조회',
  likesCount: 384,
  bookmarksCount: 92,
  thumbnailUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
}

const TS_CODE_SNIPPET = `import { Cluster, Redis } from 'ioredis';
import { KafkaProducer } from './kafka/producer';

export class DistributedCacheManager {
  private redisCluster: Cluster;
  private kafkaProducer: KafkaProducer;
  // Jitter를 통한 Thundering Herd 방지 (기본 300초 + 무작위 60초)
  private readonly BASE_TTL = 300;

  constructor() {
    this.redisCluster = new Redis.Cluster([
      { host: 'redis-node-01.internal', port: 6379 },
      { host: 'redis-node-02.internal', port: 6379 },
      { host: 'redis-node-03.internal', port: 6379 }
    ]);
  }

  public async getOrHydrate<T>(key: string, fallbackFn: () => Promise<T>): Promise<T> {
    const cached = await this.redisCluster.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }

    // 분산 락 획득 시도 (TTL 2초)
    const lockKey = \`lock:\${key}\`;
    const acquired = await this.redisCluster.set(lockKey, '1', 'NX', 'EX', 2);

    if (!acquired) {
      // 락을 얻지 못한 쿼리는 백오프 후 재시도
      await new Promise(r => setTimeout(r, 50));
      return this.getOrHydrate(key, fallbackFn);
    }

    try {
      const freshData = await fallbackFn();
      const jitter = Math.floor(Math.random() * 60);
      await this.redisCluster.setex(key, this.BASE_TTL + jitter, JSON.stringify(freshData));
      return freshData;
    } finally {
      await this.redisCluster.del(lockKey);
    }
  }
}`

export function PostDetailView({ post }: PostDetailViewProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post?.likes_count ?? DEFAULT_DETAIL_POST.likesCount)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarksCount, setBookmarksCount] = useState(DEFAULT_DETAIL_POST.bookmarksCount)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [shareToast, setShareToast] = useState(false)

  // 좋아요 토글
  const handleToggleLike = () => {
    if (isLiked) {
      setIsLiked(false)
      setLikesCount((prev) => prev - 1)
    } else {
      setIsLiked(true)
      setLikesCount((prev) => prev + 1)
    }
  }

  // 북마크 토글
  const handleToggleBookmark = () => {
    if (isBookmarked) {
      setIsBookmarked(false)
      setBookmarksCount((prev) => prev - 1)
    } else {
      setIsBookmarked(true)
      setBookmarksCount((prev) => prev + 1)
    }
  }

  // 코드 복사
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(TS_CODE_SNIPPET)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  // URL 공유
  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href)
        setShareToast(true)
        setTimeout(() => setShareToast(false), 2500)
      }
    } catch {
      // Fallback
    }
  }

  return (
    <article className="relative max-w-4xl mx-auto pb-16 font-sans">
      {/* 공유 완료 플로팅 토스트 */}
      {shareToast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-xs shadow-2xl shadow-emerald-500/30 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckIcon className="w-4 h-4" />
          <span>게시글 링크가 클립보드에 복사되었습니다!</span>
        </div>
      )}

      {/* 1. 상단 브레드크럼 (홈 > 백엔드 > 대규모 트래픽 아키텍처) */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
        <Link href="/" className="hover:text-emerald-400 transition-colors">
          홈
        </Link>
        <span className="text-slate-600">/</span>
        <span className="text-slate-400">{post?.category || DEFAULT_DETAIL_POST.category}</span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-300 truncate max-w-[200px] sm:max-w-xs">
          {DEFAULT_DETAIL_POST.categorySub}
        </span>
      </nav>

      {/* 2. 상단 카테고리 & 태그 뱃지 */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {DEFAULT_DETAIL_POST.tags[0]}
        </span>
        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/80">
          {DEFAULT_DETAIL_POST.tags[1]}
        </span>
        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#1e293b]/70 text-sky-400 border border-sky-500/20 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
          <span>Level: Advanced</span>
        </span>
      </div>

      {/* 3. 대형 타이틀 */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight sm:leading-snug mb-8">
        {post?.title || DEFAULT_DETAIL_POST.title}
      </h1>

      {/* 4. 상단 히어로 메타 카드 (좌: 섬네일 이미지, 우: 저자 정보 및 메타데이터) */}
      <div className="bg-[#121722]/80 border border-slate-800/90 rounded-2xl p-4 sm:p-6 mb-10 shadow-xl shadow-black/30 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* 좌측: 포스트 섬네일 (엔지니어/데이터센터) */}
          <div className="md:col-span-7 overflow-hidden rounded-xl border border-slate-700/50 relative aspect-[16/10] bg-slate-900 group">
            <img
              src={DEFAULT_DETAIL_POST.thumbnailUrl}
              alt="아티클 섬네일"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17]/80 via-transparent to-transparent opacity-60"></div>
          </div>

          {/* 우측: 저자 정보 및 메타데이터 & 액션 버튼 */}
          <div className="md:col-span-5 flex flex-col justify-between h-full space-y-5">
            {/* 저자 헤더 */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-white">
                  {post?.author_name || DEFAULT_DETAIL_POST.authorName}
                </span>
                <span className="text-xs font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {DEFAULT_DETAIL_POST.handle}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Distributed Systems Engineer
              </p>
            </div>

            {/* 통계 메타 리스트 */}
            <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-xl bg-[#0e131c] border border-slate-800/80 text-xs">
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1">
                  <CalendarIcon className="w-3 h-3" />
                  발행일
                </span>
                <span className="font-mono text-slate-300 text-[11px] font-medium">
                  {post?.published_date || '2025.02.24'}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center text-center border-x border-slate-800">
                <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1">
                  <ClockIcon className="w-3 h-3" />
                  소요
                </span>
                <span className="text-slate-300 text-[11px] font-medium">
                  {post?.read_time || DEFAULT_DETAIL_POST.readTime}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1">
                  <EyeIcon className="w-3 h-3" />
                  조회
                </span>
                <span className="font-mono text-slate-300 text-[11px] font-medium">
                  {DEFAULT_DETAIL_POST.views}
                </span>
              </div>
            </div>

            {/* 메타 바 액션 버튼: 공유 & 북마크 */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={handleShare}
                aria-label="게시글 공유"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <Share2Icon className="w-3.5 h-3.5" />
                <span>공유</span>
              </button>

              <button
                type="button"
                onClick={handleToggleBookmark}
                aria-label="북마크 토글"
                className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/60 text-slate-400 hover:text-white'
                }`}
              >
                <BookmarkIcon
                  className={`w-4 h-4 ${isBookmarked ? 'fill-emerald-400' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 본문 아키텍처 다이어그램 카드 (Figure 1.0) */}
      <div className="my-8 rounded-2xl overflow-hidden border border-slate-800 bg-[#0e131d] shadow-2xl relative">
        {/* 다이어그램 상단 타이틀 바 */}
        <div className="px-5 py-3 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 bg-[#121722]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-300">
              실시간 데이터 인그레스 파이프라인 최적화 분석
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">Live Metric Architecture</span>
        </div>

        {/* 다이어그램 비주얼 렌더링 (SVG 네트워킹 노드 및 레이턴시 감소 시각화) */}
        <div className="p-6 sm:p-8 flex flex-col items-center justify-center bg-gradient-to-b from-[#0e131d] via-[#101726] to-[#0B0F17] relative">
          <svg
            className="w-full max-w-xl h-44 sm:h-52 text-slate-600"
            viewBox="0 0 600 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 그리드 라인 */}
            <line x1="40" y1="30" x2="560" y2="30" stroke="#1e293b" strokeDasharray="4 4" />
            <line x1="40" y1="90" x2="560" y2="90" stroke="#1e293b" strokeDasharray="4 4" />
            <line x1="40" y1="150" x2="560" y2="150" stroke="#1e293b" strokeDasharray="4 4" />

            {/* 인그레스 트래픽 연결선 */}
            <path
              d="M 60 90 C 140 30, 200 150, 300 90 C 400 30, 460 140, 540 90"
              stroke="#00dc82"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              className="drop-shadow-[0_0_8px_rgba(0,220,130,0.5)]"
            />
            {/* 이전 레이턴시 (점선) */}
            <path
              d="M 60 140 C 160 160, 260 150, 360 160 C 460 170, 500 150, 540 160"
              stroke="#f43f5e"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              fill="none"
              opacity="0.6"
            />

            {/* 노드 1: Client Ingress */}
            <g transform="translate(60, 90)">
              <circle r="14" fill="#121722" stroke="#00dc82" strokeWidth="2" />
              <circle r="4" fill="#00dc82" />
              <text y="30" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                Ingress (50k RPS)
              </text>
            </g>

            {/* 노드 2: Kafka Partition */}
            <g transform="translate(220, 60)">
              <circle r="16" fill="#121722" stroke="#38bdf8" strokeWidth="2" />
              <rect x="-6" y="-6" width="12" height="12" fill="#38bdf8" rx="2" />
              <text y="30" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                Kafka Partitions
              </text>
            </g>

            {/* 노드 3: Redis Sorted Set */}
            <g transform="translate(380, 110)">
              <circle r="16" fill="#121722" stroke="#10b981" strokeWidth="2" />
              <polygon points="0,-7 7,5 -7,5" fill="#10b981" />
              <text y="30" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                Redis L2 Cache
              </text>
            </g>

            {/* 노드 4: RDBMS Replica */}
            <g transform="translate(540, 90)">
              <circle r="14" fill="#121722" stroke="#a855f7" strokeWidth="2" />
              <circle r="4" fill="#a855f7" />
              <text y="30" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                Target DB (12%)
              </text>
            </g>
          </svg>

          {/* 캡션 태그 */}
          <div className="mt-4 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400">
            Figure 1.0: Realtime event ingress latency drop after cluster orchestration
          </div>
        </div>
      </div>

      {/* 6. 본문 내용 (Content) */}
      <div className="space-y-8 text-slate-300 text-[15px] sm:text-base leading-relaxed">
        {post?.content && post.id !== DEFAULT_DETAIL_POST.id ? (
          <div className="py-2">
            <MarkdownPreview content={post.content} />
          </div>
        ) : (
          <>
            {/* 인트로 단락 */}
            <p className="leading-relaxed">
          일간 정기 프로모션 이벤트 당일, 초당 동시 인입 트래픽이 50,000 RPS를 돌파하며 중앙 RDBMS의 커넥션 풀이 98%까지 치솟았습니다. 이 글에서는 단일 지점 병목을 격리하고 캐시 스탬피드(Cache Stampede) 현상을 완전히 제거하기 위해 도입한{' '}
          <strong className="text-emerald-400 font-semibold px-1 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-mono text-sm">
            Kafka Event Sourcing
          </strong>
          {' '}및{' '}
          <strong className="text-emerald-400 font-semibold px-1 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-mono text-sm">
            Redis Sorted Set
          </strong>
          {' '}다계층 캐싱 아키텍처의 엔지니어링 과정을 상세히 공유합니다.
        </p>

        {/* 핵심 요약 콜아웃 박스 */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/25 to-[#121722] border border-emerald-500/30 shadow-lg relative flex items-start gap-4">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 shrink-0 mt-0.5">
            <CompassIcon className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <span>핵심 요약</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              단순 Write-Through 방식에서 벗어나 Kafka Consumer Group 파티셔닝을 통해 쓰기 연산을 비동기 완충하고,{' '}
              <span className="text-emerald-300 font-medium">Redis Sorted Set 기반의 캐시 워밍(Warming)</span>
              {' '}파이프라인을 구축하여 99th 백분위수 지연 시간을 140ms에서 4.2ms로 97% 압축했습니다.
            </p>
          </div>
        </div>

        {/* 섹션 1: 직접 DB 조회 아키텍처의 한계와 병목 분석 */}
        <section className="space-y-4 pt-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            1. 직접 DB 조회 아키텍처의 한계와 병목 분석
          </h2>
          <p>
            기존 시스템은 클라이언트의 데이터 조회 요청이 발생할 때마다 애플리케이션 레이어에서 단일 인메모리 캐시를 확인한 뒤, 미스(Miss) 시 데이터베이스의 복합 인덱스 테이블을 직접 풀 스캔하는 구조였습니다.
          </p>

          {/* 강조 인용구 블록 */}
          <blockquote className="border-l-4 border-emerald-400 bg-[#121722]/70 p-4 sm:p-5 rounded-r-xl text-slate-200 italic font-sans text-sm sm:text-[15px] leading-relaxed my-4">
            &ldquo;트래픽 스파이크 구간에서 캐시 만료 주기가 일치하는 순간, 수만 개의 스레드가 동시에 RDBMS로 쇄도하여 커넥션 타임아웃과 스레드 풀 고갈을 초래했습니다.&rdquo;
          </blockquote>

          <p>
            주요 원인은 다음과 같은 세 가지 복합 요인이 맞물려 발생했습니다:
          </p>

          <ul className="space-y-2.5 pl-2 sm:pl-4">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
              <span>
                <strong className="text-white font-semibold">동형 키 동시 만료:</strong>{' '}
                TTL이 정적 600초로 고정되어 있어 특정 시간대에 Cache Stampede 발생.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
              <span>
                <strong className="text-white font-semibold">연결 누수:</strong>{' '}
                Connection Pool 대기 큐 오버플로우로 인한 TCP Connection Reset(RST) 패킷 급증.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
              <span>
                <strong className="text-white font-semibold">직렬화 부하:</strong>{' '}
                JSON 파싱 연산이 Node.js Event Loop 블로킹을 발생시켜 P99 레이턴시 급증.
              </span>
            </li>
          </ul>
        </section>

        {/* 섹션 2: 분산 캐시 클러스터 및 파티셔닝 전략 */}
        <section className="space-y-4 pt-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            2. 분산 캐시 클러스터 및 파티셔닝 전략
          </h2>
          <p>
            우리는 데이터 동기화를 직접 쿼리 방식 대신 분산 브로커를 활용한 토폴로지로 전면 전환했습니다. 아래는 Redis Sorted Set과 낙관적 락(Optimistic Lock)을 조합한{' '}
            <code className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-xs sm:text-sm">
              DistributedCacheManager
            </code>
            {' '}구현체입니다.
          </p>

          {/* 코드 블록 (Mac 윈도우 스타일 컨트롤 + 구문 강조 스타일 + 원클릭 복사) */}
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#090d14] shadow-2xl my-6">
            {/* 코드 상단 헤더 */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#101622] border-b border-slate-800/90 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
                </div>
                <span className="font-mono text-slate-300 text-xs ml-2">
                  cache-manager.ts
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 font-semibold">
                  TYPESCRIPT
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 코드 텍스트 영역 */}
            <pre className="p-5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-slate-300 bg-[#070b10]">
              <code>{TS_CODE_SNIPPET}</code>
            </pre>
          </div>
        </section>

        {/* 섹션 3: 성능 벤치마크 결과 비교 */}
        <section className="space-y-4 pt-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            3. 성능 벤치마크 결과 비교
          </h2>
          <p>
            개선 전/후의 성능 지표를 검증하기 위해 k6를 사용하여 60초 동안 50,000 VUs 부하 테스트를 수행했습니다. 아래 비교 테이블에서 확인할 수 있듯 기술성과 응답 속도 양쪽에서 극적인 개선이 나타났습니다.
          </p>

          {/* 벤치마크 테이블 (detail.png 기준) */}
          <div className="overflow-x-auto my-6 rounded-xl border border-slate-800 bg-[#121722]/80 shadow-xl">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0e131d] text-slate-400 font-mono text-[11px]">
                  <th className="py-3 px-4 font-semibold">평가 지표 (METRIC)</th>
                  <th className="py-3 px-4 font-semibold">BEFORE (DIRECT DB QUERY)</th>
                  <th className="py-3 px-4 font-semibold">AFTER (DISTRIBUTED CLUSTER)</th>
                  <th className="py-3 px-4 font-semibold text-right">개선 폭 (VARIANCE)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-sans">
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-white">P99 응답 시간</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">1,420 ms</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">4.2 ms</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400 text-right font-medium">
                    ▲ 99.7% 단축
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-white">최대 처리량 (Throughput)</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">3,850 RPS</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">54,200 RPS</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400 text-right font-medium">
                    ▲ 1,307% 향상
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-white">DB CPU 점유율</td>
                  <td className="py-3.5 px-4 font-mono text-rose-400 font-medium">
                    94.8% <span className="text-[10px] text-rose-500">(Danger)</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">
                    12.3% <span className="text-[10px] text-emerald-500">(Stable)</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400 text-right font-medium">
                    ▼ 82.5%p 감소
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-white">HTTP 5xx 에러율</td>
                  <td className="py-3.5 px-4 font-mono text-rose-400 font-medium">14.2%</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">0.001%</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400 text-right font-medium">
                    99.9% 무결성 유지
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        </>
        )}

        {/* 7. 하단 키워드 태그 리스트 */}
        <div className="pt-6 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 mr-1 font-medium">관련 키워드:</span>
          {(post?.tag
            ? [post.tag, ...(post.sub_tag ? [post.sub_tag] : []), 'Architecture', 'Engineering']
            : ['Kafka', 'Redis', 'DistributedSystems', 'HighTraffic']
          ).map((kw) => (
            <span
              key={kw}
              className="px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 hover:text-emerald-400 hover:bg-slate-700/80 border border-slate-700/60 font-mono transition-colors cursor-pointer"
            >
              #{kw}
            </span>
          ))}
        </div>

        {/* 8. 하단 인터랙션 반응 바 (좋아요, 북마크, 글 공유하기) */}
        <div className="py-6 my-6 border-y border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* 좋아요 버튼 */}
            <button
              type="button"
              onClick={handleToggleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isLiked
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-lg shadow-rose-500/10'
                  : 'bg-[#121722] hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <HeartIcon className={`w-4 h-4 ${isLiked ? 'fill-rose-400 stroke-rose-400' : ''}`} />
              <span className="font-mono">{likesCount}</span>
              <span>좋아요</span>
            </button>

            {/* 북마크 버튼 */}
            <button
              type="button"
              onClick={handleToggleBookmark}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                  : 'bg-[#121722] hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <BookmarkIcon
                className={`w-4 h-4 ${isBookmarked ? 'fill-emerald-400 stroke-emerald-400' : ''}`}
              />
              <span className="font-mono">{bookmarksCount}</span>
              <span>북마크</span>
            </button>
          </div>

          {/* 공유 기능 */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs text-slate-400 font-medium">글 공유하기</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleShare}
                aria-label="링크 복사"
                className="p-2 rounded-lg bg-[#121722] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                <Share2Icon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 9. 하단 저자 프로필 카드 */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#121722]/90 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500/40 shrink-0 bg-slate-800">
              <img
                src={DEFAULT_DETAIL_POST.authorAvatar}
                alt={DEFAULT_DETAIL_POST.authorName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {DEFAULT_DETAIL_POST.authorName}
                </h3>
                <span className="text-xs text-slate-400">· {DEFAULT_DETAIL_POST.authorRole}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                {DEFAULT_DETAIL_POST.authorBio}
              </p>
              <p className="text-[11px] font-mono text-slate-500 pt-1">
                {DEFAULT_DETAIL_POST.authorStats}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              isFollowing
                ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                : 'bg-[#00dc82] hover:bg-[#00c976] text-[#0B0F17] shadow-md shadow-emerald-500/20'
            }`}
          >
            {isFollowing ? '팔로잉' : '팔로우'}
          </button>
        </div>

        {/* 10. 댓글 섹션 */}
        <CommentsSection />
      </div>
    </article>
  )
}


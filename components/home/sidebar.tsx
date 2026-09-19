/* eslint-disable @next/next/no-img-element */
import React from 'react'
import {
  TrendingUpIcon,
  BarChartIcon,
  SettingsIcon,
} from '@/components/icons'

const TRENDING_TAGS = [
  { name: 'Architecture', count: 428 },
  { name: 'Performance', count: 315 },
  { name: 'Docker', count: 290 },
  { name: 'CleanCode', count: 214 },
  { name: 'PostgreSQL', count: 198 },
  { name: 'LLM', count: 182 },
  { name: 'WebAssembly', count: 104 },
  { name: 'ZeroTrust', count: 87 },
]

export function Sidebar() {
  return (
    <aside className="space-y-5">
      {/* 1. 실시간 트렌딩 태그 */}
      <div className="bg-[#121722]/90 border border-slate-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUpIcon className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">실시간 트렌딩 태그</h3>
          </div>
          <span className="text-[11px] font-medium text-slate-400">Weekly</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {TRENDING_TAGS.map((tag) => (
            <button
              key={tag.name}
              type="button"
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c1017] hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-xs transition-all cursor-pointer"
            >
              <span className="text-emerald-400 font-medium">#</span>
              <span className="text-slate-300 group-hover:text-white font-medium">
                {tag.name}
              </span>
              <span className="text-slate-500 font-mono text-[11px] ml-0.5">
                {tag.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. 주간 토픽 인덱스 */}
      <div className="bg-[#121722]/90 border border-slate-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChartIcon className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">주간 토픽 인덱스</h3>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[11px] font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            +18.4%
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          이번 주 가장 많은 토론이 발생한 도메인은 <span className="text-slate-200 font-medium">분산 시스템</span>과{' '}
          <span className="text-slate-200 font-medium">AI 모델 서빙</span>입니다.
        </p>

        {/* 차트 헤더 & 스파크라인 SVG 차트 */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <span>Activity Heat</span>
            <span className="font-mono text-[10px]">Mon - Sun</span>
          </div>

          <div className="h-16 w-full relative overflow-hidden rounded-lg bg-[#0a0d14]/80 p-1 border border-slate-800/50">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 280 60"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00dc82" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#00dc82" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* 면 채우기 */}
              <path
                d="M 0,45 Q 35,42 60,35 T 120,28 T 160,42 T 200,18 T 240,15 T 280,48 L 280,60 L 0,60 Z"
                fill="url(#chartGlow)"
              />
              {/* 곡선 라인 */}
              <path
                d="M 0,45 Q 35,42 60,35 T 120,28 T 160,42 T 200,18 T 240,15 T 280,48"
                fill="none"
                stroke="#00dc82"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. 큐레이터 초이스 (Curator's Choice) */}
      <div className="bg-[#121722]/90 border border-slate-800/80 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            CURATOR&apos;S CHOICE
          </span>
          <SettingsIcon className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer" />
        </div>

        {/* 큐레이터 정보 */}
        <div className="flex items-center gap-3.5 mb-3.5">
          <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-700/80 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
              alt="최성우 아키텍트"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">최성우 아키텍트</h4>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Fintech Platform Principal
            </p>
          </div>
        </div>

        {/* 인용문 */}
        <blockquote className="text-xs text-slate-300 italic leading-relaxed mb-4 pl-3 border-l-2 border-emerald-400/60">
          &ldquo;마이크로서비스 분할보다 중요한 것은 이벤트 드리븐 경계의 일관성 보장입니다.&rdquo;
        </blockquote>

        {/* 액션 버튼 */}
        <button
          type="button"
          className="w-full py-2.5 px-3 rounded-xl bg-[#0a0d14] hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center justify-center cursor-pointer"
        >
          엔지니어 시리즈 전체보기
        </button>
      </div>
    </aside>
  )
}


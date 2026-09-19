import React from 'react'
import { ZapIcon, GitCommitIcon } from '@/components/icons'

export function HeroSection() {
  return (
    <section className="pt-8 pb-6 border-b border-slate-800/60 relative">
      {/* 백그라운드 앰비언트 글로우 효과 */}
      <div className="absolute -top-12 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10">
        {/* 좌측: 타이틀 및 설명문 */}
        <div className="max-w-3xl space-y-3">
          {/* 상태 뱃지 */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-xs font-mono font-semibold tracking-wider text-emerald-400 uppercase">
              ENGINEERING FEED & SYSTEM LOGS <span className="text-slate-600">·</span>{' '}
              <span className="text-slate-300 font-normal">2,419 Articles Published</span>
            </span>
          </div>

          {/* 메인 타이틀 */}
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white tracking-tight leading-[1.2]">
            최신 시스템 아키텍처와
            <br />
            실전 엔지니어링 기록
          </h1>

          {/* 부제목 */}
          <p className="text-sm sm:text-[15px] text-slate-400 leading-relaxed max-w-2xl pt-1">
            실제 프로덕션 환경의 트래픽 병목 해결부터 차세대 런타임 벤치마크까지, 검증된 기술 블로그 아티클을 큐레이션합니다.
          </p>
        </div>

        {/* 우측: 실시간 메트릭 통계 카드 2종 */}
        <div className="flex items-center gap-3 sm:gap-4 self-start lg:self-end">
          {/* Active Readers */}
          <div className="bg-[#121722]/90 border border-slate-800/90 rounded-xl px-4 py-3 flex items-center gap-3.5 shadow-lg backdrop-blur-sm min-w-[160px]">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ZapIcon className="w-4 h-4 fill-blue-400/20" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Active Readers</p>
              <p className="text-sm sm:text-[15px] font-bold text-white font-mono tracking-tight mt-0.5">
                1,842 dev/s
              </p>
            </div>
          </div>

          {/* Daily Commits */}
          <div className="bg-[#121722]/90 border border-slate-800/90 rounded-xl px-4 py-3 flex items-center gap-3.5 shadow-lg backdrop-blur-sm min-w-[160px]">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <GitCommitIcon className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Daily Commits</p>
              <p className="text-sm sm:text-[15px] font-bold text-white font-mono tracking-tight mt-0.5">
                324 PRs
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


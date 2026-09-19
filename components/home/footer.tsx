import React from 'react'

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/70 bg-[#070b11] py-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* 좌측: 로고 및 저작권 문구 */}
        <div className="flex flex-wrap items-center gap-2.5 text-center md:text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white tracking-tight">DevLog</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Platform
            </span>
          </div>
          <span className="text-slate-600">·</span>
          <span>© 2024 DevLog Inc. Crafted for Systems Engineers.</span>
        </div>

        {/* 우측: 링크 목록 */}
        <div className="flex items-center gap-6 text-slate-400">
          <a
            href="#api-docs"
            className="hover:text-slate-200 transition-colors"
          >
            API Docs
          </a>
          <a
            href="#rss"
            className="hover:text-slate-200 transition-colors"
          >
            RSS Feed
          </a>
          <a
            href="#terms"
            className="hover:text-slate-200 transition-colors"
          >
            Terms
          </a>
          <a
            href="#privacy"
            className="hover:text-slate-200 transition-colors"
          >
            Privacy
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-200 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}


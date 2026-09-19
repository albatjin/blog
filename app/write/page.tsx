import React from 'react'
import { Metadata } from 'next'
import { Navbar } from '@/components/home/navbar'
import { WriteEditor } from '@/components/write/write-editor'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '새 글 작성 - DevLog',
  description: 'DevLog 마크다운 에디터로 고품질 엔지니어링 기술 블로그 글을 작성하고 발행하세요.',
}

export default function WritePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* 상단 글로벌 내비게이션 바 */}
      <Navbar />

      {/* 메인 에디터 콘텐츠 */}
      <main className="flex-1 flex flex-col w-full pb-6">
        <WriteEditor />
      </main>
    </div>
  )
}


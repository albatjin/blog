import React from 'react'
import { Metadata } from 'next'
import { Navbar } from '@/components/home/navbar'
import { Footer } from '@/components/home/footer'
import { PostDetailView } from '@/components/blog/post-detail-view'
import { createClient } from '@/lib/supabase/server'
import type { Post } from '@/types/blog'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  try {
    const supabase = await createClient()
    const { data: post } = await supabase
      .from('posts')
      .select('title, excerpt')
      .or(`id.eq.${id},slug.eq.${id}`)
      .single()

    if (post) {
      return {
        title: `${post.title} - DevLog`,
        description: post.excerpt,
      }
    }
  } catch {
    // Fallback
  }

  return {
    title: '대규모 트래픽 처리를 위한 Kafka & Redis 아키텍처 개선기 - DevLog',
    description: '초당 12만 TPS 급증 상황에서 분산 락과 캐시 워밍 파이프라인을 최적화한 실전 장애 회고록',
  }
}

export default async function PostDetailPage({ params }: PageProps) {
  const { id } = await params
  let postData: Post | undefined

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .or(`id.eq.${id},slug.eq.${id}`)
      .single()

    if (!error && data) {
      postData = data as Post
    }
  } catch {
    // Fallback to initial mock if DB table is not ready or during offline dev
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* 글로벌 상단 헤더 */}
      <Navbar />

      {/* 메인 상세 페이지 콘텐츠 컨테이너 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <PostDetailView post={postData} />
      </main>

      {/* 글로벌 하단 푸터 */}
      <Footer />
    </div>
  )
}


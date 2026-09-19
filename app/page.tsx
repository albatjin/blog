import { Navbar } from '@/components/home/navbar'
import { HeroSection } from '@/components/home/hero-section'
import { BlogFeed } from '@/components/home/blog-feed'
import { Sidebar } from '@/components/home/sidebar'
import { Footer } from '@/components/home/footer'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* 상단 네비게이션 헤더 */}
      <Navbar />

      {/* 메인 콘텐츠 컨테이너 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* 히어로 타이틀 & 통계 섹션 */}
        <HeroSection />

        {/* 2열 메인 레이아웃: 좌측 피드 + 우측 사이드바 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 좌측 블로그 포스트 피드 & 카테고리 필터 & 페이지네이션 */}
          <section className="lg:col-span-8">
            <BlogFeed />
          </section>

          {/* 우측 사이드바 (트렌딩 태그, 주간 토픽 차트, 큐레이터 초이스) */}
          <aside className="lg:col-span-4 sticky top-24">
            <Sidebar />
          </aside>
        </div>
      </main>

      {/* 최하단 푸터 */}
      <Footer />
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { AuthCard } from './auth-card'
import { signOutAction } from './actions'
import Link from 'next/link'
import {
  TerminalIcon as Terminal,
  LogOutIcon as LogOut,
  CheckCircleIcon as CheckCircle2,
  UserIcon as User,
  KeyIcon as KeyRound,
  ArrowRightIcon,
} from '@/components/icons'

export const dynamic = 'force-dynamic'

export default async function AuthPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#0B0F17] text-slate-100 relative overflow-hidden">
        {/* 배경 글로우 효과 */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mb-6 flex items-center justify-between w-full max-w-md px-2 z-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <span>← 메인 피드로 돌아가기</span>
          </Link>
        </div>

        <div className="relative z-10 w-full">
          <AuthCard />
        </div>
      </main>
    )
  }

  // 로그인 상태인 경우
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#0B0F17] text-slate-100 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* 상단 로고 */}
        <div className="flex items-center justify-between mb-8 px-1">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              <Terminal className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold tracking-tight text-white">DevLog</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1"></span>
            </div>
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#161c28] border border-slate-800 text-xs font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>인증됨</span>
          </div>
        </div>

        {/* 로그인 정보 카드 */}
        <div className="bg-[#121722]/95 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>이메일 인증 완료</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5 truncate max-w-[240px]">
                {user.email}
              </h2>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a0d14] border border-slate-800/80 text-xs">
              <span className="text-slate-400 flex items-center gap-2">
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                계정 식별자 (UID)
              </span>
              <span className="font-mono text-slate-300 text-[11px] truncate max-w-[160px]">
                {user.id}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0a0d14] border border-slate-800/80 text-xs">
              <span className="text-slate-400">마지막 로그인</span>
              <span className="text-slate-300">
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString('ko-KR')
                  : '방금 전'}
              </span>
            </div>
          </div>

          {/* 홈으로 이동 버튼 */}
          <div className="mb-3">
            <Link
              href="/"
              className="w-full py-3 px-4 rounded-xl font-medium text-sm text-black bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <span>홈페이지로 이동</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          {/* 로그아웃 액션 폼 */}
          <form action={signOutAction}>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-medium text-sm text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>로그아웃 (Sign Out)</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}


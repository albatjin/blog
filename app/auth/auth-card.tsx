'use client'

import { useState, useActionState, useTransition } from 'react'
import {
  TerminalIcon as Terminal,
  AtSignIcon as AtSign,
  LockIcon as Lock,
  EyeIcon as Eye,
  EyeOffIcon as EyeOff,
  ArrowRightIcon as ArrowRight,
  ShieldCheckIcon as ShieldCheck,
  CodeXmlIcon as CodeXml,
  LoaderIcon as Loader2,
  CheckCircleIcon as CheckCircle2,
  AlertCircleIcon as AlertCircle,
} from '@/components/icons'
import { signInAction, signUpAction, AuthState } from './actions'

interface AuthCardProps {
  initialMode?: 'signin' | 'signup'
}

export function AuthCard({ initialMode = 'signin' }: AuthCardProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isPending, startTransition] = useTransition()

  const [signInState, signInFormAction] = useActionState<AuthState | null, FormData>(
    signInAction,
    null
  )
  const [signUpState, signUpFormAction] = useActionState<AuthState | null, FormData>(
    signUpAction,
    null
  )

  const currentState = mode === 'signin' ? signInState : signUpState

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(() => {
      if (mode === 'signin') {
        signInFormAction(formData)
      } else {
        signUpFormAction(formData)
      }
    })
  }

  return (
    <div className="w-full max-w-[480px] mx-auto">
      {/* 상단 로고 & 버전 배지 */}
      <div className="flex items-center justify-between mb-8 px-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 shadow-inner shadow-emerald-500/10">
            <Terminal className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold tracking-tight text-white">DevLog</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1"></span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#161c28]/90 border border-slate-800 text-xs font-mono text-slate-400 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>v2.4.0</span>
        </div>
      </div>

      {/* 메인 인증 카드 */}
      <div className="bg-[#121722]/95 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-black/80 transition-all">
        {/* 헤더 텍스트 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            DevLog에 오신 것을 환영합니다
          </h1>
          <p className="text-sm text-slate-400 mt-2 font-normal">
            최고의 기술 아티클과 개발 경험을 공유하는 커뮤니티
          </p>
        </div>

        {/* 탭 세그먼트 컨트롤 */}
        <div className="grid grid-cols-2 p-1 bg-[#0a0d14] rounded-xl border border-slate-800/90 mb-6">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`py-2 text-xs md:text-sm font-medium rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-[#222b3d] text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            로그인 (Sign In)
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2 text-xs md:text-sm font-medium rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-[#222b3d] text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            회원가입 (Sign Up)
          </button>
        </div>

        {/* 상태 메시지 배너 */}
        {currentState?.error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{currentState.error}</span>
          </div>
        )}
        {currentState?.success && currentState.message && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{currentState.message}</span>
          </div>
        )}

        {/* 폼 영역 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이메일 계정 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              이메일 계정
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <AtSign className="w-4 h-4" />
              </div>
              <input
                type="email"
                name="email"
                required
                placeholder="name@domain.com"
                className="w-full bg-[#0a0d14] border border-slate-800/90 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder="••••••••••••"
                className="w-full bg-[#0a0d14] border border-slate-800/90 rounded-xl py-3 pl-10 pr-11 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* 회원가입 시 비밀번호 확인 */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                비밀번호 확인
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="passwordConfirm"
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#0a0d14] border border-slate-800/90 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* 로그인 옵션 (로그인 모드) */}
          {mode === 'signin' && (
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-[#0a0d14] text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer accent-emerald-500"
                />
                <span className="text-xs text-slate-300">로그인 유지</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  alert('비밀번호 재설정 기능은 이메일 계정을 통해 지원됩니다.')
                }
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                비밀번호 찾기
              </button>
            </div>
          )}

          {/* 메인 CTA 버튼 */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-6 py-3.5 px-4 rounded-xl font-semibold text-sm text-slate-950 bg-[#00C781] hover:bg-[#00B273] active:scale-[0.99] transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>처리 중...</span>
              </>
            ) : mode === 'signin' ? (
              <>
                <span>로그인 (Continue)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>회원가입 (Sign Up)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 카드 내부 하단 약관 안내 */}
        <div className="border-t border-slate-800/80 pt-5 mt-6 text-center text-xs text-slate-400 leading-relaxed">
          가입하시면 DevLog의{' '}
          <span className="text-slate-300 hover:underline cursor-pointer">이용약관</span> 및{' '}
          <span className="text-slate-300 hover:underline cursor-pointer">
            개인정보 처리방침
          </span>
          에 동의하게 됩니다.
        </div>
      </div>

      {/* 카드 하단 바깥 전환 링크 */}
      <div className="text-center mt-6 text-xs text-slate-400">
        {mode === 'signin' ? (
          <>
            아직 회원이 아니신가요?{' '}
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="text-emerald-400 hover:text-emerald-300 font-medium ml-1 transition-colors cursor-pointer"
            >
              간편 회원가입
            </button>
          </>
        ) : (
          <>
            이미 계정이 있으신가요?{' '}
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="text-emerald-400 hover:text-emerald-300 font-medium ml-1 transition-colors cursor-pointer"
            >
              로그인하기
            </button>
          </>
        )}
      </div>

      {/* 최하단 보안 및 기능 뱃지 */}
      <div className="flex items-center justify-center gap-6 mt-8 text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>256-bit TLS 암호화</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CodeXml className="w-4 h-4 text-emerald-400" />
          <span>Markdown & TeX 지원</span>
        </div>
      </div>
    </div>
  )
}

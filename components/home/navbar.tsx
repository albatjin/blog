/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  TerminalIcon,
  SearchIcon,
  PlusIcon,
  MoonIcon,
  BellIcon,
  LogOutIcon,
  LogInIcon,
  UserIcon,
} from '@/components/icons'
import type { User } from '@supabase/supabase-js'

export function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    // 현재 세션 확인
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsDropdownOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#0B0F17]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* 좌측: 로고 및 내비게이션 메뉴 */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:border-emerald-400 transition-colors">
              <TerminalIcon className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">DevLog</span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                v2.4
              </span>
            </div>
          </Link>

          {/* 메인 메뉴 항목 */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-[#161f2e] text-white border border-slate-700/40 shadow-sm"
            >
              피드
            </Link>
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
            >
              트렌딩
            </button>
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
            >
              시리즈
            </button>
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
            >
              태그
            </button>
          </nav>
        </div>

        {/* 중앙: 검색 바 */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="검색 (Cmd+K)"
              className="w-full bg-[#121722] text-sm text-slate-200 placeholder-slate-500 rounded-xl pl-10 pr-12 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
            />
            <kbd className="absolute right-3 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700/60 rounded pointer-events-none">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* 우측: 액션 버튼 & 인증 네비게이션 */}
        <div className="flex items-center gap-3">
          {/* 새 글 작성 버튼 */}
          <Link
            href="/write"
            onClick={() => router.push('/write')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00dc82] hover:bg-[#00c976] text-[#0B0F17] font-semibold text-sm rounded-lg shadow-sm shadow-emerald-500/10 transition-colors cursor-pointer active:scale-98"
          >
            <PlusIcon className="w-4 h-4 stroke-[2.5]" />
            <span>새 글 작성</span>
          </Link>

          {/* 다크/라이트 모드 토글 아이콘 */}
          <button
            type="button"
            aria-label="화면 모드 전환"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800 transition-colors"
          >
            <MoonIcon className="w-4 h-4" />
          </button>

          {/* 알림 벨 아이콘 */}
          <button
            type="button"
            aria-label="알림"
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800 transition-colors"
          >
            <BellIcon className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-[#0B0F17]"></span>
          </button>

          {/* 사용자 아바타 / 로그인 네비게이션 */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <div>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-9 h-9 rounded-full overflow-hidden border border-emerald-500/50 hover:ring-2 hover:ring-emerald-400/30 transition-all flex items-center justify-center bg-slate-800"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="사용자 프로필"
                    className="w-full h-full object-cover"
                  />
                </button>

                {/* 프로필 드롭다운 메뉴 */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#121722] border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">로그인 계정</p>
                      <p className="text-sm font-semibold text-white truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/auth"
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-800/60 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-400" />
                      <span>계정 정보 관리</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                    >
                      <LogOutIcon className="w-4 h-4 text-rose-400" />
                      <span>로그아웃</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-colors"
                >
                  <LogInIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>로그인</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}


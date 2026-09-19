'use client'

import React, { useState } from 'react'
import { ImageIcon, XIcon, CheckIcon } from '@/components/icons'

interface CoverImageModalProps {
  isOpen: boolean
  currentImage?: string
  onClose: () => void
  onSave: (imageUrl: string) => void
}

const PRESET_IMAGES = [
  {
    title: '시스템 & 네트워크',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: '모던 개발 & 코드',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: '클라우드 & 인프라',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Rust & 하드웨어',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'AI & 알고리즘',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: '사이버펑크 네온',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
  },
]

export function CoverImageModal({ isOpen, currentImage = '', onClose, onSave }: CoverImageModalProps) {
  const [imageUrl, setImageUrl] = useState(currentImage)

  if (!isOpen) return null

  const handleApply = () => {
    onSave(imageUrl.trim())
    onClose()
  }

  const handleRemove = () => {
    setImageUrl('')
    onSave('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-[#121722] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">커버 이미지 설정</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 직접 URL 입력 */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">이미지 직접 입력 (URL)</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-[#0e131c] text-sm text-slate-200 placeholder-slate-500 rounded-xl px-4 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 font-mono transition-colors"
          />
        </div>

        {/* 프리셋 추천 이미지 */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400">추천 기술 테마 이미지 선택</span>
          <div className="grid grid-cols-3 gap-2.5">
            {PRESET_IMAGES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setImageUrl(preset.url)}
                className={`group relative aspect-[16/10] rounded-lg overflow-hidden border transition-all cursor-pointer ${
                  imageUrl === preset.url
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preset.url}
                  alt={preset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end p-1.5">
                  <span className="text-[10px] text-white font-medium truncate w-full">{preset.title}</span>
                </div>
                {imageUrl === preset.url && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center">
                    <CheckIcon className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 이미지 미리보기 */}
        {imageUrl && (
          <div className="space-y-1.5">
            <span className="text-xs text-slate-400">선택된 미리보기</span>
            <div className="relative aspect-[21/9] rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="커버 미리보기" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            이미지 삭제
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#00dc82] hover:bg-[#00c976] text-[#0B0F17] transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
            >
              적용하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


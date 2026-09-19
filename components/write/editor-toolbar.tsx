'use client'

import React, { useState } from 'react'
import {
  LinkIcon,
  ImageIcon,
  CodeXmlIcon,
  QuoteIcon,
  TableIcon,
  ListIcon,
  ListOrderedIcon,
  CheckSquareIcon,
  KeyboardIcon,
  XIcon,
} from '@/components/icons'

interface EditorToolbarProps {
  onInsertSyntax: (prefix: string, suffix?: string, defaultText?: string) => void
}

export function EditorToolbar({ onInsertSyntax }: EditorToolbarProps) {
  const [showShortcutsModal, setShowShortcutsModal] = useState(false)

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-[#121722]/90 border-b border-slate-800/80 text-xs">
        {/* 포맷팅 버튼 그룹 */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-slate-300">
          {/* 헤딩 버튼 */}
          <button
            type="button"
            title="제목 1 (H1)"
            onClick={() => onInsertSyntax('# ', '', '제목 1')}
            className="px-2 py-1 rounded font-bold hover:bg-slate-800 hover:text-emerald-400 transition-colors cursor-pointer text-slate-300"
          >
            H1
          </button>
          <button
            type="button"
            title="제목 2 (H2)"
            onClick={() => onInsertSyntax('## ', '', '제목 2')}
            className="px-2 py-1 rounded font-bold hover:bg-slate-800 hover:text-emerald-400 transition-colors cursor-pointer text-slate-300"
          >
            H2
          </button>
          <button
            type="button"
            title="제목 3 (H3)"
            onClick={() => onInsertSyntax('### ', '', '제목 3')}
            className="px-2 py-1 rounded font-bold hover:bg-slate-800 hover:text-emerald-400 transition-colors cursor-pointer text-slate-300"
          >
            H3
          </button>

          <span className="w-px h-4 bg-slate-800 mx-1"></span>

          {/* 굵게, 기울임, 취소선 */}
          <button
            type="button"
            title="굵게 (Cmd+B)"
            onClick={() => onInsertSyntax('**', '**', '굵은 텍스트')}
            className="w-7 h-7 flex items-center justify-center rounded font-bold hover:bg-slate-800 hover:text-emerald-400 transition-colors cursor-pointer text-slate-300 text-[13px]"
          >
            B
          </button>
          <button
            type="button"
            title="기울임 (Cmd+I)"
            onClick={() => onInsertSyntax('*', '*', '기울임 텍스트')}
            className="w-7 h-7 flex items-center justify-center rounded italic font-serif hover:bg-slate-800 hover:text-emerald-400 transition-colors cursor-pointer text-slate-300 text-[14px]"
          >
            I
          </button>
          <button
            type="button"
            title="취소선"
            onClick={() => onInsertSyntax('~~', '~~', '취소선 텍스트')}
            className="w-7 h-7 flex items-center justify-center rounded line-through hover:bg-slate-800 hover:text-emerald-400 transition-colors cursor-pointer text-slate-300 text-[13px]"
          >
            S
          </button>

          <span className="w-px h-4 bg-slate-800 mx-1"></span>

          {/* 인용구 */}
          <button
            type="button"
            title="인용구"
            onClick={() => onInsertSyntax('> ', '', '인용할 문장을 입력하세요.')}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 hover:text-slate-200"
          >
            <QuoteIcon className="w-3.5 h-3.5" />
          </button>

          {/* 코드 블록 */}
          <button
            type="button"
            title="코드 블록"
            onClick={() => onInsertSyntax('```typescript\n', '\n```', '// 코드를 입력하세요')}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 hover:text-slate-200"
          >
            <CodeXmlIcon className="w-4 h-4" />
          </button>

          {/* 링크 */}
          <button
            type="button"
            title="링크 삽입"
            onClick={() => onInsertSyntax('[', '](https://example.com)', '링크 텍스트')}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 hover:text-slate-200"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>

          {/* 이미지 */}
          <button
            type="button"
            title="이미지 삽입"
            onClick={() => onInsertSyntax('![', '](https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800)', '이미지 설명')}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 hover:text-slate-200"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>

          {/* 테이블 */}
          <button
            type="button"
            title="표(Table) 삽입"
            onClick={() => onInsertSyntax('\n| 헤더 1 | 헤더 2 | 헤더 3 |\n|---|---|---|\n| 값 1 | 값 2 | 값 3 |\n')}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 hover:text-slate-200"
          >
            <TableIcon className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-4 bg-slate-800 mx-1"></span>

          {/* 불릿 리스트 */}
          <button
            type="button"
            title="글머리 기호 목록"
            onClick={() => onInsertSyntax('- ', '', '목록 항목')}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 hover:text-slate-200"
          >
            <ListIcon className="w-3.5 h-3.5" />
          </button>

          {/* 순서 리스트 */}
          <button
            type="button"
            title="번호 매기기 목록"
            onClick={() => onInsertSyntax('1. ', '', '순서 항목')}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 hover:text-slate-200"
          >
            <ListOrderedIcon className="w-3.5 h-3.5" />
          </button>

          {/* 체크리스트 */}
          <button
            type="button"
            title="체크리스트"
            onClick={() => onInsertSyntax('- [ ] ', '', '할 일 항목')}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 hover:text-emerald-400 transition-colors cursor-pointer text-slate-400 hover:text-slate-200"
          >
            <CheckSquareIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 우측: 단축키 가이드 버튼 */}
        <button
          type="button"
          onClick={() => setShowShortcutsModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border border-slate-800 transition-colors cursor-pointer"
        >
          <KeyboardIcon className="w-3.5 h-3.5" />
          <span>단축키 가이드</span>
        </button>
      </div>

      {/* 단축키 가이드 모달 */}
      {showShortcutsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-[#121722] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <KeyboardIcon className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">마크다운 & 에디터 단축키</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-semibold text-emerald-400 mb-2 font-mono"># 서식 단축키 (Keyboard)</h4>
                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span>굵게 (Bold)</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-emerald-300">
                      Ctrl/Cmd + B
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span>기울임 (Italic)</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-emerald-300">
                      Ctrl/Cmd + I
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span>임시저장</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-emerald-300">
                      Ctrl/Cmd + S
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span>들여쓰기 (2칸)</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-emerald-300">
                      Tab
                    </kbd>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-emerald-400 mb-2 font-mono"># 마크다운 문법 (Markdown Syntax)</h4>
                <div className="space-y-1.5 text-slate-300 font-mono text-[11px]">
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/50">
                    <span className="text-slate-400"># 대제목 (H1)</span>
                    <code className="text-emerald-300"># 제목</code>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/50">
                    <span className="text-slate-400">## 중제목 (H2)</span>
                    <code className="text-emerald-300">## 소제목</code>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/50">
                    <span className="text-slate-400">인라인 코드</span>
                    <code className="text-emerald-300">`code`</code>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/50">
                    <span className="text-slate-400">코드 블록</span>
                    <code className="text-emerald-300">```언어 ... ```</code>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/50">
                    <span className="text-slate-400">인용구</span>
                    <code className="text-emerald-300">&gt; 문장</code>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900/50">
                    <span className="text-slate-400">체크리스트</span>
                    <code className="text-emerald-300">- [ ] 할일 / - [x] 완료</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


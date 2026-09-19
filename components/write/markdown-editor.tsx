'use client'

import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { CodeXmlIcon } from '@/components/icons'

export interface MarkdownEditorRef {
  insertSyntax: (prefix: string, suffix?: string, defaultText?: string) => void
  focus: () => void
}

interface MarkdownEditorProps {
  content: string
  onChange: (value: string) => void
  onSave?: () => void
}

export const MarkdownEditor = forwardRef<MarkdownEditorRef, MarkdownEditorProps>(function MarkdownEditor(
  { content, onChange, onSave },
  ref
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)
  const [lineCount, setLineCount] = useState(1)

  // 줄 수 계산
  useEffect(() => {
    const lines = content.split('\n').length
    setLineCount(Math.max(lines, 25))
  }, [content])

  // 스크롤 동기화 (에디터 본문과 좌측 라인 넘버 거터)
  const handleScroll = () => {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  // 문법 삽입 메서드 노출
  useImperativeHandle(ref, () => ({
    focus: () => {
      textareaRef.current?.focus()
    },
    insertSyntax: (prefix: string, suffix = '', defaultText = '') => {
      const textarea = textareaRef.current
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selected = content.substring(start, end)
      const textToInsert = selected || defaultText

      const newContent =
        content.substring(0, start) + prefix + textToInsert + suffix + content.substring(end)

      onChange(newContent)

      // 포커스 복원 및 커서 위치 재지정
      setTimeout(() => {
        textarea.focus()
        const newCursorPos = start + prefix.length + textToInsert.length
        textarea.setSelectionRange(
          selected ? start + prefix.length : newCursorPos,
          selected ? newCursorPos : newCursorPos
        )
      }, 0)
    },
  }))

  // 키보드 단축키 핸들러 (Tab, Cmd/Ctrl+B, Cmd/Ctrl+I, Cmd/Ctrl+S)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current
    if (!textarea) return

    // Cmd/Ctrl + S : 임시저장
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
      e.preventDefault()
      onSave?.()
      return
    }

    // Cmd/Ctrl + B : 볼드
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault()
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selected = content.substring(start, end) || '굵은 텍스트'
      const newContent = content.substring(0, start) + `**${selected}**` + content.substring(end)
      onChange(newContent)
      setTimeout(() => {
        textarea.setSelectionRange(start + 2, start + 2 + selected.length)
      }, 0)
      return
    }

    // Cmd/Ctrl + I : 이탤릭
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault()
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selected = content.substring(start, end) || '기울임'
      const newContent = content.substring(0, start) + `*${selected}*` + content.substring(end)
      onChange(newContent)
      setTimeout(() => {
        textarea.setSelectionRange(start + 1, start + 1 + selected.length)
      }, 0)
      return
    }

    // Tab : 2칸 스페이스 들여쓰기
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      if (e.shiftKey) {
        // Shift + Tab: 2칸 내어쓰기
        const before = content.substring(0, start)
        const lineStart = before.lastIndexOf('\n') + 1
        const linePrefix = content.substring(lineStart, lineStart + 2)
        if (linePrefix === '  ') {
          const newContent = content.substring(0, lineStart) + content.substring(lineStart + 2)
          onChange(newContent)
          setTimeout(() => {
            textarea.setSelectionRange(Math.max(lineStart, start - 2), Math.max(lineStart, end - 2))
          }, 0)
        }
      } else {
        // Tab: 2칸 들여쓰기
        const newContent = content.substring(0, start) + '  ' + content.substring(end)
        onChange(newContent)
        setTimeout(() => {
          textarea.setSelectionRange(start + 2, start + 2)
        }, 0)
      }
    }
  }

  // 줄 번호 배열 생성
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1)
  const charCount = content.length
  const wordsCount = content.trim() ? content.trim().split(/\s+/).length : 0

  return (
    <div className="flex flex-col h-full min-h-[500px] bg-[#0a0e17] border border-slate-800/90 rounded-b-2xl overflow-hidden shadow-2xl">
      {/* 에디터 서브헤더 (write.png 상단 'MARKDOWN SOURCE' 바) */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 bg-[#101520] border-b border-slate-800/80 text-xs font-mono select-none">
        <div className="flex items-center gap-2">
          <CodeXmlIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-slate-200 tracking-wider text-[11px]">
            MARKDOWN SOURCE
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span>{lineNumbers.length} 줄</span>
          <span className="text-slate-600">•</span>
          <span>{wordsCount} 단어</span>
          <span className="text-slate-600">•</span>
          <span>{charCount} 자</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400/90 font-medium">UTF-8 • LF</span>
        </div>
      </div>

      {/* 메인 에디터 (거터 + 텍스트영역) */}
      <div className="relative flex-1 min-h-0 flex overflow-hidden">
        {/* 좌측 줄 번호 거터 (Line Numbers) */}
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="w-12 sm:w-14 shrink-0 h-full bg-[#0c101a] border-r border-slate-800/70 py-4 select-none overflow-y-hidden text-right font-mono text-[13px] leading-6 text-slate-600 font-medium pr-3"
        >
          {lineNumbers.map((num) => (
            <div key={num} className="h-6">
              {num}
            </div>
          ))}
        </div>

        {/* 텍스트 입력창 */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          placeholder={`# 제목과 본문을 마크다운 문법으로 자유롭게 작성해 보세요...

- 상단 서식 툴바(H1, H2, Bold, Code, Table 등)를 클릭하여 서식을 빠르게 삽입할 수 있습니다.
- 우측 상단의 [예시 불러오기] 버튼을 클릭하면 write.png 샘플 문서를 바로 불러와 확인할 수 있습니다.`}
          spellCheck={false}
          className="flex-1 min-h-0 w-full h-full bg-transparent text-slate-200 font-mono text-[13px] sm:text-sm leading-6 p-4 outline-none resize-none overflow-y-auto selection:bg-emerald-500/30 selection:text-emerald-200 placeholder-slate-500 focus:ring-0 whitespace-pre"
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  )
})


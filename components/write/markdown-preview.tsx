'use client'

import React, { useState } from 'react'
import { CopyIcon, CheckIcon } from '@/components/icons'

interface MarkdownPreviewProps {
  content: string
  className?: string
}

export function MarkdownPreview({ content, className = '' }: MarkdownPreviewProps) {
  if (!content || !content.trim()) {
    return (
      <div className={`p-8 text-center text-slate-500 font-mono text-sm ${className}`}>
        <p>작성된 마크다운 내용이 없습니다.</p>
        <p className="text-xs text-slate-600 mt-1">좌측 에디터에서 글을 작성하면 실시간 미리보기가 렌더링됩니다.</p>
      </div>
    )
  }

  // 간단하고 안전한 마크다운 파서 및 렌더러
  const elements = parseMarkdownToBlocks(content)

  return (
    <div className={`prose-devlog space-y-5 text-slate-300 text-[15px] leading-relaxed select-text ${className}`}>
      {elements.map((block, idx) => (
        <React.Fragment key={idx}>{renderBlock(block)}</React.Fragment>
      ))}
    </div>
  )
}

type Block =
  | { type: 'h1'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'h4'; text: string }
  | { type: 'codeblock'; lang: string; code: string }
  | { type: 'blockquote'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'checklist'; items: { checked: boolean; text: string }[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'hr' }
  | { type: 'image'; alt: string; src: string }
  | { type: 'p'; text: string }

function parseMarkdownToBlocks(md: string): Block[] {
  const lines = md.split(/\r?\n/)
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code block ```
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      blocks.push({
        type: 'codeblock',
        lang: lang || 'bash',
        code: codeLines.join('\n'),
      })
      i++
      continue
    }

    // Horizontal Rule
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(line.trim())) {
      blocks.push({ type: 'hr' })
      i++
      continue
    }

    // Headings
    if (line.startsWith('# ')) {
      blocks.push({ type: 'h1', text: line.slice(2).trim() })
      i++
      continue
    }
    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: line.slice(3).trim() })
      i++
      continue
    }
    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', text: line.slice(4).trim() })
      i++
      continue
    }
    if (line.startsWith('#### ')) {
      blocks.push({ type: 'h4', text: line.slice(5).trim() })
      i++
      continue
    }

    // Blockquote
    if (line.startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      blocks.push({
        type: 'blockquote',
        text: quoteLines.join('\n'),
      })
      continue
    }

    // Task list items
    if (/^[-*]\s+\[([ xX])\]\s+/.test(line)) {
      const items: { checked: boolean; text: string }[] = []
      while (i < lines.length && /^[-*]\s+\[([ xX])\]\s+/.test(lines[i])) {
        const match = lines[i].match(/^[-*]\s+\[([ xX])\]\s+(.*)$/)
        if (match) {
          items.push({
            checked: match[1].toLowerCase() === 'x',
            text: match[2],
          })
        }
        i++
      }
      blocks.push({ type: 'checklist', items })
      continue
    }

    // Unordered list
    if (/^[-*+]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*+]\s+/, ''))
        i++
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''))
        i++
      }
      blocks.push({ type: 'ol', items })
      continue
    }

    // Table
    if (line.includes('|') && i + 1 < lines.length && lines[i + 1].includes('|') && lines[i + 1].includes('-')) {
      const headers = line.split('|').map((s) => s.trim()).filter((s, idx, arr) => idx !== 0 && idx !== arr.length - 1)
      i += 2 // skip header and separator
      const rows: string[][] = []
      while (i < lines.length && lines[i].includes('|')) {
        const cells = lines[i].split('|').map((s) => s.trim()).filter((s, idx, arr) => idx !== 0 && idx !== arr.length - 1)
        if (cells.length > 0) {
          rows.push(cells)
        }
        i++
      }
      blocks.push({ type: 'table', headers, rows })
      continue
    }

    // Standalone image: ![alt](url)
    const imgMatch = line.trim().match(/^!\[(.*?)\]\((.*?)\)$/)
    if (imgMatch) {
      blocks.push({ type: 'image', alt: imgMatch[1], src: imgMatch[2] })
      i++
      continue
    }

    // Blank line
    if (!line.trim()) {
      i++
      continue
    }

    // Paragraph (collect contiguous lines)
    const paraLines: string[] = [line]
    i++
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !lines[i].startsWith('>') &&
      !/^[-*+]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !lines[i].includes('|') &&
      !lines[i].trim().match(/^!\[(.*?)\]\((.*?)\)$/)
    ) {
      paraLines.push(lines[i])
      i++
    }
    blocks.push({ type: 'p', text: paraLines.join('\n') })
  }

  return blocks
}

function renderBlock(block: Block) {
  switch (block.type) {
    case 'h1':
      return (
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-4 pb-2 border-b border-slate-800/80">
          <InlineContent text={block.text} />
        </h1>
      )
    case 'h2':
      return (
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-4 pb-1.5 border-b border-slate-800/50">
          <InlineContent text={block.text} />
        </h2>
      )
    case 'h3':
      return (
        <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight pt-3">
          <InlineContent text={block.text} />
        </h3>
      )
    case 'h4':
      return (
        <h4 className="text-base sm:text-lg font-semibold text-emerald-400 tracking-tight pt-2">
          <InlineContent text={block.text} />
        </h4>
      )
    case 'codeblock':
      return <CodeBlock lang={block.lang} code={block.code} />
    case 'blockquote':
      return (
        <blockquote className="border-l-4 border-emerald-400 bg-[#121722]/80 p-4 sm:p-5 rounded-r-xl text-slate-200 italic text-sm sm:text-[15px] my-3">
          <InlineContent text={block.text} />
        </blockquote>
      )
    case 'ul':
      return (
        <ul className="space-y-2 pl-5 list-disc marker:text-emerald-400 text-slate-300">
          {block.items.map((item, i) => (
            <li key={i}>
              <InlineContent text={item} />
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol className="space-y-2 pl-5 list-decimal marker:text-emerald-400 text-slate-300 font-mono">
          {block.items.map((item, i) => (
            <li key={i} className="font-sans">
              <InlineContent text={item} />
            </li>
          ))}
        </ol>
      )
    case 'checklist':
      return (
        <div className="space-y-2 pl-1">
          {block.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={item.checked}
                readOnly
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0 focus:ring-offset-0 pointer-events-none"
              />
              <span className={item.checked ? 'line-through text-slate-500' : ''}>
                <InlineContent text={item.text} />
              </span>
            </div>
          ))}
        </div>
      )
    case 'table':
      return (
        <div className="my-4 overflow-x-auto rounded-xl border border-slate-800 bg-[#121722]/60">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#161f2e] border-b border-slate-800 text-slate-200 uppercase text-xs font-mono">
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i} className="py-3 px-4 font-semibold">
                    <InlineContent text={h} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {block.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-800/30 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="py-2.5 px-4 font-normal">
                      <InlineContent text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'hr':
      return <hr className="border-slate-800 my-6" />
    case 'image':
      return (
        <div className="my-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.src} alt={block.alt} className="w-full max-h-[480px] object-cover" />
          {block.alt && <p className="text-center text-xs text-slate-400 py-2 bg-[#0e131c]">{block.alt}</p>}
        </div>
      )
    case 'p':
      return (
        <p className="leading-relaxed text-slate-300">
          <InlineContent text={block.text} />
        </p>
      )
  }
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-slate-800 bg-[#0e131c] font-mono text-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-[#121722] border-b border-slate-800/80">
        <span className="text-xs text-emerald-400 font-semibold uppercase">{lang || 'text'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">복사됨</span>
            </>
          ) : (
            <>
              <CopyIcon className="w-3.5 h-3.5" />
              <span>코드 복사</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-slate-200 leading-relaxed font-mono text-xs sm:text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function InlineContent({ text }: { text: string }) {
  if (!text) return null

  // 간단한 정규식 기반 인라인 렌더링: bold, italic, code, link, strike
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/)
    if (codeMatch) {
      parts.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded bg-[#161f2e] text-emerald-300 font-mono text-[13px] border border-slate-700/60"
        >
          {codeMatch[1]}
        </code>
      )
      remaining = remaining.slice(codeMatch[0].length)
      continue
    }

    // Bold: **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/)
    if (boldMatch) {
      parts.push(
        <strong key={key++} className="font-bold text-white">
          {boldMatch[1]}
        </strong>
      )
      remaining = remaining.slice(boldMatch[0].length)
      continue
    }

    // Strikethrough: ~~text~~
    const strikeMatch = remaining.match(/^~~([^~]+)~~/)
    if (strikeMatch) {
      parts.push(
        <del key={key++} className="line-through text-slate-500">
          {strikeMatch[1]}
        </del>
      )
      remaining = remaining.slice(strikeMatch[0].length)
      continue
    }

    // Italic: *text* or _text_
    const italicMatch = remaining.match(/^(\*|_)([^*_]+)\1/)
    if (italicMatch) {
      parts.push(
        <em key={key++} className="italic text-slate-200">
          {italicMatch[2]}
        </em>
      )
      remaining = remaining.slice(italicMatch[0].length)
      continue
    }

    // Link: [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/)
    if (linkMatch) {
      parts.push(
        <a
          key={key++}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
        >
          {linkMatch[1]}
        </a>
      )
      remaining = remaining.slice(linkMatch[0].length)
      continue
    }

    // Plain text up to next special character
    const nextSpecial = remaining.search(/[`*~_\[]/)
    if (nextSpecial === -1) {
      parts.push(remaining)
      break
    } else if (nextSpecial === 0) {
      // Special character didn't match syntax, consume 1 character
      parts.push(remaining[0])
      remaining = remaining.slice(1)
    } else {
      parts.push(remaining.slice(0, nextSpecial))
      remaining = remaining.slice(nextSpecial)
    }
  }

  return <>{parts}</>
}

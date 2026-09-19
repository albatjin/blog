'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeftIcon,
  SaveIcon,
  SendIcon,
  EyeIcon,
  ImageIcon,
  XIcon,
  CheckIcon,
} from '@/components/icons'
import { EditorToolbar } from './editor-toolbar'
import { MarkdownEditor, MarkdownEditorRef } from './markdown-editor'
import { MarkdownPreview } from './markdown-preview'
import { CoverImageModal } from './cover-image-modal'
import { PublishModal } from './publish-modal'

const DRAFT_STORAGE_KEY = 'devlog_write_draft_v2'

const SAMPLE_TEMPLATE = {
  title: 'Rust 기반 분산 이벤트 브로커 아키텍처 구축기',
  tags: ['Rust', 'DistributedSystems', 'Concurrency', 'ZeroCopy'],
  content: `# 서론: 고성능 브로커의 요구 조건

대규모 분산 환경에서 초당 수백만 건의 트랜잭션을 지연(Latency) 없이 수렴하기 위해서는 런타임 가비지 컬렉션(GC)의 한계를 극복해야 합니다. 본 아키텍처 설계는 메모리 안전성과 스레드 간 안전한 제로 카피 데이터 전송을 구현한 Rust의 독보적인 성능 특성을 적극 활용합니다.

## Tokio 런타임 비동기 I/O 파이프라인

핵심 메시지 라우터는 비동기 액터 패턴(\`Actor Pattern\`)으로 구성되며, 각 워커 노드는 물리 CPU 코어에 직접 바인딩됩니다.

\`\`\`rust
use tokio::net::TcpListener;
use tokio::sync::mpsc;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std.error.Error>> {
    let listener = TcpListener::bind("0.0.0.0:8080").await?;
    let (tx, mut rx) = mpsc::channel(1024);
    
    // 무중단 제로카피 버퍼 링 생성
    tokio::spawn(async move {
        while let Some(msg) = rx.recv().await {
            println!("Ingesting packet: {:?}", msg);
        }
    });

    Ok(())
}
\`\`\`

## 벤치마크 요약 지표

| 측정 항목 | 기존 파이프라인 | Rust 분산 브로커 | 개선율 |
|---|---|---|---|
| P99 레이턴시 | 42.8ms | 1.8ms | ▼ 95.8% 단축 |
| 메모리 점유율 | 1.4GB | 84MB | ▼ 94.0% 절감 |
| 초당 인입 TPS | 65,000 | 480,000 | ▲ 738% 향상 |
`,
}

type ViewMode = 'editor' | 'preview' | 'split'

export function WriteEditor() {
  const router = useRouter()
  const editorRef = useRef<MarkdownEditorRef>(null)

  // 포스트 작성 상태 (새 글 작성은 기본 빈 폼으로 시작)
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [content, setContent] = useState('')
  const [coverImage, setCoverImage] = useState('')

  // 뷰 모드 및 모달 상태
  const [viewMode, setViewMode] = useState<ViewMode>('editor')
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)

  // 자동저장 상태
  const [autoSaveTime, setAutoSaveTime] = useState<string>('대기 중')
  const [saveToast, setSaveToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const showNotification = (msg: string) => {
    setToastMessage(msg)
    setSaveToast(true)
    setTimeout(() => setSaveToast(false), 2500)
  }

  // 마운트 후 로컬스토리지 임시저장 내용 복원
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.removeItem('devlog_write_draft_v1') // 구버전 샘플 캐시 정리
        const saved = localStorage.getItem(DRAFT_STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed.title) setTitle(parsed.title)
          if (parsed.tags && Array.isArray(parsed.tags)) setTags(parsed.tags)
          if (parsed.content) setContent(parsed.content)
          if (parsed.coverImage) setCoverImage(parsed.coverImage)
          if (parsed.savedAt) setAutoSaveTime(parsed.savedAt)
        }
      } catch {
        // ignore
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // 샘플 템플릿(write.png 예시) 불러오기
  const handleLoadSample = () => {
    setTitle(SAMPLE_TEMPLATE.title)
    setTags(SAMPLE_TEMPLATE.tags)
    setContent(SAMPLE_TEMPLATE.content)
    showNotification('write.png 샘플 템플릿을 불러왔습니다.')
  }

  // 내용 전체 비우기 (새로 작성하기)
  const handleReset = () => {
    setTitle('')
    setTags([])
    setContent('')
    setCoverImage('')
    setAutoSaveTime('대기 중')
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY)
    } catch {
      // ignore
    }
    showNotification('작성 내용이 초기화되었습니다.')
  }

  // 2. 수동 및 주기적 자동저장 함수
  const saveDraft = useCallback(
    (showNotice = false) => {
      try {
        const now = new Date()
        const timeStr = now.toTimeString().split(' ')[0]
        const draftData = {
          title,
          tags,
          content,
          coverImage,
          savedAt: timeStr,
        }
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData))
        setAutoSaveTime(timeStr)

        if (showNotice) {
          showNotification(`임시저장되었습니다 (${timeStr})`)
        }
      } catch {
        // storage quota exceeded 등
      }
    },
    [title, tags, content, coverImage]
  )

  // 3. 내용 변경 시 8초 디바운스 자동저장 (내용이 있을 때만)
  useEffect(() => {
    if (!title.trim() && !content.trim()) return
    const timer = setTimeout(() => {
      saveDraft(false)
    }, 8000)
    return () => clearTimeout(timer)
  }, [title, tags, content, coverImage, saveDraft])

  // 태그 추가 핸들러
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const trimmed = tagInput.trim().replace(/^#/, '')
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed])
        setTagInput('')
      }
    }
  }

  // 태그 삭제 핸들러
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  // 툴바 문법 삽입 핸들러
  const handleInsertSyntax = (prefix: string, suffix = '', defaultText = '') => {
    if (viewMode === 'preview') {
      setViewMode('editor')
    }
    editorRef.current?.insertSyntax(prefix, suffix, defaultText)
  }

  // 발행 완료 시 콜백
  const handlePublishSuccess = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 space-y-4">
      {/* 임시저장 완료 토스트 알림 */}
      {saveToast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-xs shadow-2xl shadow-emerald-500/30 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckIcon className="w-4 h-4" />
          <span>{toastMessage || `브라우저에 임시저장되었습니다 (${autoSaveTime})`}</span>
        </div>
      )}

      {/* 1. 상단 서브 액션 바 (write.png 기준 뒤로가기 / 자동저장 / 미리보기 / 임시저장 / 발행하기) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        {/* 좌측: 뒤로가기 & 자동저장 상태 배지 */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121722] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors text-xs font-medium cursor-pointer"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            <span>뒤로가기</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101520] border border-slate-800/80 text-[11px] font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">자동저장</span>
            <span className="text-emerald-400 font-medium">{autoSaveTime}</span>
          </div>
        </div>

        {/* 우측: 샘플 불러오기 / 새로 쓰기 / 미리보기 토글 / 임시저장 / 발행하기 */}
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          {/* 템플릿 샘플 불러오기 & 새로 쓰기 버튼 */}
          <button
            type="button"
            onClick={handleLoadSample}
            title="write.png 예시 템플릿 불러오기"
            className="px-2.5 py-1.5 rounded-xl bg-[#121722] hover:bg-slate-800 text-slate-400 hover:text-emerald-400 border border-slate-800 text-xs font-mono transition-colors cursor-pointer"
          >
            예시 불러오기
          </button>
          <button
            type="button"
            onClick={handleReset}
            title="작성 내용 초기화"
            className="px-2.5 py-1.5 rounded-xl bg-[#121722] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 text-xs font-mono transition-colors cursor-pointer"
          >
            새로 쓰기
          </button>

          {/* 미리보기 전환 토글 버튼 */}
          <div className="flex items-center p-0.5 rounded-xl bg-[#121722] border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'preview' ? 'editor' : 'preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <EyeIcon className="w-3.5 h-3.5" />
              <span>{viewMode === 'preview' ? '에디터 보기' : '미리보기만 보기'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'split' ? 'editor' : 'split')}
              title="에디터와 미리보기 나란히 분할 보기"
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer hidden md:block ${
                viewMode === 'split'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              나란히 보기
            </button>
          </div>

          {/* 임시저장 버튼 */}
          <button
            type="button"
            onClick={() => saveDraft(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#121722] hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 text-xs font-medium transition-all cursor-pointer active:scale-98"
          >
            <SaveIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>임시저장</span>
          </button>

          {/* 발행하기 버튼 (녹색 강조) */}
          <button
            type="button"
            onClick={() => setIsPublishModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#00dc82] hover:bg-[#00c976] text-[#0B0F17] font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-98"
          >
            <SendIcon className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>발행하기</span>
          </button>
        </div>
      </div>

      {/* 2. 상단 포스트 제목, 태그, 커버 이미지 설정 카드 (write.png 디자인) */}
      <div className="bg-[#121722]/80 border border-slate-800/90 rounded-2xl p-5 sm:p-7 shadow-xl space-y-4">
        {/* 커버 이미지 미리보기 (설정된 경우) */}
        {coverImage && (
          <div className="relative aspect-[21/7] rounded-xl overflow-hidden border border-slate-700/80 mb-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverImage} alt="포스트 커버" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setCoverImage('')}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-rose-600 text-white transition-colors cursor-pointer"
              title="커버 이미지 삭제"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 대형 제목 입력창 */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full bg-transparent text-2xl sm:text-3xl md:text-4xl font-extrabold text-white placeholder-slate-500 border-b border-transparent focus:border-emerald-500/40 pb-2 outline-none leading-tight tracking-tight focus:ring-0 transition-colors"
        />

        {/* 태그 목록 & 커버 이미지 설정 버튼 */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* 태그 칩 리스트 */}
          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#161f2e] text-emerald-400 border border-slate-700/60 font-mono text-xs transition-colors"
              >
                <span># {tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  title="태그 삭제"
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* 태그 입력 인풋 */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="+ 태그 추가 (Enter)"
                className="bg-[#101520] text-xs text-slate-300 placeholder-slate-500 rounded-lg px-3 py-1.5 border border-slate-800 focus:outline-none focus:border-emerald-500/50 font-mono transition-colors min-w-[140px]"
              />
            </div>
          </div>

          {/* 커버 이미지 설정 버튼 */}
          <button
            type="button"
            onClick={() => setIsCoverModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101520] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>{coverImage ? '커버 이미지 변경' : '커버 이미지 설정'}</span>
          </button>
        </div>
      </div>

      {/* 3. 마크다운 에디터 & 툴바 영역 */}
      <div className="flex-1 flex flex-col min-h-[580px] h-[calc(100vh-280px)]">
        {/* 상단 서식 툴바 */}
        <div className="rounded-t-2xl overflow-hidden border-t border-x border-slate-800/90 shrink-0">
          <EditorToolbar onInsertSyntax={handleInsertSyntax} />
        </div>

        {/* 에디터 뷰 분기 */}
        {viewMode === 'editor' && (
          <div className="flex-1 min-h-0 h-full">
            <MarkdownEditor
              ref={editorRef}
              content={content}
              onChange={setContent}
              onSave={() => saveDraft(true)}
            />
          </div>
        )}

        {viewMode === 'preview' && (
          <div className="flex-1 min-h-0 h-full bg-[#0e131c] border border-slate-800/90 rounded-b-2xl p-6 sm:p-8 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 text-xs font-mono text-slate-400">
              <span className="text-emerald-400 font-semibold">PREVIEW MODE</span>
              <span>실제 게시글에 표시되는 모습입니다</span>
            </div>
            <MarkdownPreview content={content} />
          </div>
        )}

        {viewMode === 'split' && (
          <div className="flex-1 min-h-0 h-full grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
            <div className="h-full min-h-0">
              <MarkdownEditor
                ref={editorRef}
                content={content}
                onChange={setContent}
                onSave={() => saveDraft(true)}
              />
            </div>
            <div className="h-full min-h-0 bg-[#0e131c] border border-slate-800/90 rounded-2xl p-6 overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span className="text-emerald-400 font-semibold">LIVE PREVIEW</span>
              </div>
              <MarkdownPreview content={content} />
            </div>
          </div>
        )}
      </div>

      {/* 커버 이미지 모달 */}
      <CoverImageModal
        isOpen={isCoverModalOpen}
        currentImage={coverImage}
        onClose={() => setIsCoverModalOpen(false)}
        onSave={(img) => setCoverImage(img)}
      />

      {/* 발행 확인 모달 */}
      <PublishModal
        isOpen={isPublishModalOpen}
        title={title}
        tags={tags}
        content={content}
        coverImage={coverImage}
        onClose={() => setIsPublishModalOpen(false)}
        onSuccess={handlePublishSuccess}
      />
    </div>
  )
}

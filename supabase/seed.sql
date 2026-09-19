-- ==============================================================================
-- DevLog Seed Data
-- File: supabase/seed.sql
-- ==============================================================================

-- 1. 카테고리 시드 데이터
INSERT INTO public.categories (name, slug, display_order) VALUES
('전체', 'all', 1),
('프론트엔드', 'frontend', 2),
('백엔드', 'backend', 3),
('DevOps & 인프라', 'devops', 4),
('AI/ML', 'ai-ml', 5),
('커리어', 'career', 6)
ON CONFLICT (slug) DO NOTHING;

-- 2. 블로그 포스트 시드 데이터 (home.png 디자인 기준)
INSERT INTO public.posts (
    title, slug, excerpt, content, tag, sub_tag, category,
    author_name, author_avatar, read_time, published_date, likes_count, comments_count, is_featured
) VALUES
(
    'React 19 Server Actions 완벽 실전 가이드',
    'react-19-server-actions-guide',
    '서버 액션과 낙관적 UI 업데이트(useOptimistic), 새로운 useActionState 훅을 결합해 복잡한 비동기 양식 제출 상태를 보일러플레이트 없이 안전하게 다루는 실...',
    'React 19에서 정식 도입된 Server Actions의 실무 활용 패턴과 상태 관리 기법을 상세히 살펴봅니다.',
    'React 19',
    'Featured Log',
    '프론트엔드',
    '정하은',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    '5분 분량',
    '2025.02.24',
    142,
    28,
    true
),
(
    '대규모 트래픽 처리를 위한 Kafka & Redis 아키텍처 개선기',
    'scalable-kafka-redis-architecture',
    '초당 12만 TPS 급증 상황에서 데이터베이스 커넥션 고갈을 극복하기 위해 분산 락, Write-Behind 캐시 전략, 파티션 리밸런싱을 최적화한 실전 장애 회고록입니다.',
    '급격한 트래픽 유입에 대응하여 Kafka와 Redis를 활용한 분산 아키텍처 개선 및 장애 극복 과정을 다룹니다.',
    'Kafka & Redis',
    'Hot System',
    '백엔드',
    '강민석',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    '9분 분량',
    '2025.02.23',
    319,
    45,
    true
),
(
    'Rust로 직접 구현해보는 가벼운 로컬 캐시 엔진',
    'building-local-cache-engine-in-rust',
    'Lock-Free 알고리즘과 ARC, Crossbeam을 활용한 세밀한 멀티스레드 동시성 제어부터 TinyLFU 기반의 캐시 퇴출 정책을 Rust 메모리 안전성 원칙 아래 빌드합...',
    'Rust의 강력한 소유권 시스템과 동시성 모델을 바탕으로 한 인메모리 캐시 엔진 개발기입니다.',
    'Rust',
    'Deep Dive',
    '백엔드',
    '오준혁',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    '12분 분량',
    '2025.02.21',
    288,
    19,
    false
),
(
    'Kubernetes 무중단 배포 전략과 ArgoCD 실무 패턴',
    'kubernetes-zero-downtime-argocd-patterns',
    'Argo Rollouts를 통한 Progressive Delivery 및 블루/그린 배포 검증, 실시간 프로메테우스 메트릭 자동 롤백 파이프라인을 프로덕션 클러스터에 배포한 사례...',
    'Kubernetes 환경에서 무중단 롤아웃과 카나리 배포를 ArgoCD와 연계해 안전하게 구축하는 실무 지침입니다.',
    'Kubernetes',
    'Infra Ops',
    'DevOps & 인프라',
    '서지우',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    '8분 분량',
    '2025.02.20',
    174,
    14,
    false
),
(
    'LLM 기반 실시간 검색 에이전트 설계 및 RAG 최적화',
    'llm-realtime-search-agent-rag-optimization',
    '하이브리드 서치(BM25 + Dense Vector), 리랭커(Cross-Encoder) 도입, 그리고 지연시간 단축을 위한 스트리밍 청크 디코딩 처리 기법을 소개합니다.',
    '생성형 AI와 고성능 검색 파이프라인 결합을 통한 실시간 지식 검색 에이전트 아키텍처 가이드입니다.',
    'AI / RAG',
    'AI Research',
    'AI/ML',
    '임도현',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    '11분 분량',
    '2025.02.19',
    492,
    61,
    true
),
(
    '타입스크립트 고급 타입 테크닉: Conditional Types와 Template...',
    'typescript-advanced-types-conditional-template',
    '타입 수준 연산(Type-Level Computation)으로 엄격한 라우트 정의, 유효성 스키마 타입 추론, 그리고 제네릭 제약 조건을 통한 런타임 오류 방지 노하우를 정리합...',
    '타입스크립트 5.5의 강력한 타입 체커를 극한으로 활용하는 실무 고급 기법 모음입니다.',
    'TypeScript 5.5',
    'Type Safety',
    '프론트엔드',
    '윤서연',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    '6분 분량',
    '2025.02.18',
    185,
    22,
    false
)
ON CONFLICT (slug) DO NOTHING;

-- 3. 실시간 트렌딩 태그 시드 데이터
INSERT INTO public.trending_tags (name, count) VALUES
('Architecture', 428),
('Performance', 315),
('Docker', 290),
('CleanCode', 214),
('PostgreSQL', 198),
('LLM', 182),
('WebAssembly', 104),
('ZeroTrust', 87)
ON CONFLICT (name) DO UPDATE SET count = EXCLUDED.count;

-- 4. 큐레이터 초이스 시드 데이터
INSERT INTO public.curator_picks (curator_name, curator_role, curator_avatar, quote, series_link) VALUES
(
    '최성우 아키텍트',
    'Fintech Platform Principal',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    '마이크로서비스 분할보다 중요한 것은 이벤트 드리븐 경계의 일관성 보장입니다.',
    '#'
);


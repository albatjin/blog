-- ==============================================================================
-- DevLog Database Schema & RLS Policies
-- Migration: 20250224000000_create_blog_schema.sql
-- ==============================================================================

-- 1. 카테고리 테이블 (Categories)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. 블로그 포스트 테이블 (Posts)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT,
    tag VARCHAR(50) NOT NULL,            -- e.g. 'React 19', 'Kafka & Redis', 'Rust'
    sub_tag VARCHAR(50),                 -- e.g. 'Featured Log', 'Hot System', 'Deep Dive'
    category VARCHAR(50) NOT NULL,       -- e.g. '프론트엔드', '백엔드', 'DevOps & 인프라', 'AI/ML'
    author_name VARCHAR(100) NOT NULL,
    author_avatar VARCHAR(255),
    read_time VARCHAR(50) DEFAULT '5분 분량',
    published_date VARCHAR(20) DEFAULT to_char(now(), 'YYYY.MM.DD'),
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. 실시간 트렌딩 태그 테이블 (Trending Tags)
CREATE TABLE IF NOT EXISTS public.trending_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. 큐레이터 초이스 테이블 (Curator Picks)
CREATE TABLE IF NOT EXISTS public.curator_picks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curator_name VARCHAR(100) NOT NULL,
    curator_role VARCHAR(150) NOT NULL,
    curator_avatar VARCHAR(255),
    quote TEXT NOT NULL,
    series_link VARCHAR(255) DEFAULT '#',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==============================================================================
-- Row Level Security (RLS) 활성화
-- ==============================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trending_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.curator_picks ENABLE ROW LEVEL SECURITY;

-- 1) Categories RLS 정책: 누구나(비로그인/로그인) 조회 가능
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT 
USING (true);

-- 2) Posts RLS 정책: 누구나 포스트 조회 가능
CREATE POLICY "Posts are viewable by everyone" 
ON public.posts FOR SELECT 
USING (true);

-- 3) Posts RLS 정책: 인증된 사용자만 포스트 작성 가능
CREATE POLICY "Authenticated users can insert posts" 
ON public.posts FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 4) Posts RLS 정책: 본인이 작성한 포스트만 수정 가능
CREATE POLICY "Users can update their own posts" 
ON public.posts FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5) Posts RLS 정책: 본인이 작성한 포스트만 삭제 가능
CREATE POLICY "Users can delete their own posts" 
ON public.posts FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- 6) Trending Tags RLS 정책: 누구나 조회 가능
CREATE POLICY "Trending tags are viewable by everyone" 
ON public.trending_tags FOR SELECT 
USING (true);

-- 7) Curator Picks RLS 정책: 누구나 조회 가능
CREATE POLICY "Curator picks are viewable by everyone" 
ON public.curator_picks FOR SELECT 
USING (true);

-- ==============================================================================
-- 인덱스 생성 (성능 최적화)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trending_tags_count ON public.trending_tags(count DESC);


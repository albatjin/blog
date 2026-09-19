export interface Post {
  id: string
  title: string
  slug?: string
  excerpt: string
  content?: string
  tag: string
  sub_tag?: string
  category: string
  author_name: string
  author_avatar?: string
  read_time: string
  published_date: string
  likes_count: number
  comments_count: number
  is_featured?: boolean
  created_at?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  display_order: number
}

export interface TrendingTag {
  id?: string
  name: string
  count: number
}

export interface CuratorPick {
  id?: string
  curator_name: string
  curator_role: string
  curator_avatar?: string
  quote: string
  series_link?: string
}


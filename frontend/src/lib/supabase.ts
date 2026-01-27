import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Article {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  category: string
  positivity_score: number
  image_url: string | null
  original_links: string[]
  reflection: string | null
  at_a_glance: string[] | null
  published_at: string
  created_at: string
}

export type FilterMode = 'uplifting' | 'balanced' | 'all'

// Filter mapping
export const filterMinScore: Record<FilterMode, number> = {
  uplifting: 4,
  balanced: 3,
  all: 1,
}

// Fetch articles
export async function getArticles(
  filter: FilterMode = 'balanced',
  limit: number = 20,
  offset: number = 0,
  category?: string
): Promise<Article[]> {
  let query = supabase
    .from('articles')
    .select('*')
    .gte('positivity_score', filterMinScore[filter])
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  return data || []
}

// Fetch single article by slug
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching article:', error)
    return null
  }

  return data
}

// Get categories
export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('category')
    .order('category')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  // Get unique categories
  const categories = Array.from(new Set(data?.map((d) => d.category) || []))
  return categories
}

// Get the most inspiring recent article (highest positivity, most recent)
export async function getMostInspiringArticle(): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .gte('positivity_score', 4)
    .order('positivity_score', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching inspiring article:', error)
    return null
  }

  return data
}

// Get article count by filter
export async function getArticleCount(filter: FilterMode = 'balanced'): Promise<number> {
  const { count, error } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .gte('positivity_score', filterMinScore[filter])

  if (error) {
    console.error('Error counting articles:', error)
    return 0
  }

  return count || 0
}

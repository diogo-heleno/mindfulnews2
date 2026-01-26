import { format, formatDistanceToNow, parseISO } from 'date-fns'

// Format date for display
export function formatDate(dateString: string): string {
  const date = parseISO(dateString)
  return format(date, 'MMMM d, yyyy')
}

// Format relative time
export function formatRelativeTime(dateString: string): string {
  const date = parseISO(dateString)
  return formatDistanceToNow(date, { addSuffix: true })
}

// Format date for RSS
export function formatRSSDate(dateString: string): string {
  const date = parseISO(dateString)
  return date.toUTCString()
}

// Get positivity label
export function getPositivityLabel(score: number): string {
  if (score >= 5) return 'Very Positive'
  if (score >= 4) return 'Positive'
  if (score >= 3) return 'Neutral'
  if (score >= 2) return 'Concerning'
  return 'Negative'
}

// Get positivity color class
export function getPositivityColor(score: number): string {
  if (score >= 4) return 'text-sage-600 bg-sage-100'
  if (score >= 3) return 'text-ocean-600 bg-ocean-100'
  return 'text-stone-600 bg-stone-200'
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

// Generate excerpt from content
export function generateExcerpt(content: string, maxLength: number = 200): string {
  // Remove any HTML if present
  const text = content.replace(/<[^>]+>/g, '')
  return truncate(text, maxLength)
}

// Site metadata
export const siteConfig = {
  name: 'Mindful News',
  description: 'A calm, constructive news digest — non-sensational, international, mindful.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://mindfulnews.media',
  author: 'Diogo Heleno',
}

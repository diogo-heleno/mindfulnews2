import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { pt } from 'date-fns/locale'

// Format date for display
export function formatDate(dateString: string): string {
  const date = parseISO(dateString)
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: pt })
}

// Format relative time
export function formatRelativeTime(dateString: string): string {
  const date = parseISO(dateString)
  return formatDistanceToNow(date, { addSuffix: true, locale: pt })
}

// Format date for RSS
export function formatRSSDate(dateString: string): string {
  const date = parseISO(dateString)
  return date.toUTCString()
}

// Get positivity label
export function getPositivityLabel(score: number): string {
  if (score >= 5) return 'Inspiradora'
  if (score >= 4) return 'Positiva'
  if (score >= 3) return 'Equilibrada'
  if (score >= 2) return 'Desafiante'
  return 'Urgente'
}

// Get positivity color class
export function getPositivityColor(score: number): string {
  if (score >= 5) return 'text-sage-700 bg-sage-100 border border-sage-200'
  if (score >= 4) return 'text-sage-600 bg-sage-50'
  if (score >= 3) return 'text-ocean-600 bg-ocean-50'
  return 'text-stone-600 bg-stone-100'
}

// Get positivity icon indicator (small visual cue)
export function getPositivityIndicator(score: number): string {
  if (score >= 5) return 'sun'     // inspiradora
  if (score >= 4) return 'leaf'    // positiva
  if (score >= 3) return 'scale'   // equilibrada
  return 'compass'                  // desafiante/urgente
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
  description: 'O melhor da humanidade, todos os dias. Noticias internacionais com clareza, esperanca e perspectiva construtiva.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://mindfulnews.media',
  author: 'Diogo Heleno',
}

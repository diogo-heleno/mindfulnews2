'use client'

import { FilterMode } from '@/lib/supabase'

interface FilterBarProps {
  currentFilter: FilterMode
  onFilterChange: (filter: FilterMode) => void
  counts?: {
    uplifting: number
    balanced: number
    all: number
  }
}

const filters: { id: FilterMode; label: string; description: string }[] = [
  {
    id: 'uplifting',
    label: 'Inspiradoras',
    description: 'O melhor da humanidade: soluções, progresso e solidariedade',
  },
  {
    id: 'balanced',
    label: 'Equilibradas',
    description: 'Panorama construtivo do que se passa no mundo',
  },
  {
    id: 'all',
    label: 'Todas',
    description: 'Cobertura completa, com factos, contexto e perspectiva',
  },
]

export default function FilterBar({ currentFilter, onFilterChange, counts }: FilterBarProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-4 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium text-stone-800">A sua leitura</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Escolha como quer ver o mundo hoje
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`
                filter-button flex items-center space-x-2
                ${currentFilter === filter.id ? 'active' : ''}
              `}
              title={filter.description}
            >
              {/* Icon based on filter type */}
              {filter.id === 'uplifting' && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
              {filter.id === 'balanced' && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              )}
              {filter.id === 'all' && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              )}
              <span>{filter.label}</span>
              {counts && (
                <span className={`
                  text-xs px-1.5 py-0.5 rounded-full
                  ${currentFilter === filter.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-stone-100 text-stone-500'}
                `}>
                  {counts[filter.id]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

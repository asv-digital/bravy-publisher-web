'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { STATUS_OPTIONS, CONTENT_TYPES, PERSONAS, PLATFORMS } from '@/lib/constants'
import { Search, X } from 'lucide-react'
import type { ContentFilterParams } from '../types/content-filters'
import type { ContentStatus, ContentType, Persona } from '@/types/content'
import type { Platform } from '@/types/social-account'

interface ContentFiltersProps {
  filters: ContentFilterParams
  onFiltersChange: (filters: ContentFilterParams) => void
}

export function ContentFilters({ filters, onFiltersChange }: ContentFiltersProps) {
  const hasActiveFilters =
    filters.status || filters.contentType || filters.persona || filters.platform || filters.search

  function updateFilter(key: keyof ContentFilterParams, value: string | undefined) {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1,
    })
  }

  function clearFilters() {
    onFiltersChange({
      page: 1,
      pageSize: filters.pageSize,
    })
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Buscar conteudo..."
          className="h-8 w-[220px] rounded-lg border-gray-200 bg-white pl-9 text-sm placeholder:text-gray-400 focus-visible:border-gray-300 focus-visible:ring-gray-200/60 dark:border-gray-700 dark:bg-gray-900"
          value={filters.search ?? ''}
          onChange={(e) => updateFilter('search', e.target.value || undefined)}
        />
      </div>

      <Select
        value={filters.status ?? null}
        onValueChange={(value) => updateFilter('status', (value as ContentStatus) || undefined)}
      >
        <SelectTrigger className="w-[140px] rounded-lg border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-900">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.contentType ?? null}
        onValueChange={(value) => updateFilter('contentType', (value as ContentType) || undefined)}
      >
        <SelectTrigger className="w-[130px] rounded-lg border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-900">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          {CONTENT_TYPES.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.persona ?? null}
        onValueChange={(value) => updateFilter('persona', (value as Persona) || undefined)}
      >
        <SelectTrigger className="w-[140px] rounded-lg border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-900">
          <SelectValue placeholder="Persona" />
        </SelectTrigger>
        <SelectContent>
          {PERSONAS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.platform ?? null}
        onValueChange={(value) => updateFilter('platform', (value as Platform) || undefined)}
      >
        <SelectTrigger className="w-[140px] rounded-lg border-gray-200 bg-white text-sm dark:border-gray-700 dark:bg-gray-900">
          <SelectValue placeholder="Plataforma" />
        </SelectTrigger>
        <SelectContent>
          {PLATFORMS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="h-3.5 w-3.5" />
          Limpar
        </button>
      )}
    </div>
  )
}

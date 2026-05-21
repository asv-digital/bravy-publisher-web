'use client'

import type { ContentStatus } from '@/types/content'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<ContentStatus, { label: string; dot: string; bg: string; text: string }> = {
  DRAFT: {
    label: 'Rascunho',
    dot: 'bg-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-800/60',
    text: 'text-gray-600 dark:text-gray-300',
  },
  GENERATING: {
    label: 'Gerando',
    dot: 'bg-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/40',
    text: 'text-amber-600 dark:text-amber-300',
  },
  READY: {
    label: 'Pronto',
    dot: 'bg-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/40',
    text: 'text-blue-600 dark:text-blue-300',
  },
  SCHEDULED: {
    label: 'Agendado',
    dot: 'bg-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/40',
    text: 'text-purple-600 dark:text-purple-300',
  },
  PUBLISHING: {
    label: 'Publicando',
    dot: 'bg-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-900/40',
    text: 'text-yellow-600 dark:text-yellow-300',
  },
  PUBLISHED: {
    label: 'Publicado',
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/40',
    text: 'text-emerald-600 dark:text-emerald-300',
  },
  FAILED: {
    label: 'Falhou',
    dot: 'bg-red-500',
    bg: 'bg-red-50 dark:bg-red-900/40',
    text: 'text-red-600 dark:text-red-300',
  },
}

interface ContentStatusBadgeProps {
  status: ContentStatus
}

export function ContentStatusBadge({ status }: ContentStatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  if (!config) return null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.bg,
        config.text,
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          config.dot,
          status === 'GENERATING' && 'animate-pulse',
        )}
      />
      {config.label}
    </span>
  )
}

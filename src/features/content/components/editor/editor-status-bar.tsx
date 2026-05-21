'use client'

import { Badge } from '@/components/ui/badge'
import { STATUS_OPTIONS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Clock, Loader2 } from 'lucide-react'
import type { ContentStatus } from '@/types/content'

interface EditorStatusBarProps {
  status: ContentStatus
  lastSavedAt: string | null
  isSaving: boolean
}

export function EditorStatusBar({ status, lastSavedAt, isSaving }: EditorStatusBarProps) {
  const statusOption = STATUS_OPTIONS.find((s) => s.value === status)

  return (
    <div className="flex items-center gap-3">
      {statusOption && (
        <Badge variant="secondary" className={cn(statusOption.color)}>
          {statusOption.label}
        </Badge>
      )}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {isSaving ? (
          <>
            <Loader2 className="size-3 animate-spin" />
            <span>Salvando...</span>
          </>
        ) : lastSavedAt ? (
          <>
            <Clock className="size-3" />
            <span>Salvo as {lastSavedAt}</span>
          </>
        ) : null}
      </div>
    </div>
  )
}

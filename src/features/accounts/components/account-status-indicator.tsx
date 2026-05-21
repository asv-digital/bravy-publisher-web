'use client'

import { differenceInDays } from 'date-fns'
import { cn } from '@/lib/utils'

interface AccountStatusIndicatorProps {
  tokenExpiresAt: string
  connected: boolean
}

export function AccountStatusIndicator({
  tokenExpiresAt,
  connected,
}: AccountStatusIndicatorProps) {
  const now = new Date()
  const expiresAt = new Date(tokenExpiresAt)
  const daysUntilExpiry = differenceInDays(expiresAt, now)

  let color: string
  let label: string

  if (!connected || daysUntilExpiry < 0) {
    color = 'bg-red-500'
    label = 'Expirado'
  } else if (daysUntilExpiry < 7) {
    color = 'bg-yellow-500'
    label = 'Expira em breve'
  } else {
    color = 'bg-emerald-500'
    label = 'Ativo'
  }

  return (
    <div className="flex items-center gap-2">
      <span className={cn('h-2 w-2 rounded-full', color)} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

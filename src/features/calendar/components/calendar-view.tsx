'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { STATUS_OPTIONS, PERSONA_COLORS } from '@/lib/constants'
import { useCalendarContents } from '../hooks/use-calendar'
import type { Content, Persona } from '@/types/content'

function getStatusDot(status: string) {
  const opt = STATUS_OPTIONS.find((s) => s.value === status)
  if (!opt) return 'bg-zinc-400'
  if (status === 'PUBLISHED') return 'bg-emerald-500'
  if (status === 'SCHEDULED') return 'bg-purple-500'
  if (status === 'READY') return 'bg-blue-500'
  if (status === 'FAILED') return 'bg-red-500'
  if (status === 'GENERATING' || status === 'PUBLISHING') return 'bg-amber-500'
  return 'bg-zinc-400'
}

function getContentDate(content: Content): Date | null {
  if (content.publishedAt) return new Date(content.publishedAt)
  if (content.scheduledAt) return new Date(content.scheduledAt)
  return null
}

function formatSlug(slug: string): string {
  const parts = slug.split('-')
  return parts.slice(1).join(' ').replace(/\b\w/g, (c) => c.toUpperCase()) || slug
}

export function CalendarView() {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { data: contents, isLoading } = useCalendarContents()

  const contentsByDate = useMemo(() => {
    if (!contents) return new Map<string, Content[]>()
    const map = new Map<string, Content[]>()
    for (const content of contents) {
      const date = getContentDate(content)
      if (!date) continue
      const key = format(date, 'yyyy-MM-dd')
      const existing = map.get(key) || []
      existing.push(content)
      map.set(key, existing)
    }
    return map
  }, [contents])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart, { locale: ptBR })
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR })

  const weeks: Date[][] = []
  let day = calendarStart
  while (day <= calendarEnd) {
    const week: Date[] = []
    for (let i = 0; i < 7; i++) {
      week.push(day)
      day = addDays(day, 1)
    }
    weeks.push(week)
  }

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <Button variant="outline" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {weekDays.map((d) => (
            <div key={d} className="px-2 py-2 text-center text-xs font-medium text-muted-foreground">
              {d}
            </div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-b last:border-b-0">
            {week.map((dayDate) => {
              const key = format(dayDate, 'yyyy-MM-dd')
              const dayContents = contentsByDate.get(key) || []
              const inMonth = isSameMonth(dayDate, currentMonth)
              const today = isToday(dayDate)

              return (
                <div
                  key={key}
                  className={cn(
                    'min-h-[100px] border-r last:border-r-0 p-1.5 transition-colors',
                    !inMonth && 'bg-muted/30',
                    today && 'bg-blue-50/50 dark:bg-blue-950/20',
                  )}
                >
                  <div className={cn(
                    'text-xs font-medium mb-1',
                    !inMonth && 'text-muted-foreground/40',
                    today && 'text-blue-600 dark:text-blue-400 font-bold',
                  )}>
                    {format(dayDate, 'd')}
                  </div>

                  <div className="space-y-0.5">
                    {dayContents.slice(0, 3).map((content) => (
                      <button
                        key={content.id}
                        onClick={() => router.push(`/content/${content.id}`)}
                        className={cn(
                          'w-full text-left rounded px-1.5 py-0.5 text-[10px] leading-tight truncate',
                          'hover:opacity-80 transition-opacity cursor-pointer',
                          'flex items-center gap-1',
                        )}
                        style={{
                          backgroundColor: PERSONA_COLORS[content.persona as Persona]?.soft || '#F5F2EE',
                          color: PERSONA_COLORS[content.persona as Persona]?.accent || '#141413',
                        }}
                      >
                        <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', getStatusDot(content.status))} />
                        <span className="truncate">{formatSlug(content.slug)}</span>
                      </button>
                    ))}
                    {dayContents.length > 3 && (
                      <div className="text-[10px] text-muted-foreground px-1.5">
                        +{dayContents.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-purple-500" /> Agendado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Publicado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-500" /> Pronto
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500" /> Falhou
        </span>
      </div>
    </div>
  )
}

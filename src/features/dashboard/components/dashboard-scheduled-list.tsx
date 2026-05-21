'use client'

import { Card, CardHeader, CardTitle, CardContent, CardAction } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/layout/empty-state'
import { useDashboard } from '../hooks/use-dashboard'
import { PERSONA_COLORS } from '@/lib/constants'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarClock, Calendar } from 'lucide-react'

export function DashboardScheduledList() {
  const { data, isLoading } = useDashboard()

  if (isLoading || !data) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            Proximos agendados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0 divide-y divide-gray-100">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
          <CalendarClock className="h-4 w-4 text-purple-500" />
          Proximos agendados
        </CardTitle>
        <CardAction>
          <span className="rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-600">
            {data.upcoming.length}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        {data.upcoming.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="Nenhum agendamento"
            description="Nenhum conteudo agendado para os proximos 7 dias."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {data.upcoming.map((item) => {
              const colors = PERSONA_COLORS[item.persona]

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50">
                    <Calendar className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {item.slug}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {format(new Date(item.scheduledAt), "dd/MM 'as' HH:mm", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <span
                    className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      backgroundColor: colors.soft,
                      color: colors.accent,
                    }}
                  >
                    {item.persona}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

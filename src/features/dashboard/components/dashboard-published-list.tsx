'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, CardAction } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/layout/empty-state'
import { useDashboard } from '../hooks/use-dashboard'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CheckCircle2, Newspaper, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DashboardPublishedList() {
  const { data, isLoading } = useDashboard()

  if (isLoading || !data) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            Publicados recentemente
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
                <Skeleton className="h-5 w-14 rounded-full" />
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
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          Publicados recentemente
        </CardTitle>
        <CardAction>
          <Link
            href="/content"
            className="flex items-center gap-1 text-xs font-medium text-gray-400 transition-colors hover:text-gray-600"
          >
            Ver todos
            <ArrowRight className="h-3 w-3" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        {data.recentPublished.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="Nenhum publicado"
            description="Nenhum conteudo publicado recentemente."
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {data.recentPublished.map((item) => {
              const engagementLevel =
                item.engagement >= 8
                  ? 'high'
                  : item.engagement >= 4
                    ? 'medium'
                    : 'low'

              return (
                <Link
                  key={item.id}
                  href={`/content/${item.id}`}
                  className="flex items-center gap-3 py-3 transition-colors hover:bg-gray-50 first:pt-0 last:pb-0 -mx-4 px-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {item.slug}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {format(new Date(item.publishedAt), "dd/MM/yyyy 'as' HH:mm", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <span
                    className={cn(
                      'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums',
                      engagementLevel === 'high' &&
                        'bg-emerald-50 text-emerald-700',
                      engagementLevel === 'medium' &&
                        'bg-blue-50 text-blue-700',
                      engagementLevel === 'low' &&
                        'bg-gray-50 text-gray-500',
                    )}
                  >
                    {item.engagement.toFixed(1)}%
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

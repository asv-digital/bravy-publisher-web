'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboard } from '../hooks/use-dashboard'
import { DonutChart } from '@tremor/react'
import { PieChart } from 'lucide-react'

const TYPE_COLORS: Record<string, string> = {
  Carrossel: 'orange',
  Post: 'blue',
  Reel: 'emerald',
}

const TYPE_DOT_COLORS: Record<string, string> = {
  Carrossel: 'bg-orange-500',
  Post: 'bg-blue-500',
  Reel: 'bg-emerald-500',
}

export function DashboardTypeBreakdown() {
  const { data, isLoading } = useDashboard()

  if (isLoading || !data) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            Resultado por Tipo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="mx-auto h-48 w-48 rounded-full" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.contentTypeBreakdown.map((item) => ({
    name: item.type,
    value: item.count,
  }))

  const colors = data.contentTypeBreakdown.map(
    (item) => TYPE_COLORS[item.type] || 'gray',
  ) as ('orange' | 'blue' | 'emerald' | 'gray')[]

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
          <PieChart className="h-4 w-4 text-orange-500" />
          Resultado por Tipo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DonutChart
          className="h-48"
          data={chartData}
          category="value"
          index="name"
          colors={colors}
          showAnimation
          showTooltip
          valueFormatter={(v: number) => String(v) + ' posts'}
        />
        <div className="mt-4 space-y-3">
          {data.contentTypeBreakdown.map((item) => (
            <div key={item.type} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${TYPE_DOT_COLORS[item.type] || 'bg-gray-500'}`}
                />
                <span className="text-sm font-medium text-gray-700">
                  {item.type}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm tabular-nums text-gray-500">
                  {item.count} posts
                </span>
                <span className="text-sm font-semibold tabular-nums text-gray-900">
                  {item.engagement.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

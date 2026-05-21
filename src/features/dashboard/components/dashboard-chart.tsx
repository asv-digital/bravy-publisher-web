'use client'

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboard } from '../hooks/use-dashboard'
import { BarChart } from '@tremor/react'

export function DashboardChart() {
  const { data, isLoading } = useDashboard()

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">
              Engajamento por dia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-72 w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-900">
              Posts por dia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-72 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const engagementData = data.dailyEngagement.map((d) => ({
    date: new Date(d.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }),
    Engajamento: d.engagement,
  }))

  const postsData = data.postsPerDay.map((d) => ({
    date: new Date(d.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }),
    Posts: d.count,
  }))

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            Engajamento por dia
          </CardTitle>
          <CardDescription>
            Taxa de engajamento diaria dos ultimos 30 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            className="h-72"
            data={engagementData}
            index="date"
            categories={['Engajamento']}
            colors={['orange']}
            valueFormatter={(v: number) => v.toFixed(2) + '%'}
            showAnimation
            showGridLines={false}
            yAxisWidth={48}
          />
        </CardContent>
      </Card>
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            Posts por dia
          </CardTitle>
          <CardDescription>
            Quantidade de publicacoes por dia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            className="h-72"
            data={postsData}
            index="date"
            categories={['Posts']}
            colors={['blue']}
            valueFormatter={(v: number) => String(Math.round(v))}
            showAnimation
            showGridLines={false}
            yAxisWidth={32}
          />
        </CardContent>
      </Card>
    </div>
  )
}

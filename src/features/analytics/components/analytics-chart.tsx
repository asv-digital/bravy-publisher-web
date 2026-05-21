'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardAction } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAnalytics } from '../hooks/use-analytics'
import { AreaChart, BarChart } from '@tremor/react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface AnalyticsChartProps {
  period: '30d' | '60d' | '90d'
}

export function AnalyticsChart({ period }: AnalyticsChartProps) {
  const { data, isLoading } = useAnalytics(period)
  const [metric, setMetric] = useState<string>('engagement')

  if (isLoading || !data) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            Evolucao
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  const chartData = data.dailyData.map((d) => ({
    date: new Date(d.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }),
    Engajamento: d.engagement,
    Seguidores: d.newFollowers - d.unfollowers,
    Curtidas: d.likes,
    Comentarios: d.comments,
  }))

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-900">
          Evolucao
        </CardTitle>
        <CardAction>
          <ToggleGroup
            value={[metric]}
            onValueChange={(values) => {
              const last = values[values.length - 1]
              if (last) setMetric(last)
            }}
            variant="outline"
            size="sm"
            spacing={0}
          >
            <ToggleGroupItem value="engagement">Engajamento</ToggleGroupItem>
            <ToggleGroupItem value="followers">Seguidores</ToggleGroupItem>
            <ToggleGroupItem value="interactions">Curtidas + Comentarios</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent>
        {metric === 'engagement' && (
          <AreaChart
            className="h-80"
            data={chartData}
            index="date"
            categories={['Engajamento']}
            colors={['emerald']}
            valueFormatter={(v: number) => v.toFixed(2) + '%'}
            showAnimation
            curveType="monotone"
            showGradient
            showGridLines={false}
            yAxisWidth={48}
          />
        )}
        {metric === 'followers' && (
          <BarChart
            className="h-80"
            data={chartData}
            index="date"
            categories={['Seguidores']}
            colors={['blue']}
            valueFormatter={(v: number) => (v >= 0 ? '+' : '') + String(v)}
            showAnimation
            showGridLines={false}
            yAxisWidth={48}
          />
        )}
        {metric === 'interactions' && (
          <BarChart
            className="h-80"
            data={chartData}
            index="date"
            categories={['Curtidas', 'Comentarios']}
            colors={['pink', 'blue']}
            valueFormatter={(v: number) => v.toLocaleString('pt-BR')}
            showAnimation
            showGridLines={false}
            yAxisWidth={56}
            stack
          />
        )}
      </CardContent>
    </Card>
  )
}

'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useAnalytics } from '../hooks/use-analytics'
import { BarList } from '@tremor/react'
import { PERSONAS, PATTERNS, PLATFORMS } from '@/lib/constants'

interface AnalyticsBreakdownsProps {
  period: '30d' | '60d' | '90d'
}

export function AnalyticsBreakdowns({ period }: AnalyticsBreakdownsProps) {
  const { data, isLoading } = useAnalytics(period)

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Desempenho por categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  const personaData = PERSONAS.map((p) => ({
    name: p.label,
    value: parseFloat((3 + Math.random() * 7).toFixed(2)),
  })).sort((a, b) => b.value - a.value)

  const patternData = PATTERNS.map((p) => ({
    name: `Padrao ${p.value} - ${p.label}`,
    value: parseFloat((2 + Math.random() * 9).toFixed(2)),
  })).sort((a, b) => b.value - a.value)

  const accountData = PLATFORMS.map((p) => ({
    name: p.label,
    value: parseFloat((1 + Math.random() * 10).toFixed(2)),
  })).sort((a, b) => b.value - a.value)

  const valueFormatter = (v: number) => v.toFixed(2) + '%'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho por categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="persona">
          <TabsList variant="line">
            <TabsTrigger value="persona">Por Persona</TabsTrigger>
            <TabsTrigger value="pattern">Por Padrao</TabsTrigger>
            <TabsTrigger value="account">Por Conta</TabsTrigger>
          </TabsList>

          <TabsContent value="persona" className="mt-4">
            <BarList
              data={personaData}
              valueFormatter={valueFormatter}
              color="emerald"
            />
          </TabsContent>

          <TabsContent value="pattern" className="mt-4">
            <BarList
              data={patternData}
              valueFormatter={valueFormatter}
              color="blue"
            />
          </TabsContent>

          <TabsContent value="account" className="mt-4">
            <BarList
              data={accountData}
              valueFormatter={valueFormatter}
              color="violet"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

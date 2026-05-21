'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { AnalyticsPeriodSelector } from '@/features/analytics/components/analytics-period-selector'
import { AnalyticsSummaryCards } from '@/features/analytics/components/analytics-summary-cards'
import { AnalyticsChart } from '@/features/analytics/components/analytics-chart'
import { AnalyticsBreakdowns } from '@/features/analytics/components/analytics-breakdowns'
import { AnalyticsRankingTable } from '@/features/analytics/components/analytics-ranking-table'

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'30d' | '60d' | '90d'>('30d')

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analiticos"
        description="Metricas detalhadas de desempenho dos conteudos"
        action={<AnalyticsPeriodSelector value={period} onChange={setPeriod} />}
      />
      <AnalyticsSummaryCards period={period} />
      <AnalyticsChart period={period} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AnalyticsBreakdowns period={period} />
        <AnalyticsRankingTable period={period} />
      </div>
    </div>
  )
}

import { PageHeader } from '@/components/layout/page-header'
import { DashboardSummaryCards } from '@/features/dashboard/components/dashboard-summary-cards'
import { DashboardChart } from '@/features/dashboard/components/dashboard-chart'
import { DashboardTypeBreakdown } from '@/features/dashboard/components/dashboard-type-breakdown'
import { DashboardMiniRanking } from '@/features/dashboard/components/dashboard-mini-ranking'
import { DashboardScheduledList } from '@/features/dashboard/components/dashboard-scheduled-list'
import { DashboardPublishedList } from '@/features/dashboard/components/dashboard-published-list'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Visao geral da publicacao" />
      <DashboardSummaryCards />
      <DashboardChart />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <DashboardTypeBreakdown />
        <DashboardMiniRanking />
        <DashboardScheduledList />
      </div>
      <DashboardPublishedList />
    </div>
  )
}

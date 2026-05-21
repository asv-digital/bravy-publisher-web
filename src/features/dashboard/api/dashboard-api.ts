import { api } from '@/lib/api-client'
import type { DashboardSummary } from '@/types/analytics'

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await api.get<DashboardSummary>('/analytics/dashboard')
  return data
}

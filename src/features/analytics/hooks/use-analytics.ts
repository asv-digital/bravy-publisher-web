'use client'

import { useQuery } from '@tanstack/react-query'
import { getAnalyticsSummary } from '../api/analytics-api'

export function useAnalytics(period: '30d' | '60d' | '90d' = '30d') {
  return useQuery({
    queryKey: ['analytics', period],
    queryFn: () => getAnalyticsSummary(period),
  })
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { getDashboardSummary } from '../api/dashboard-api'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardSummary,
  })
}

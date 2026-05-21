'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getRanking } from '../api/analytics-api'

export function useRanking(page: number = 1, period: '30d' | '60d' | '90d' = '30d') {
  return useQuery({
    queryKey: ['ranking', page, period],
    queryFn: () => getRanking(page, period),
    placeholderData: keepPreviousData,
  })
}

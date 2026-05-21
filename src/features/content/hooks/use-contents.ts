'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getContents } from '../api/content-api'
import type { ContentFilterParams } from '../types/content-filters'

export function useContents(filters: ContentFilterParams) {
  return useQuery({
    queryKey: ['contents', filters],
    queryFn: () => getContents(filters),
    placeholderData: keepPreviousData,
  })
}

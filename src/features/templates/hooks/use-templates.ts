'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getTemplates, type TemplateFilters } from '../api/templates-api'

export function useTemplates(filters?: TemplateFilters) {
  return useQuery({
    queryKey: ['templates', filters],
    queryFn: () => getTemplates(filters),
    placeholderData: keepPreviousData,
  })
}

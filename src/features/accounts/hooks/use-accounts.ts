'use client'

import { useQuery } from '@tanstack/react-query'
import { getAccounts } from '../api/accounts-api'

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  })
}

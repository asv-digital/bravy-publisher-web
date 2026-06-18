'use client'

import { useQuery } from '@tanstack/react-query'
import { getAccounts } from '../api/accounts-api'

export function useAccounts() {
  // estúdio-demo/público não tem sessão: evita o request 401 (cai no fallback)
  const hasSession = typeof window !== 'undefined' && !!localStorage.getItem('access_token')
  return useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
    enabled: hasSession,
  })
}

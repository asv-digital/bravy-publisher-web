'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { disconnectAccount } from '../api/accounts-api'

export function useDisconnectAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => disconnectAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

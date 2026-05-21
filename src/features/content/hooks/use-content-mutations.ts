'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteContent, duplicateContent, bulkDeleteContents, bulkUpdateStatus } from '../api/content-api'

export function useDeleteContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] })
    },
  })
}

export function useDuplicateContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => duplicateContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] })
    },
  })
}

export function useBulkDeleteContents() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => bulkDeleteContents(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] })
    },
  })
}

export function useBulkUpdateStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: string }) =>
      bulkUpdateStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] })
    },
  })
}

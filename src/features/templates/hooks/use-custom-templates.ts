'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCustomTemplate,
  deleteCustomTemplate,
  getCustomTemplate,
  listCustomTemplates,
  updateCustomTemplate,
  type SaveTemplateInput,
} from '../api/templates-api'

const KEY = ['custom-templates']

export function useCustomTemplates() {
  return useQuery({ queryKey: KEY, queryFn: listCustomTemplates })
}

export function useCustomTemplate(id: string | undefined) {
  return useQuery({
    queryKey: [...KEY, id],
    queryFn: () => getCustomTemplate(id!),
    enabled: !!id,
  })
}

export function useCreateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: SaveTemplateInput) => createCustomTemplate(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useUpdateTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<SaveTemplateInput> }) =>
      updateCustomTemplate(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDeleteTemplate() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCustomTemplate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

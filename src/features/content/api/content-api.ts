import { api } from '@/lib/api-client'
import type { Content, CreateContentInput } from '@/types/content'
import type { PaginatedResponse } from '@/types/api'
import type { ContentFilterParams } from '../types/content-filters'

export async function getContents(params: ContentFilterParams): Promise<PaginatedResponse<Content>> {
  const { data } = await api.get<PaginatedResponse<Content>>('/contents', { params })
  return data
}

export async function getContent(id: string): Promise<Content> {
  const { data } = await api.get<Content>(`/contents/${id}`)
  return data
}

export async function createContent(input: CreateContentInput): Promise<Content> {
  const { data } = await api.post<Content>('/contents', input)
  return data
}

export async function updateContent(id: string, input: Partial<CreateContentInput>): Promise<Content> {
  const { data } = await api.patch<Content>(`/contents/${id}`, input)
  return data
}

export async function deleteContent(id: string): Promise<void> {
  await api.delete(`/contents/${id}`)
}

export async function duplicateContent(id: string): Promise<Content> {
  const { data } = await api.post<Content>(`/contents/${id}/duplicate`)
  return data
}

export async function bulkDeleteContents(ids: string[]): Promise<void> {
  await api.post('/contents/bulk-delete', { ids })
}

export async function bulkUpdateStatus(ids: string[], status: string): Promise<void> {
  await api.post('/contents/bulk-status', { ids, status })
}

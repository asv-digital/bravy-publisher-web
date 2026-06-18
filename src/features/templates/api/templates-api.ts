import { api } from '@/lib/api-client'
import type { LayoutSpec } from '@publisher/scene-engine'
import type { StyleData } from '@/features/content/studio/lib/style-presets'

/** Template CUSTOM do usuário (designer free-form). */
export interface CustomTemplate {
  id: string
  name: string
  kind: 'post' | 'carousel'
  format: string
  layout: LayoutSpec
  styleData?: StyleData | null
  thumbnailUrl?: string | null
  createdAt: string
  updatedAt: string
}

export interface SaveTemplateInput {
  name: string
  kind: 'post' | 'carousel'
  format?: string
  layout: LayoutSpec
  styleData?: StyleData | null
  thumbnailUrl?: string | null
}

type ListResponse = {
  data: CustomTemplate[]
  meta: { total: number; page: number; limit: number; totalPages: number }
}

export async function listCustomTemplates(): Promise<CustomTemplate[]> {
  const { data } = await api.get<ListResponse>('/templates')
  return data.data
}

export async function getCustomTemplate(id: string): Promise<CustomTemplate> {
  const { data } = await api.get<CustomTemplate>(`/templates/${id}`)
  return data
}

export async function createCustomTemplate(input: SaveTemplateInput): Promise<CustomTemplate> {
  const { data } = await api.post<CustomTemplate>('/templates', input)
  return data
}

export async function updateCustomTemplate(id: string, input: Partial<SaveTemplateInput>): Promise<CustomTemplate> {
  const { data } = await api.patch<CustomTemplate>(`/templates/${id}`, input)
  return data
}

export async function deleteCustomTemplate(id: string): Promise<void> {
  await api.delete(`/templates/${id}`)
}

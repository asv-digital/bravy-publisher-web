import { api } from '@/lib/api-client'
import type { Template } from '@/types/template'
import type { Persona } from '@/types/content'
import type { TemplateFamily } from '@/types/template'

export interface TemplateFilters {
  family?: TemplateFamily
  persona?: Persona
}

export async function getTemplates(filters?: TemplateFilters): Promise<Template[]> {
  const { data } = await api.get<Template[]>('/templates', { params: filters })
  return data
}

export async function getTemplate(id: string): Promise<Template> {
  const { data } = await api.get<Template>(`/templates/${id}`)
  return data
}

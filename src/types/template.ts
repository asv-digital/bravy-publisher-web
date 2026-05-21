import type { Persona } from './content'

export type TemplateFamily = 'STEP' | 'COMPENDIUM' | 'EDITORIAL' | 'TERMINAL' | 'SPLIT' | 'STATIC'

export interface Template {
  id: string
  slug: string
  family: TemplateFamily
  persona?: Persona
  htmlContent: string
  cssVariables: Record<string, string>
  thumbnailUrl?: string
  createdAt: string
  updatedAt: string
}

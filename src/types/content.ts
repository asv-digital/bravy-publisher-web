export type ContentStatus = 'DRAFT' | 'GENERATING' | 'READY' | 'SCHEDULED' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED'
export type ContentType = 'CAROUSEL' | 'POST' | 'REEL'
export type Persona = 'contador' | 'advogado' | 'empresario' | 'arquiteto' | 'engenheiro' | 'agencia'
export type Pattern = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export interface SlideCard {
  label: string
  icon?: string
  title: string
  body: string
  highlight?: boolean
}

export interface Slide {
  id: string
  position: number
  labelTopo: string
  tag?: string
  headlineTop?: string
  headlineEm?: string
  headlineBottom?: string
  paragraphs?: string[]
  list?: string[]
  stats?: [string, string][]
  cards?: SlideCard[]
  callout?: string
  imageUrl?: string
  imageKey?: string
  /** Deltas do editor de cena (scene-engine OverrideMap), por nodeId. */
  sceneOverrides?: Record<string, unknown>
}

export interface PublishTarget {
  id: string
  socialAccountId: string
  scheduledAt?: string
  publishedAt?: string
  externalMediaId?: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  /** 0–100, atualizado pelo backend conforme a publicação avança. */
  progress?: number
  /** Rótulo da fase atual, ex.: "Enviando slide 2/6". */
  progressPhase?: string
  attempts?: number
  lastError?: string
}

export interface RenderJob {
  id: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  bullJobId?: string
  progress?: number
  attempts: number
}

export interface Generation {
  id: string
  prompt: string
  response: Record<string, unknown>
  model: string
  inputTokens: number
  outputTokens: number
  durationMs: number
  createdAt: string
}

export interface Content {
  id: string
  slug: string
  status: ContentStatus
  contentType: ContentType
  persona: Persona
  pattern: Pattern
  templateSlug: string
  labelTopoCapa: string
  labelCapa: string
  hookCapa: string
  slides: Slide[]
  ctaLabelTopo: string
  ctaLabel: string
  ctaText: string
  ctaSub: string
  caption: string
  createdAt: string
  updatedAt: string
  scheduledAt?: string
  publishedAt?: string
  authorId: string
  templateId?: string
  publishTargets: PublishTarget[]
  renderJob?: RenderJob
  generation?: Generation
  /** CarouselInput cru (snake_case) da geração — fonte de verdade do texto p/ o estúdio. */
  slidesData?: Record<string, unknown>
  /** estilo aplicado ao post (snapshot: typography/palette/template). */
  styleData?: Record<string, unknown>
}

export interface CreateContentInput {
  contentType: ContentType
  persona: Persona
  pattern: Pattern
  templateSlug?: string
  hookCapa?: string
  caption?: string
  scheduledAt?: string
}

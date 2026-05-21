import type { ContentStatus, ContentType, Persona } from '@/types/content'
import type { PaginationParams } from '@/types/api'
import type { Platform } from '@/types/social-account'

export interface ContentFilterParams extends PaginationParams {
  status?: ContentStatus
  contentType?: ContentType
  persona?: Persona
  platform?: Platform
  search?: string
}

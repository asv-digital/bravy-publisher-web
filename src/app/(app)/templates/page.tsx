'use client'

import { PageHeader } from '@/components/layout/page-header'
import { TemplatesGallery } from '@/features/templates/components/templates-gallery'

export default function TemplatesPage() {
  return (
    <div>
      <PageHeader
        title="Templates"
        description="Galeria de templates visuais para carrosseis e posts."
      />
      <TemplatesGallery />
    </div>
  )
}

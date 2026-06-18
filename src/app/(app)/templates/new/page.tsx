'use client'

import { PageHeader } from '@/components/layout/page-header'
import { TemplateDesigner } from '@/features/templates/components/template-designer'

export default function NewTemplatePage() {
  return (
    <div>
      <PageHeader
        title="Novo template"
        description="Posicione onde vão headline, imagem, subtítulo, bullets e CTA."
      />
      <TemplateDesigner />
    </div>
  )
}

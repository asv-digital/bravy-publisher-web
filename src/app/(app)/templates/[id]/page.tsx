'use client'

import { useParams } from 'next/navigation'
import { PageHeader } from '@/components/layout/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { TemplateDesigner } from '@/features/templates/components/template-designer'
import { useCustomTemplate } from '@/features/templates/hooks/use-custom-templates'

export default function EditTemplatePage() {
  const params = useParams<{ id: string }>()
  const id = typeof params?.id === 'string' ? params.id : undefined
  const { data, isLoading, isError } = useCustomTemplate(id)

  return (
    <div>
      <PageHeader title="Editar template" description="Ajuste os slots e salve." />
      {isLoading ? (
        <Skeleton className="h-[480px] w-full rounded-xl" />
      ) : isError || !data ? (
        <p className="text-sm text-muted-foreground">Template não encontrado.</p>
      ) : (
        <TemplateDesigner existing={data} />
      )}
    </div>
  )
}

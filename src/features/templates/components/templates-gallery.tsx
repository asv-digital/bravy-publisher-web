'use client'

import { useState, useMemo } from 'react'
import { useTemplates } from '../hooks/use-templates'
import { TemplateCard } from './template-card'
import { TemplatePreviewDialog } from './template-preview-dialog'
import { TemplateFilters } from './template-filters'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/layout/empty-state'
import { LayoutTemplate } from 'lucide-react'
import type { Template } from '@/types/template'
import type { Persona } from '@/types/content'
import type { TemplateFamily } from '@/types/template'

export function TemplatesGallery() {
  const [family, setFamily] = useState<TemplateFamily | undefined>()
  const [persona, setPersona] = useState<Persona | undefined>()
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: templates, isLoading } = useTemplates()

  const filtered = useMemo(() => {
    if (!templates) return []
    let result = templates
    if (family) result = result.filter((t) => t.family === family)
    if (persona) result = result.filter((t) => t.persona === persona)
    return result
  }, [templates, family, persona])

  function handleCardClick(template: Template) {
    setPreviewTemplate(template)
    setDialogOpen(true)
  }

  function handleClearFilters() {
    setFamily(undefined)
    setPersona(undefined)
  }

  return (
    <div className="flex flex-col gap-6">
      <TemplateFilters
        family={family}
        persona={persona}
        onFamilyChange={setFamily}
        onPersonaChange={setPersona}
        onClear={handleClearFilters}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-36 w-full rounded-xl" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={LayoutTemplate}
          title="Nenhum template encontrado"
          description="Tente alterar os filtros ou criar um novo template."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onClick={handleCardClick}
            />
          ))}
        </div>
      )}

      <TemplatePreviewDialog
        template={previewTemplate}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}

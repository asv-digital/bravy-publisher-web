'use client'

import Link from 'next/link'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SYSTEM_TEMPLATES } from '../lib/system-templates'
import { TemplateThumb } from './template-thumb'
import { SystemTemplateActions } from './system-template-actions'
import { LayoutPreview } from './layout-preview'
import { useCustomTemplates, useDeleteTemplate } from '../hooks/use-custom-templates'

export function TemplatesGallery() {
  const { data: customs, isLoading } = useCustomTemplates()
  const del = useDeleteTemplate()

  function handleDelete(id: string, name: string) {
    if (!window.confirm(`Excluir o template "${name}"?`)) return
    del.mutate(id, {
      onSuccess: () => toast.success('Template excluído.'),
      onError: () => toast.error('Falha ao excluir.'),
    })
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Templates do sistema */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium">Templates do sistema</h2>
          <Badge variant="secondary" className="text-[10px]">{SYSTEM_TEMPLATES.length}</Badge>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SYSTEM_TEMPLATES.map((t) => (
            <Card key={t.id} size="sm" className="relative overflow-hidden">
              <SystemTemplateActions template={t} />
              <div className="aspect-square w-full overflow-hidden border-b bg-muted/40">
                <TemplateThumb template={t} size={400} />
              </div>
              <div className="flex flex-col gap-1.5 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{t.name}</p>
                  <Badge variant="outline" className="text-[10px]">Sistema</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{t.description}</p>
                <Link href="/content/new" className="mt-1">
                  <Button variant="outline" size="sm" className="w-full">Usar template</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Templates customizados */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium">Seus templates</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* criar novo */}
          <Link
            href="/templates/new"
            className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <Plus className="size-7" />
            <span className="text-sm font-medium">Criar template</span>
            <span className="px-4 text-center text-xs">Defina onde vão headline, imagem, bullets e CTA</span>
          </Link>

          {isLoading
            ? Array.from({ length: 2 }, (_, i) => <Skeleton key={i} className="aspect-square w-full rounded-xl" />)
            : (customs ?? []).map((t) => (
                <Card key={t.id} size="sm" className="overflow-hidden">
                  <div className="aspect-square w-full overflow-hidden border-b bg-muted/40">
                    <LayoutPreview spec={t.layout} styleData={t.styleData ?? null} size={400} />
                  </div>
                  <div className="flex flex-col gap-1.5 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{t.name}</p>
                      <Badge variant="outline" className="text-[10px]">{t.kind === 'post' ? 'Post' : 'Carrossel'}</Badge>
                    </div>
                    <div className="mt-1 flex gap-1.5">
                      <Link href={`/templates/${t.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Pencil className="size-3" data-icon="inline-start" />
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(t.id, t.name)}
                        disabled={del.isPending}
                        aria-label="Excluir"
                      >
                        {del.isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
        </div>
      </section>
    </div>
  )
}

'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Template } from '@/types/template'
import { PERSONA_COLORS } from '@/lib/constants'
import type { Persona } from '@/types/content'

interface TemplatePreviewDialogProps {
  template: Template | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function TemplatePreviewDialog({
  template,
  open,
  onOpenChange,
}: TemplatePreviewDialogProps) {
  if (!template) return null

  const personaColor = template.persona
    ? PERSONA_COLORS[template.persona as Persona]
    : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{template.slug}</DialogTitle>
          <DialogDescription>
            Criado em {formatDate(template.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{template.family}</Badge>
          {template.persona && (
            <Badge
              style={{
                backgroundColor: personaColor?.soft,
                color: personaColor?.accent,
              }}
            >
              {template.persona}
            </Badge>
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Variaveis CSS
          </p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(template.cssVariables).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1 text-xs"
              >
                <div
                  className="h-3 w-3 rounded-sm border"
                  style={{ backgroundColor: value }}
                />
                <span className="font-mono text-muted-foreground">{key}</span>
                <span className="font-mono ml-auto">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Preview HTML
          </p>
          <div
            className="max-h-48 overflow-auto rounded-md bg-muted/30 p-3 text-xs font-mono border"
            dangerouslySetInnerHTML={{ __html: template.htmlContent }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

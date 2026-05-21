'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { Content } from '@/types/content'

type CtaField = 'ctaLabelTopo' | 'ctaLabel' | 'ctaText' | 'ctaSub'

interface CtaEditorProps {
  ctaLabelTopo: string
  ctaLabel: string
  ctaText: string
  ctaSub: string
  onChange: (field: CtaField, value: string) => void
}

export function CtaEditor({ ctaLabelTopo, ctaLabel, ctaText, ctaSub, onChange }: CtaEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CTA</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Label topo</Label>
            <Input
              value={ctaLabelTopo}
              onChange={(e) => onChange('ctaLabelTopo', e.target.value)}
              placeholder="ta na hora de testar"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Label</Label>
            <Input
              value={ctaLabel}
              onChange={(e) => onChange('ctaLabel', e.target.value)}
              placeholder="leva 2 minutos pra colar"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Texto (aceita &lt;span class=&quot;keyword&quot;&gt;)</Label>
          <Textarea
            value={ctaText}
            onChange={(e) => onChange('ctaText', e.target.value)}
            placeholder='Comenta <span class="keyword">hoje</span> que mando o prompt completo.'
            rows={2}
          />
          {ctaText && (
            <div className="rounded-md border bg-muted/30 p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Preview:</p>
              <p
                className="text-sm [&>.keyword]:rounded [&>.keyword]:bg-primary/20 [&>.keyword]:px-1 [&>.keyword]:font-semibold [&>.keyword]:text-primary"
                dangerouslySetInnerHTML={{ __html: ctaText }}
              />
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Sub-texto</Label>
          <Input
            value={ctaSub}
            onChange={(e) => onChange('ctaSub', e.target.value)}
            placeholder="Sem te cobrar nada por isso."
          />
        </div>
      </CardContent>
    </Card>
  )
}

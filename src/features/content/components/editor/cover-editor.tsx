'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { Content } from '@/types/content'

interface CoverEditorProps {
  labelTopoCapa: string
  labelCapa: string
  hookCapa: string
  onChange: (field: keyof Pick<Content, 'labelTopoCapa' | 'labelCapa' | 'hookCapa'>, value: string) => void
}

export function CoverEditor({ labelTopoCapa, labelCapa, hookCapa, onChange }: CoverEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Capa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="labelTopoCapa">Label topo</Label>
          <Input
            id="labelTopoCapa"
            value={labelTopoCapa}
            onChange={(e) => onChange('labelTopoCapa', e.target.value)}
            placeholder="CLAUDE CODE / CONTABIL"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="labelCapa">Label capa</Label>
          <Input
            id="labelCapa"
            value={labelCapa}
            onChange={(e) => onChange('labelCapa', e.target.value)}
            placeholder="recuperacao tributaria automatica"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="hookCapa">Hook (aceita &lt;em&gt; e &lt;span class=&quot;strong&quot;&gt;)</Label>
          <Textarea
            id="hookCapa"
            value={hookCapa}
            onChange={(e) => onChange('hookCapa', e.target.value)}
            placeholder='500 holerites em <em>15 minutos</em>. <span class="strong">Sem tocar no Dominio.</span>'
            rows={3}
          />
          {hookCapa && (
            <div className="rounded-md border bg-muted/30 p-3">
              <p className="text-xs font-medium text-muted-foreground mb-1">Preview:</p>
              <p
                className="text-sm leading-relaxed [&>em]:italic [&>em]:text-primary [&>.strong]:font-bold"
                dangerouslySetInnerHTML={{ __html: hookCapa }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

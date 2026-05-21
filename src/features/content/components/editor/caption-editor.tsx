'use client'

import { Card, CardHeader, CardTitle, CardContent, CardAction } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CaptionEditorProps {
  caption: string
  onChange: (caption: string) => void
}

const MAX_CHARS = 2200
const WARN_CHARS = 2000

export function CaptionEditor({ caption, onChange }: CaptionEditorProps) {
  const charCount = caption.length
  const isOverWarn = charCount > WARN_CHARS
  const isOverMax = charCount > MAX_CHARS

  return (
    <Card>
      <CardHeader>
        <CardTitle>Legenda Instagram</CardTitle>
        <CardAction>
          <Badge
            variant={isOverMax ? 'destructive' : isOverWarn ? 'secondary' : 'outline'}
          >
            {charCount}/{MAX_CHARS}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        <Textarea
          value={caption}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escreva a legenda do post..."
          rows={8}
          className={cn(isOverMax && 'border-destructive')}
        />
        {isOverWarn && !isOverMax && (
          <p className="text-xs text-amber-600">
            Atencao: a legenda esta proxima do limite de {MAX_CHARS} caracteres.
          </p>
        )}
        {isOverMax && (
          <p className="text-xs text-destructive">
            A legenda excedeu o limite de {MAX_CHARS} caracteres. O Instagram pode truncar o texto.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

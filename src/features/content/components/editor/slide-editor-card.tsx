'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SlideBodyParagraphs } from './slide-body-paragraphs'
import { SlideBodyList } from './slide-body-list'
import { SlideBodyStats } from './slide-body-stats'
import { SlideBodyCards } from './slide-body-cards'
import { Textarea } from '@/components/ui/textarea'
import type { Slide } from '@/types/content'

interface SlideEditorCardProps {
  slide: Slide
  onChange: (slide: Slide) => void
}

function detectBodyType(slide: Slide): 'paragraphs' | 'list' | 'stats' | 'cards' | 'callout' | 'empty' {
  if (slide.paragraphs && slide.paragraphs.length > 0) return 'paragraphs'
  if (slide.list && slide.list.length > 0) return 'list'
  if (slide.stats && slide.stats.length > 0) return 'stats'
  if (slide.cards && slide.cards.length > 0) return 'cards'
  if (slide.callout) return 'callout'
  return 'empty'
}

export function SlideEditorCard({ slide, onChange }: SlideEditorCardProps) {
  const bodyType = detectBodyType(slide)

  function updateField<K extends keyof Slide>(field: K, value: Slide[K]) {
    onChange({ ...slide, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
            {slide.position}
          </span>
          Slide {slide.position}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Label topo</Label>
            <Input
              value={slide.labelTopo}
              onChange={(e) => updateField('labelTopo', e.target.value)}
              placeholder="02 -- o cenario"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Tag</Label>
            <Input
              value={slide.tag || ''}
              onChange={(e) => updateField('tag', e.target.value)}
              placeholder="passo a passo"
            />
          </div>
        </div>

        {(slide.headlineTop !== undefined || slide.headlineEm !== undefined || slide.headlineBottom !== undefined) && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Headlines</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                value={slide.headlineTop || ''}
                onChange={(e) => updateField('headlineTop', e.target.value)}
                placeholder="Headline topo"
              />
              <Input
                value={slide.headlineEm || ''}
                onChange={(e) => updateField('headlineEm', e.target.value)}
                placeholder="Headline em"
              />
              <Input
                value={slide.headlineBottom || ''}
                onChange={(e) => updateField('headlineBottom', e.target.value)}
                placeholder="Headline rodape"
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">
            Conteudo ({bodyType === 'empty' ? 'vazio' : bodyType})
          </Label>

          {bodyType === 'paragraphs' && (
            <SlideBodyParagraphs
              paragraphs={slide.paragraphs!}
              onChange={(paragraphs) => updateField('paragraphs', paragraphs)}
            />
          )}

          {bodyType === 'list' && (
            <SlideBodyList
              list={slide.list!}
              onChange={(list) => updateField('list', list)}
            />
          )}

          {bodyType === 'stats' && (
            <SlideBodyStats
              stats={slide.stats!}
              onChange={(stats) => updateField('stats', stats)}
            />
          )}

          {bodyType === 'cards' && (
            <SlideBodyCards
              cards={slide.cards!}
              onChange={(cards) => updateField('cards', cards)}
            />
          )}

          {bodyType === 'callout' && (
            <Textarea
              value={slide.callout || ''}
              onChange={(e) => updateField('callout', e.target.value)}
              placeholder="Texto do callout"
              rows={3}
            />
          )}

          {bodyType === 'empty' && (
            <p className="text-xs text-muted-foreground italic py-2">
              Este slide nao tem conteudo editavel.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'
import type { SlideCard } from '@/types/content'

interface SlideBodyCardsProps {
  cards: SlideCard[]
  onChange: (cards: SlideCard[]) => void
}

export function SlideBodyCards({ cards, onChange }: SlideBodyCardsProps) {
  function updateCard(index: number, field: keyof SlideCard, value: string | boolean) {
    const updated = cards.map((c, i) => {
      if (i === index) return { ...c, [field]: value }
      return c
    })
    onChange(updated)
  }

  function addCard() {
    onChange([...cards, { label: '', icon: '', title: '', body: '', highlight: false }])
  }

  function removeCard(index: number) {
    onChange(cards.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      {cards.map((card, index) => (
        <div
          key={index}
          className="space-y-2 rounded-lg border bg-muted/30 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Card {index + 1}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => removeCard(index)}
              disabled={cards.length <= 1}
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Input
              value={card.label}
              onChange={(e) => updateCard(index, 'label', e.target.value)}
              placeholder="Label (ex: ANTES)"
            />
            <Input
              value={card.icon || ''}
              onChange={(e) => updateCard(index, 'icon', e.target.value)}
              placeholder="Emoji"
              className="w-16 text-center"
            />
          </div>
          <Input
            value={card.title}
            onChange={(e) => updateCard(index, 'title', e.target.value)}
            placeholder="Titulo"
          />
          <Textarea
            value={card.body}
            onChange={(e) => updateCard(index, 'body', e.target.value)}
            placeholder="Corpo do card"
            rows={2}
            className="min-h-10"
          />
          <div className="flex items-center gap-2">
            <Switch
              checked={card.highlight ?? false}
              onCheckedChange={(checked) => updateCard(index, 'highlight', checked)}
            />
            <Label className="text-xs text-muted-foreground">Destaque</Label>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addCard} className="w-full">
        <Plus className="size-3" />
        Adicionar card
      </Button>
    </div>
  )
}

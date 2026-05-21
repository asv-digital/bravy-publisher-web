'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'

interface SlideBodyParagraphsProps {
  paragraphs: string[]
  onChange: (paragraphs: string[]) => void
}

export function SlideBodyParagraphs({ paragraphs, onChange }: SlideBodyParagraphsProps) {
  function updateParagraph(index: number, value: string) {
    const updated = [...paragraphs]
    updated[index] = value
    onChange(updated)
  }

  function addParagraph() {
    onChange([...paragraphs, ''])
  }

  function removeParagraph(index: number) {
    onChange(paragraphs.filter((_, i) => i !== index))
  }

  function moveParagraph(index: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= paragraphs.length) return
    const updated = [...paragraphs]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      {paragraphs.map((paragraph, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="flex flex-col gap-0.5 pt-1">
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={index === 0}
              onClick={() => moveParagraph(index, 'up')}
            >
              <ArrowUp className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={index === paragraphs.length - 1}
              onClick={() => moveParagraph(index, 'down')}
            >
              <ArrowDown className="size-3" />
            </Button>
          </div>
          <Textarea
            value={paragraph}
            onChange={(e) => updateParagraph(index, e.target.value)}
            placeholder={`Paragrafo ${index + 1}`}
            className="min-h-10 flex-1"
            rows={2}
          />
          <Button
            variant="ghost"
            size="icon-xs"
            className="mt-1 text-muted-foreground hover:text-destructive"
            onClick={() => removeParagraph(index)}
            disabled={paragraphs.length <= 1}
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addParagraph} className="w-full">
        <Plus className="size-3" />
        Adicionar paragrafo
      </Button>
    </div>
  )
}

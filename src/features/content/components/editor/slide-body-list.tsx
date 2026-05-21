'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'

interface SlideBodyListProps {
  list: string[]
  onChange: (list: string[]) => void
}

export function SlideBodyList({ list, onChange }: SlideBodyListProps) {
  function updateItem(index: number, value: string) {
    const updated = [...list]
    updated[index] = value
    onChange(updated)
  }

  function addItem() {
    onChange([...list, ''])
  }

  function removeItem(index: number) {
    onChange(list.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      {list.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
            {index + 1}
          </div>
          <Input
            value={item}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={`Item ${index + 1}`}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(index)}
            disabled={list.length <= 1}
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem} className="w-full">
        <Plus className="size-3" />
        Adicionar item
      </Button>
    </div>
  )
}

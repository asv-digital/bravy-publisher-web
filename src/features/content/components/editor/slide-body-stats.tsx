'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'

interface SlideBodyStatsProps {
  stats: [string, string][]
  onChange: (stats: [string, string][]) => void
}

export function SlideBodyStats({ stats, onChange }: SlideBodyStatsProps) {
  function updateStat(index: number, field: 0 | 1, value: string) {
    const updated = stats.map((s) => [...s] as [string, string])
    updated[index][field] = value
    onChange(updated)
  }

  function addStat() {
    onChange([...stats, ['', '']])
  }

  function removeStat(index: number) {
    onChange(stats.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={stat[0]}
            onChange={(e) => updateStat(index, 0, e.target.value)}
            placeholder="Numero"
            className="w-28 shrink-0 font-mono font-semibold"
          />
          <Input
            value={stat[1]}
            onChange={(e) => updateStat(index, 1, e.target.value)}
            placeholder="Descricao"
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => removeStat(index)}
            disabled={stats.length <= 1}
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addStat} className="w-full">
        <Plus className="size-3" />
        Adicionar estatistica
      </Button>
    </div>
  )
}

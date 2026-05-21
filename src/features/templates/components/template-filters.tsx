'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TEMPLATE_FAMILIES, PERSONAS } from '@/lib/constants'
import type { Persona } from '@/types/content'
import type { TemplateFamily } from '@/types/template'
import { X } from 'lucide-react'

interface TemplateFiltersProps {
  family?: TemplateFamily
  persona?: Persona
  onFamilyChange: (family: TemplateFamily | undefined) => void
  onPersonaChange: (persona: Persona | undefined) => void
  onClear: () => void
}

export function TemplateFilters({
  family,
  persona,
  onFamilyChange,
  onPersonaChange,
  onClear,
}: TemplateFiltersProps) {
  const hasFilters = family != null || persona != null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={family ?? ''}
        onValueChange={(val: string | null) =>
          onFamilyChange(val ? (val as TemplateFamily) : undefined)
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Familia" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todas</SelectItem>
          {TEMPLATE_FAMILIES.map((f) => (
            <SelectItem key={f.value} value={f.value}>
              {f.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={persona ?? ''}
        onValueChange={(val: string | null) =>
          onPersonaChange(val ? (val as Persona) : undefined)
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Persona" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todas</SelectItem>
          {PERSONAS.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="mr-1" />
          Limpar
        </Button>
      )}
    </div>
  )
}

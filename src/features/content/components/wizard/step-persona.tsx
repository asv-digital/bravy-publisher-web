'use client'

import {
  Calculator,
  Scale,
  Briefcase,
  Ruler,
  Wrench,
  Megaphone,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { PERSONAS, PERSONA_COLORS } from '@/lib/constants'
import type { Persona } from '@/types/content'
import { useWizardStore } from './wizard-store'

const ICON_MAP: Record<string, LucideIcon> = {
  Calculator,
  Scale,
  Briefcase,
  Ruler,
  Wrench,
  Megaphone,
}

export function StepPersona() {
  const persona = useWizardStore((s) => s.persona)
  const setPersona = useWizardStore((s) => s.setPersona)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Escolha a persona</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Para quem este conteudo sera direcionado?
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PERSONAS.map((p) => {
          const Icon = ICON_MAP[p.icon]
          const colors = PERSONA_COLORS[p.value as Persona]
          const isSelected = persona === p.value

          return (
            <Card
              key={p.value}
              className={cn(
                'cursor-pointer transition-all duration-200 hover:shadow-md',
                isSelected
                  ? 'ring-2 shadow-md'
                  : 'hover:ring-1 hover:ring-foreground/10'
              )}
              style={
                isSelected
                  ? {
                      borderColor: colors.accent,
                      boxShadow: `0 0 0 2px ${colors.accent}`,
                    }
                  : undefined
              }
              onClick={() => setPersona(p.value)}
            >
              <CardContent className="flex items-start gap-4">
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: colors.soft,
                    color: colors.accent,
                  }}
                >
                  {Icon && <Icon className="size-5" />}
                </div>
                <div className="min-w-0">
                  <p className="font-medium">{p.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {p.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

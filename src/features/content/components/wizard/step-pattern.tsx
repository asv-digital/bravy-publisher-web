'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PATTERNS } from '@/lib/constants'
import { useWizardStore } from './wizard-store'

export function StepPattern() {
  const pattern = useWizardStore((s) => s.pattern)
  const setPattern = useWizardStore((s) => s.setPattern)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Escolha o padrao</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Qual framework de copy sera usado?
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PATTERNS.map((p) => {
          const isSelected = pattern === p.value

          return (
            <Card
              key={p.value}
              className={cn(
                'cursor-pointer transition-all duration-200 hover:shadow-md',
                isSelected
                  ? 'ring-2 ring-primary shadow-md'
                  : 'hover:ring-1 hover:ring-foreground/10'
              )}
              onClick={() => setPattern(p.value)}
            >
              <CardContent className="flex items-start gap-4">
                <div
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-lg text-base font-bold',
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {p.value}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{p.label}</p>
                    <Badge variant="secondary" className="shrink-0 tabular-nums">
                      {p.score.toLocaleString('pt-BR')}
                    </Badge>
                  </div>
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

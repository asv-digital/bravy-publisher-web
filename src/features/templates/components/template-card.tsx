'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Template } from '@/types/template'
import { PERSONA_COLORS } from '@/lib/constants'
import type { Persona } from '@/types/content'

const FAMILY_COLORS: Record<string, { bg: string; text: string }> = {
  STEP: { bg: '#F5F2EE', text: '#141413' },
  COMPENDIUM: { bg: '#1A1A2E', text: '#E8E8E8' },
  EDITORIAL: { bg: '#FFF8F0', text: '#3D2B1F' },
  TERMINAL: { bg: '#0A0A0A', text: '#4AF626' },
  SPLIT: { bg: '#F0F4F8', text: '#2D3748' },
  STATIC: { bg: '#FAF5FF', text: '#553C9A' },
}

interface TemplateCardProps {
  template: Template
  onClick: (template: Template) => void
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  const familyStyle = FAMILY_COLORS[template.family] ?? FAMILY_COLORS.STEP
  const personaColor = template.persona
    ? PERSONA_COLORS[template.persona as Persona]
    : null

  return (
    <Card
      size="sm"
      className="cursor-pointer transition-shadow hover:ring-2 hover:ring-ring/20"
      onClick={() => onClick(template)}
    >
      <div
        className="flex h-36 items-center justify-center rounded-t-xl"
        style={{ backgroundColor: familyStyle.bg }}
      >
        <span
          className="text-lg font-semibold tracking-tight"
          style={{ color: familyStyle.text }}
        >
          {template.family}
        </span>
      </div>
      <CardContent className="flex flex-col gap-2 pt-3">
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="text-[10px]">
            {template.family}
          </Badge>
          {template.persona && (
            <Badge
              className="text-[10px]"
              style={{
                backgroundColor: personaColor?.soft,
                color: personaColor?.accent,
                borderColor: 'transparent',
              }}
            >
              {template.persona}
            </Badge>
          )}
        </div>
        <p className="text-sm font-medium truncate">{template.slug}</p>
      </CardContent>
    </Card>
  )
}

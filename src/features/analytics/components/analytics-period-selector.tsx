'use client'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

interface AnalyticsPeriodSelectorProps {
  value: '30d' | '60d' | '90d'
  onChange: (value: '30d' | '60d' | '90d') => void
}

export function AnalyticsPeriodSelector({
  value,
  onChange,
}: AnalyticsPeriodSelectorProps) {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(values) => {
        const last = values[values.length - 1]
        if (last) onChange(last as '30d' | '60d' | '90d')
      }}
      variant="outline"
      size="sm"
      spacing={0}
    >
      <ToggleGroupItem value="30d">30 dias</ToggleGroupItem>
      <ToggleGroupItem value="60d">60 dias</ToggleGroupItem>
      <ToggleGroupItem value="90d">90 dias</ToggleGroupItem>
    </ToggleGroup>
  )
}

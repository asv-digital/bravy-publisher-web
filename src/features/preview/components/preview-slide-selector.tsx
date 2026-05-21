'use client'

import { cn } from '@/lib/utils'
import { getAccentColor } from '../lib/persona-palette'
import type { Persona } from '@/types/content'

interface PreviewSlideSelectorProps {
  totalSlides: number
  selectedSlide: number
  onSlideChange: (index: number) => void
  persona?: Persona
  className?: string
}

export function PreviewSlideSelector({
  totalSlides,
  selectedSlide,
  onSlideChange,
  persona,
  className,
}: PreviewSlideSelectorProps) {
  const accent = getAccentColor(persona)

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {Array.from({ length: totalSlides }, (_, i) => {
        const isActive = i === selectedSlide
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSlideChange(i)}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition-colors',
              isActive
                ? 'text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
            style={isActive ? { backgroundColor: accent } : undefined}
          >
            {i + 1}
          </button>
        )
      })}
    </div>
  )
}

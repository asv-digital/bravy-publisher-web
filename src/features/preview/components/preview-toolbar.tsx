'use client'

import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PreviewSlideSelector } from './preview-slide-selector'
import type { Persona } from '@/types/content'

interface PreviewToolbarProps {
  totalSlides: number
  selectedSlide: number
  onSlideChange: (index: number) => void
  persona?: Persona
  zoom?: number
  onZoomChange?: (zoom: number) => void
  className?: string
}

export function PreviewToolbar({
  totalSlides,
  selectedSlide,
  onSlideChange,
  persona,
  zoom,
  onZoomChange,
  className,
}: PreviewToolbarProps) {
  const canPrev = selectedSlide > 0
  const canNext = selectedSlide < totalSlides - 1

  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          disabled={!canPrev}
          onClick={() => onSlideChange(selectedSlide - 1)}
        >
          <ChevronLeft />
        </Button>
        <span className="text-sm text-muted-foreground tabular-nums min-w-[70px] text-center">
          Slide {selectedSlide + 1}/{totalSlides}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          disabled={!canNext}
          onClick={() => onSlideChange(selectedSlide + 1)}
        >
          <ChevronRight />
        </Button>
      </div>

      <PreviewSlideSelector
        totalSlides={totalSlides}
        selectedSlide={selectedSlide}
        onSlideChange={onSlideChange}
        persona={persona}
        className="hidden sm:flex"
      />

      {onZoomChange && zoom != null && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={zoom <= 0.5}
            onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
          >
            <ZoomOut />
          </Button>
          <span className="text-xs text-muted-foreground tabular-nums w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={zoom >= 1.5}
            onClick={() => onZoomChange(Math.min(1.5, zoom + 0.1))}
          >
            <ZoomIn />
          </Button>
        </div>
      )}
    </div>
  )
}

'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Content } from '@/types/content'
import { cn } from '@/lib/utils'
import { renderContent } from '../lib/template-renderer'
import { PreviewToolbar } from './preview-toolbar'

export interface PreviewEngineProps {
  content: Content
  selectedSlide?: number
  onSlideChange?: (index: number) => void
  className?: string
}

export function PreviewEngine({
  content,
  selectedSlide = 0,
  onSlideChange,
  className,
}: PreviewEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [internalSlide, setInternalSlide] = useState(selectedSlide)
  const [containerWidth, setContainerWidth] = useState(0)

  const currentSlide = onSlideChange ? selectedSlide : internalSlide
  const totalSlides = (content.slides?.length ?? 0) + 2 // cover + content slides + CTA

  const handleSlideChange = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, totalSlides - 1))
      if (onSlideChange) {
        onSlideChange(clamped)
      } else {
        setInternalSlide(clamped)
      }
    },
    [onSlideChange, totalSlides]
  )

  // Sync external selectedSlide prop
  useEffect(() => {
    if (onSlideChange) return
    setInternalSlide(selectedSlide)
  }, [selectedSlide, onSlideChange])

  // Measure container width for responsive scaling
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // Scroll iframe to the selected slide
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe?.contentWindow) return

    const scrollTo = () => {
      iframe.contentWindow?.scrollTo({
        left: currentSlide * 1080,
        top: 0,
        behavior: 'smooth',
      })
    }

    // If iframe is loaded, scroll immediately; otherwise wait for load
    if (iframe.contentDocument?.readyState === 'complete') {
      scrollTo()
    } else {
      iframe.addEventListener('load', scrollTo, { once: true })
    }
  }, [currentSlide])

  const srcdoc = useMemo(() => renderContent(content), [content])

  // Calculate scale to fit 1080px into the available container width
  const scale = containerWidth > 0 ? Math.min(containerWidth / 1080, 1) : 0.5
  const scaledHeight = 1080 * scale

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <PreviewToolbar
        totalSlides={totalSlides}
        selectedSlide={currentSlide}
        onSlideChange={handleSlideChange}
        persona={content.persona}
      />
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg border bg-muted/30"
        style={{ height: scaledHeight || 'auto' }}
      >
        {containerWidth > 0 && (
          <iframe
            ref={iframeRef}
            title="Preview"
            sandbox="allow-same-origin"
            srcDoc={srcdoc}
            className="origin-top-left border-0"
            style={{
              width: 1080,
              height: 1080,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              overflow: 'hidden',
            }}
          />
        )}
      </div>
    </div>
  )
}

'use client'

/**
 * Render do engine de um LayoutSpec custom (preenchido com DEMO_CONTENT). Usado
 * como fundo WYSIWYG do designer e como thumbnail de templates custom na galeria.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { resolveScene, type BrandKit, type LayoutSpec, type MetricsProvider } from '@publisher/scene-engine'
import { ensureStudioFonts, sanitizeKit } from '@/features/content/studio/lib/browser-metrics'
import { paintToCanvas, onSceneImageLoad } from '@/features/content/studio/lib/paint-canvas'
import { contentToDoc } from '@/features/content/studio/lib/content-to-doc'
import { DEMO_CONTENT } from '@/features/content/studio/demo-content'
import { useBrandKit } from '@/features/content/studio/hooks/use-brand-kit'
import type { StyleData } from '@/features/content/studio/lib/style-presets'

interface LayoutPreviewProps {
  spec: LayoutSpec
  styleData?: StyleData | null
  /** índice da cena (carrossel). 0 = capa. */
  slideIndex?: number
  /** resolução interna do canvas (px). */
  size?: number
  className?: string
}

const DEMO_CONTENT_TEXT = { ...contentToDoc(DEMO_CONTENT).content, template: 'custom' as const }

export function LayoutPreview({ spec, styleData, slideIndex = 0, size = 480, className }: LayoutPreviewProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const { kit: tenantKit } = useBrandKit()
  const [metrics, setMetrics] = useState<MetricsProvider | null>(null)

  const kit = useMemo<BrandKit>(() => {
    if (!styleData) return tenantKit
    return { ...tenantKit, typography: styleData.typography ?? tenantKit.typography, palette: styleData.palette ?? tenantKit.palette, brand: styleData.brand ?? tenantKit.brand }
  }, [tenantKit, styleData])

  const kitKey = Object.values(kit.typography).map((r) => `${r.source}:${r.family}`).join('|')

  useEffect(() => {
    let alive = true
    ensureStudioFonts(kit).then((m) => alive && setMetrics(m)).catch(() => null)
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kitKey])

  // chave que muda quando o layout muda → re-render
  const specKey = JSON.stringify(spec)

  useEffect(() => {
    function paint() {
      if (!metrics || !ref.current) return
      try {
        const scene = resolveScene(
          { schemaVersion: 1, content: DEMO_CONTENT_TEXT, layout: spec },
          metrics,
          sanitizeKit(kit),
        )
        const slide = scene.slides[slideIndex] ?? scene.slides[0]
        if (slide) paintToCanvas(ref.current, slide, metrics, size / (spec.width || 1080))
      } catch {
        /* preview cosmético */
      }
    }
    paint()
    return onSceneImageLoad(paint)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics, specKey, kitKey, size, slideIndex])

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}

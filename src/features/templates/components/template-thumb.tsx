'use client'

/**
 * Miniatura de um template renderizada pelo PRÓPRIO engine (paridade pixel com
 * o estúdio): resolve a cena do DEMO_CONTENT com a família + styleData do
 * template e pinta no canvas. Reusado pela galeria /templates e pela escolha de
 * template no wizard. Mesma técnica do PresetCard da antiga StylesPanel.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { resolveScene, type BrandKit, type MetricsProvider } from '@publisher/scene-engine'
import { ensureStudioFonts, sanitizeKit } from '@/features/content/studio/lib/browser-metrics'
import { paintToCanvas } from '@/features/content/studio/lib/paint-canvas'
import { contentToDoc } from '@/features/content/studio/lib/content-to-doc'
import { DEMO_CONTENT } from '@/features/content/studio/demo-content'
import { useBrandKit } from '@/features/content/studio/hooks/use-brand-kit'
import type { SystemTemplate } from '../lib/system-templates'

interface TemplateThumbProps {
  template: SystemTemplate
  /** resolução interna do canvas (px). A exibição preenche o container via CSS. */
  size?: number
  /** índice da cena a exibir (0 = capa). */
  slideIndex?: number
  className?: string
}

export function TemplateThumb({ template, size = 360, slideIndex = 0, className }: TemplateThumbProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const { kit: tenantKit } = useBrandKit()
  const [metrics, setMetrics] = useState<MetricsProvider | null>(null)

  // kit do preview: styleData do template (se houver) sobre o kit do tenant
  const kit = useMemo<BrandKit>(() => {
    const s = template.styleData
    if (!s) return tenantKit
    return { ...tenantKit, typography: s.typography ?? tenantKit.typography, palette: s.palette ?? tenantKit.palette, brand: s.brand ?? tenantKit.brand }
  }, [tenantKit, template])

  const kitKey = Object.values(kit.typography).map((r) => `${r.source}:${r.family}`).join('|')

  useEffect(() => {
    let alive = true
    ensureStudioFonts(kit)
      .then((m) => alive && setMetrics(m))
      .catch(() => null)
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kitKey])

  useEffect(() => {
    if (!metrics || !ref.current) return
    try {
      const doc = contentToDoc(DEMO_CONTENT)
      doc.content = { ...doc.content, template: template.family }
      const scene = resolveScene(doc, metrics, sanitizeKit(kit))
      const slide = scene.slides[slideIndex] ?? scene.slides[0]
      if (slide) paintToCanvas(ref.current, slide, metrics, size / 1080)
    } catch {
      /* preview é cosmético */
    }
  }, [metrics, template, kit, size, slideIndex])

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

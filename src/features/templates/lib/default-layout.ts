/**
 * Layout inicial de um template custom (slots posicionados num canvas 1080²).
 * Ponto de partida do designer free-form e da duplicação de templates do
 * sistema ("Duplicar e customizar"). Mantido aqui pra não divergir entre os
 * dois usos.
 */
import type { LayoutSlot, LayoutSpec } from '@publisher/scene-engine'

const CANVAS = 1080

/** slots padrão: label, headline, imagem, bullets e CTA (ids estáveis). */
export function defaultLayoutSlots(): LayoutSlot[] {
  return [
    { id: 'slot-label', type: 'label', frame: { x: 80, y: 80, w: 920, h: 40 }, align: 'left' },
    { id: 'slot-headline', type: 'headline', frame: { x: 80, y: 140, w: 920, h: 240 }, align: 'left' },
    { id: 'slot-image', type: 'image', frame: { x: 80, y: 410, w: 920, h: 380 }, align: 'left' },
    { id: 'slot-bullets', type: 'bullets', frame: { x: 80, y: 820, w: 640, h: 180 }, align: 'left' },
    { id: 'slot-cta', type: 'cta', frame: { x: 740, y: 880, w: 260, h: 120 }, align: 'right' },
  ]
}

/** LayoutSpec inicial completo (canvas 1080², fundo `bg`). */
export function defaultLayoutSpec(
  kind: 'post' | 'carousel' = 'carousel',
  background: LayoutSpec['background'] = 'bg',
): LayoutSpec {
  return { kind, width: CANVAS, height: CANVAS, background, slots: defaultLayoutSlots() }
}

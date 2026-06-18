/**
 * Templates de SISTEMA — famílias de layout do scene-engine prontas, com preview
 * real renderizado pelo engine. Cada um é uma `TemplateFamily` (+ styleData
 * opcional). A galeria /templates e a escolha de template no wizard consomem
 * esta lista. Templates CUSTOM do usuário (designer free-form) chegam na Fase 2.
 */
import { SEED_BRAND_KIT, type BrandKit, type TemplateFamily } from '@publisher/scene-engine'
import type { StyleData } from '@/features/content/studio/lib/style-presets'
import type { SaveTemplateInput } from '../api/templates-api'
import { defaultLayoutSpec } from './default-layout'

export interface SystemTemplate {
  /** id estável (== família por enquanto). */
  id: string
  name: string
  description: string
  /** família de layout do engine. */
  family: TemplateFamily
  /** snapshot de estilo aplicado na criação (ex.: Twitter dark). Ausente = kit da marca. */
  styleData?: StyleData
}

/** Paleta escura estilo X/Twitter (sobre a paleta da marca). */
const TWITTER_DARK_PALETTE: StyleData['palette'] = {
  ...SEED_BRAND_KIT.palette,
  bg: '#000000',
  bg2: '#16181C',
  bgRose: '#16181C',
  cardBg: '#16181C',
  ink: '#E7E9EA',
  inkSoft: '#D4D7DA',
  muted: '#71767B',
  accent: '#7C6CFF',
  accentSoft: '#3E3A4A',
  line: '#2F3336',
}

export const SYSTEM_TEMPLATES: SystemTemplate[] = [
  {
    id: 'step',
    name: 'Editorial',
    description: 'Capa serif + slides creme texto-pesado. O carrossel padrão.',
    family: 'step',
  },
  {
    id: 'tweet',
    name: 'Twitter',
    description: 'Cards estilo X/Twitter: avatar, @handle, texto curto e imagem.',
    family: 'tweet',
    styleData: {
      presetId: 'system/tweet-dark',
      name: 'Twitter',
      template: 'tweet',
      typography: SEED_BRAND_KIT.typography,
      palette: TWITTER_DARK_PALETTE,
    },
  },
  {
    id: 'compendium',
    name: 'Terminal',
    description: 'Caixa escura estilo terminal/IDE com checklist em mono.',
    family: 'compendium',
  },
]

export function systemTemplateById(id: string): SystemTemplate | undefined {
  return SYSTEM_TEMPLATES.find((t) => t.id === id)
}

/** linha de design (paleta + tipografia) do template: a própria, ou a do kit. */
function systemTemplateStyle(t: SystemTemplate, kit: BrandKit): StyleData {
  return (
    t.styleData ?? {
      name: t.name,
      template: t.family,
      typography: kit.typography,
      palette: kit.palette,
      brand: kit.brand,
    }
  )
}

/**
 * Payload de "Duplicar e customizar": herda a linha de design do template do
 * sistema e parte de um layout editável, pra criar um Template custom e abrir
 * o designer (/templates/[id]) já com aquele estilo aplicado.
 */
export function systemTemplateDuplicateInput(t: SystemTemplate, kit: BrandKit): SaveTemplateInput {
  return {
    name: `${t.name} (cópia)`,
    kind: 'carousel',
    format: '1:1',
    layout: defaultLayoutSpec('carousel'),
    styleData: systemTemplateStyle(t, kit),
  }
}

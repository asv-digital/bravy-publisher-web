/**
 * Estilos (presets) de post: família de layout + tipografia + paleta completa.
 * O engine renderiza qualquer kit (tokens não-hardcoded, RFC §13) — um estilo
 * é só um BrandKit nomeado + template. 5 defaults aqui; estilos do usuário
 * vêm de /brand-kit (kits nomeados do tenant).
 */
import type { BrandKit, LayoutSpec, TemplateFamily } from '@publisher/scene-engine'
import { SEED_BRAND_KIT } from '@publisher/scene-engine'

export interface StylePreset {
  id: string
  name: string
  template: TemplateFamily
  typography: BrandKit['typography']
  palette: BrandKit['palette']
  brand?: BrandKit['brand']
  /** estilo salvo do usuário (CRUD habilitado). */
  custom?: boolean
}

// tipografias (bundled = zero download; google = ensure/cache automático)
const T = {
  jakarta: { family: 'Plus Jakarta Sans', weights: [400, 500, 600, 700, 800], style: 'normal', source: 'bundled' },
  jakartaBody: { family: 'Plus Jakarta Sans', weights: [400, 500, 700], style: 'normal', source: 'bundled' },
  jetbrains: { family: 'JetBrains Mono', weights: [400, 500, 600], style: 'normal', source: 'bundled' },
  dmSerifIt: { family: 'DM Serif Display', weights: [400], style: 'italic', source: 'bundled' },
  inter: { family: 'Inter', weights: [400, 500, 600, 700, 800], style: 'normal', source: 'google' },
  spaceGrotesk: { family: 'Space Grotesk', weights: [400, 500, 600, 700], style: 'normal', source: 'google' },
  poppins: { family: 'Poppins', weights: [400, 500, 600, 700, 800], style: 'normal', source: 'google' },
  lora: { family: 'Lora', weights: [400, 500, 600, 700], style: 'italic', source: 'google' },
  playfair: { family: 'Playfair Display', weights: [400, 500, 600, 700, 800], style: 'italic', source: 'google' },
  ibmMono: { family: 'IBM Plex Mono', weights: [400, 500, 600], style: 'normal', source: 'google' },
} as const

type Role = BrandKit['typography']['display']
const role = (r: (typeof T)[keyof typeof T]): Role => ({ ...r, weights: [...r.weights] }) as Role

export const DEFAULT_PRESETS: StylePreset[] = [
  {
    id: 'preset/editorial',
    name: 'Editorial',
    template: 'step',
    typography: SEED_BRAND_KIT.typography,
    palette: SEED_BRAND_KIT.palette,
  },
  {
    id: 'preset/terminal',
    name: 'Terminal',
    template: 'compendium',
    typography: {
      display: role(T.spaceGrotesk),
      body: role(T.inter),
      mono: role(T.jetbrains),
      accent: role(T.dmSerifIt),
    },
    palette: {
      ...SEED_BRAND_KIT.palette,
      bg: '#FAF6EE',
      cardBg: '#FAF6EE',
      ink: '#17150F',
      accent: '#C7634F',
    },
  },
  {
    id: 'preset/minimal',
    name: 'Minimal',
    template: 'step',
    typography: {
      display: role(T.inter),
      body: role(T.inter),
      mono: role(T.ibmMono),
      accent: role(T.playfair),
    },
    palette: {
      bg: '#FFFFFF',
      bg2: '#F4F4F5',
      bgRose: '#F4F4F5',
      cardBg: '#FAFAFA',
      ink: '#111113',
      inkSoft: '#3F3F46',
      muted: '#A1A1AA',
      accent: '#111113',
      accentSoft: '#52525B',
      line: '#E4E4E7',
      termBg: '#18181B',
      termText: '#E4E4E7',
      termMuted: '#A1A1AA',
      termStrong: '#FFFFFF',
      termPill: '#27272A',
      termPillBorder: '#3F3F46',
    },
  },
  {
    id: 'preset/noite',
    name: 'Noite',
    template: 'step',
    typography: {
      display: role(T.spaceGrotesk),
      body: role(T.inter),
      mono: role(T.jetbrains),
      accent: role(T.playfair),
    },
    palette: {
      bg: '#0E1116',
      bg2: '#161B22',
      bgRose: '#1C2430',
      cardBg: '#161B22',
      ink: '#F0F3F6',
      inkSoft: '#C3CBD4',
      muted: '#7D8590',
      accent: '#58E6B6',
      accentSoft: '#34D399',
      line: '#2D333B',
      termBg: '#010409',
      termText: '#E6EDF3',
      termMuted: '#7D8590',
      termStrong: '#FFFFFF',
      termPill: '#21262D',
      termPillBorder: '#30363D',
    },
  },
  {
    id: 'preset/pastel',
    name: 'Pastel',
    template: 'step',
    typography: {
      display: role(T.poppins),
      body: role(T.jakartaBody),
      mono: role(T.ibmMono),
      accent: role(T.lora),
    },
    palette: {
      bg: '#F6F1FB',
      bg2: '#EDE4F7',
      bgRose: '#FBE8EF',
      cardBg: '#FDFBFF',
      ink: '#3B2A4D',
      inkSoft: '#5C4972',
      muted: '#9C8FAD',
      accent: '#B4639B',
      accentSoft: '#C98AB6',
      line: '#DCCFEB',
      termBg: '#2C2138',
      termText: '#EFE6F8',
      termMuted: '#9C8FAD',
      termStrong: '#FFFFFF',
      termPill: '#3B2D4C',
      termPillBorder: '#52406A',
    },
  },
]

/** kit completo a partir de um preset (brand vem do kit do tenant). */
export function presetToKit(preset: StylePreset, base: BrandKit): BrandKit {
  return {
    ...base,
    typography: preset.typography,
    palette: preset.palette,
    brand: preset.brand ?? base.brand,
  }
}

/** payload persistido em Content.styleData. */
export interface StyleData {
  presetId?: string
  name: string
  template: TemplateFamily
  /** opcionais: templates custom podem usar só o kit da marca. */
  typography?: BrandKit['typography']
  palette?: BrandKit['palette']
  brand?: BrandKit['brand']
  /** layout do template custom (quando template === 'custom'). */
  layout?: LayoutSpec
}

export function presetToStyleData(p: StylePreset): StyleData {
  return { presetId: p.id, name: p.name, template: p.template, typography: p.typography, palette: p.palette, brand: p.brand }
}

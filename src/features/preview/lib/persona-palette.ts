import type { Persona } from '@/types/content'

const PERSONA_ACCENT: Record<Persona, string> = {
  contador: '#3B5D3A',
  advogado: '#8B2635',
  arquiteto: '#C8932F',
  empresario: '#DA7756',
  engenheiro: '#4A6FA5',
  agencia: '#7B4DAA',
}

export function getAccentColor(persona?: Persona): string {
  if (!persona) return PERSONA_ACCENT.empresario
  return PERSONA_ACCENT[persona] ?? PERSONA_ACCENT.empresario
}

export { PERSONA_ACCENT }

import { create } from 'zustand'
import type { Content, Persona, Pattern } from '@/types/content'

interface WizardState {
  currentStep: number
  persona: Persona | null
  pattern: Pattern | null
  theme: string
  generatedContent: Content | null
  selectedAccountIds: string[]
  scheduledAt: string | null

  setPersona: (persona: Persona) => void
  setPattern: (pattern: Pattern) => void
  setTheme: (theme: string) => void
  setGeneratedContent: (content: Content | null) => void
  setAccounts: (ids: string[]) => void
  setSchedule: (date: string | null) => void
  nextStep: () => void
  prevStep: () => void
  reset: () => void
}

export const useWizardStore = create<WizardState>((set) => ({
  currentStep: 1,
  persona: null,
  pattern: null,
  theme: '',
  generatedContent: null,
  selectedAccountIds: [],
  scheduledAt: null,

  setPersona: (persona) => set({ persona }),
  setPattern: (pattern) => set({ pattern }),
  setTheme: (theme) => set({ theme }),
  setGeneratedContent: (content) => set({ generatedContent: content }),
  setAccounts: (ids) => set({ selectedAccountIds: ids }),
  setSchedule: (date) => set({ scheduledAt: date }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 6) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),
  reset: () =>
    set({
      currentStep: 1,
      persona: null,
      pattern: null,
      theme: '',
      generatedContent: null,
      selectedAccountIds: [],
      scheduledAt: null,
    }),
}))

'use client'

import { useRef } from 'react'
import { Separator } from '@/components/ui/separator'
import { useWizardStore } from './wizard-store'
import { WizardStepper } from './wizard-stepper'
import { StepPersona } from './step-persona'
import { StepPattern } from './step-pattern'
import { StepTheme } from './step-theme'
import { StepGenerate } from './step-generate'
import { StepPreview } from './step-preview'
import { StepSchedule } from './step-schedule'
import { StudioContainer } from '../../studio/studio-container'

function CurrentStep() {
  const phase = useWizardStore((s) => s.phase)
  const generated = useWizardStore((s) => s.generatedContent)

  switch (phase) {
    case 'persona':
      return <StepPersona />
    case 'pattern':
      return <StepPattern />
    case 'theme':
      return <StepTheme />
    case 'generating':
      return <StepGenerate />
    case 'studio':
      // fase de edição: estúdio Konva é o default (cutover Sprint 3);
      // StepPreview só como fallback se ainda não houver content gerado
      return generated ? <StudioContainer contentId={generated.id} /> : <StepPreview />
    case 'schedule':
      return <StepSchedule />
    default:
      return null
  }
}

export function WizardContainer() {
  // O store do wizard é singleton de módulo e sobrevive à navegação. Sem este
  // reset, voltar pro listing e clicar "Novo conteúdo" reabriria o último
  // rascunho (phase='studio' + generatedContent ainda setados). Entrar em
  // /content/new sempre começa do zero. Reset no render (guardado por ref) evita
  // flash do estúdio antigo e um fetch desnecessário do conteúdo anterior.
  const didReset = useRef(false)
  if (!didReset.current) {
    didReset.current = true
    useWizardStore.getState().reset()
  }

  return (
    <div className="space-y-8">
      <WizardStepper />

      <Separator />

      <div className="min-h-100">
        <CurrentStep />
      </div>
    </div>
  )
}

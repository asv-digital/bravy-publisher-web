'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useWizardStore } from './wizard-store'
import { WizardStepper } from './wizard-stepper'
import { StepPersona } from './step-persona'
import { StepPattern } from './step-pattern'
import { StepTheme } from './step-theme'
import { StepGenerate } from './step-generate'
import { StepPreview } from './step-preview'
import { StepSchedule } from './step-schedule'

function CurrentStep() {
  const currentStep = useWizardStore((s) => s.currentStep)

  switch (currentStep) {
    case 1:
      return <StepPersona />
    case 2:
      return <StepPattern />
    case 3:
      return <StepTheme />
    case 4:
      return <StepGenerate />
    case 5:
      return <StepPreview />
    case 6:
      return <StepSchedule />
    default:
      return null
  }
}

function canAdvance(
  step: number,
  state: {
    persona: string | null
    pattern: string | null
    theme: string
    generatedContent: unknown
  }
): boolean {
  switch (step) {
    case 1:
      return state.persona !== null
    case 2:
      return state.pattern !== null
    case 3:
      return state.theme.trim().length > 0
    case 4:
      return state.generatedContent !== null
    case 5:
      return state.generatedContent !== null
    case 6:
      return false // Last step, no next
    default:
      return false
  }
}

export function WizardContainer() {
  const currentStep = useWizardStore((s) => s.currentStep)
  const persona = useWizardStore((s) => s.persona)
  const pattern = useWizardStore((s) => s.pattern)
  const theme = useWizardStore((s) => s.theme)
  const generatedContent = useWizardStore((s) => s.generatedContent)
  const nextStep = useWizardStore((s) => s.nextStep)
  const prevStep = useWizardStore((s) => s.prevStep)

  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === 6
  // Step 4 (Generate) auto-advances, so hide the Next button on that step
  const showNextButton = !isLastStep && currentStep !== 4
  const canGoNext = canAdvance(currentStep, {
    persona,
    pattern,
    theme,
    generatedContent,
  })

  return (
    <div className="space-y-8">
      <WizardStepper />

      <Separator />

      <div className="min-h-[400px]">
        <CurrentStep />
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          {!isFirstStep && (
            <Button variant="outline" onClick={prevStep}>
              <ArrowLeft className="size-4" data-icon="inline-start" />
              Voltar
            </Button>
          )}
        </div>

        <div>
          {showNextButton && (
            <Button onClick={nextStep} disabled={!canGoNext}>
              Proximo
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

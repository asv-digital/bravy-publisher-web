'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useWizardStore } from './wizard-store'

const MAX_CHARS = 500

export function StepTheme() {
  const theme = useWizardStore((s) => s.theme)
  const setTheme = useWizardStore((s) => s.setTheme)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Defina o tema</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Sobre o que sera o conteudo?
        </p>
      </div>

      <div className="space-y-3">
        <Label htmlFor="theme-input">Descreva o tema do conteudo</Label>
        <Textarea
          id="theme-input"
          value={theme}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) {
              setTheme(e.target.value)
            }
          }}
          placeholder="Ex: recuperacao tributaria com Claude Code para escritorios contabeis"
          className="min-h-32 resize-none"
        />
        <div className="flex justify-end">
          <span className="text-xs text-muted-foreground tabular-nums">
            {theme.length}/{MAX_CHARS}
          </span>
        </div>
      </div>
    </div>
  )
}

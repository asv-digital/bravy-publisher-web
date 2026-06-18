'use client'

import { useState } from 'react'
import { Lightbulb, Loader2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { Sparkles } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { SYSTEM_TEMPLATES } from '@/features/templates/lib/system-templates'
import { TemplateThumb } from '@/features/templates/components/template-thumb'
import { LayoutPreview } from '@/features/templates/components/layout-preview'
import { useCustomTemplates } from '@/features/templates/hooks/use-custom-templates'
import { useWizardStore } from './wizard-store'

const MAX_CHARS = 500

export function StepTheme() {
  const theme = useWizardStore((s) => s.theme)
  const setTheme = useWizardStore((s) => s.setTheme)
  const persona = useWizardStore((s) => s.persona)
  const pattern = useWizardStore((s) => s.pattern)
  const template = useWizardStore((s) => s.template)
  const selectedCustom = useWizardStore((s) => s.selectedCustom)
  const setTemplate = useWizardStore((s) => s.setTemplate)
  const { data: customTemplates } = useCustomTemplates()

  const [ideas, setIdeas] = useState<string[]>([])
  const [loadingIdeas, setLoadingIdeas] = useState(false)

  const handleSuggestIdeas = async () => {
    setLoadingIdeas(true)
    try {
      const { data } = await api.post<{ ideas: string[] }>(
        '/generation/suggest-theme',
        {
          persona: persona ?? undefined,
          pattern: pattern ?? undefined,
          hint: theme.trim() || undefined,
        }
      )
      if (data.ideas?.length) {
        setIdeas(data.ideas)
      } else {
        toast.error('Nao consegui gerar ideias. Tente de novo.')
      }
    } catch {
      toast.error('Erro ao gerar ideias. Tente de novo.')
    } finally {
      setLoadingIdeas(false)
    }
  }

  const handlePickIdea = (idea: string) => {
    setTheme(idea.slice(0, MAX_CHARS))
    setIdeas([])
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Defina o tema</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Sobre o que sera o conteudo?
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="theme-input">Descreva o tema do conteudo</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSuggestIdeas}
            disabled={loadingIdeas}
            className="text-primary"
          >
            {loadingIdeas ? (
              <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
            ) : (
              <Lightbulb className="size-4" data-icon="inline-start" />
            )}
            {loadingIdeas ? 'Gerando ideias...' : 'Gerar ideia'}
          </Button>
        </div>

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

      {/* template do post */}
      <div className="space-y-2">
        <Label>Template</Label>
        <p className="text-xs text-muted-foreground">
          O padrão visual do post. Gera já dentro do template escolhido.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Automático: sem preview, decide pelo padrão do hook */}
          <button
            type="button"
            onClick={() => setTemplate('auto')}
            className={cn(
              'flex flex-col overflow-hidden rounded-xl border-2 text-left transition-colors',
              template === 'auto' ? 'border-primary' : 'border-border hover:border-primary/50',
            )}
          >
            <div className="flex aspect-square w-full items-center justify-center bg-muted/40">
              <Sparkles className="size-6 text-muted-foreground" />
            </div>
            <div className="p-2">
              <span className="block text-sm font-medium">Automático</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">Decide pelo padrão</span>
            </div>
          </button>

          {SYSTEM_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplate(t.family)}
              className={cn(
                'flex flex-col overflow-hidden rounded-xl border-2 text-left transition-colors',
                template === t.family ? 'border-primary' : 'border-border hover:border-primary/50',
              )}
            >
              <div className="aspect-square w-full overflow-hidden bg-muted/40">
                <TemplateThumb template={t} size={220} />
              </div>
              <div className="p-2">
                <span className="block text-sm font-medium">{t.name}</span>
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">{t.description}</span>
              </div>
            </button>
          ))}
        </div>

        {/* templates customizados do usuário */}
        {!!customTemplates?.length && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-medium text-muted-foreground">Seus templates</span>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {customTemplates.map((t) => {
                const selected = template === 'custom' && selectedCustom?.id === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplate('custom', t)}
                    className={cn(
                      'flex flex-col overflow-hidden rounded-xl border-2 text-left transition-colors',
                      selected ? 'border-primary' : 'border-border hover:border-primary/50',
                    )}
                  >
                    <div className="aspect-square w-full overflow-hidden bg-muted/40">
                      <LayoutPreview spec={t.layout} styleData={t.styleData ?? null} size={220} />
                    </div>
                    <div className="p-2">
                      <span className="block truncate text-sm font-medium">{t.name}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{t.kind === 'post' ? 'Post único' : 'Carrossel'}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {ideas.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Sugestoes de tema
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSuggestIdeas}
              disabled={loadingIdeas}
              className="h-auto px-2 py-1 text-xs text-muted-foreground"
            >
              Gerar outras
            </Button>
          </div>
          <div className="space-y-2">
            {ideas.map((idea, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handlePickIdea(idea)}
                className="group flex w-full items-start gap-3 rounded-lg border border-border bg-card p-3 text-left text-sm transition-colors hover:border-primary hover:bg-accent"
              >
                <span className="flex-1">{idea}</span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

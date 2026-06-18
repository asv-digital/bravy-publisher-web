'use client'

/**
 * Menu de ações de um template do SISTEMA na galeria. "Duplicar e customizar"
 * cria um Template custom herdando a linha de design (paleta + tipografia) do
 * template e abre o designer (/templates/[id]) pra ajustar slots/estilo.
 */
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Copy, Loader2, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useBrandKit } from '@/features/content/studio/hooks/use-brand-kit'
import { useCreateTemplate } from '../hooks/use-custom-templates'
import { systemTemplateDuplicateInput, type SystemTemplate } from '../lib/system-templates'

export function SystemTemplateActions({ template }: { template: SystemTemplate }) {
  const router = useRouter()
  const { kit } = useBrandKit()
  const create = useCreateTemplate()
  const [busy, setBusy] = useState(false)

  async function onDuplicate() {
    setBusy(true)
    try {
      const created = await create.mutateAsync(systemTemplateDuplicateInput(template, kit))
      toast.success('Cópia criada — personalize do seu jeito.')
      router.push(`/templates/${created.id}`)
    } catch {
      toast.error('Não consegui duplicar o template.')
      setBusy(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={busy}
            className="absolute right-2 top-2 z-10 bg-background/80 text-foreground/70 opacity-0 backdrop-blur transition-opacity hover:bg-background hover:text-foreground focus-visible:opacity-100 aria-expanded:opacity-100 group-hover/card:opacity-100"
          />
        }
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : <MoreVertical className="size-4" />}
        <span className="sr-only">Ações do template</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onClick={onDuplicate} disabled={busy}>
          <Copy className="mr-2 size-4" />
          Duplicar e customizar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

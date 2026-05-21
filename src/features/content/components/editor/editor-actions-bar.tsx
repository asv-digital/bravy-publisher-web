'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { EditorStatusBar } from './editor-status-bar'
import { Save, Image, CalendarClock, Send } from 'lucide-react'
import { toast } from 'sonner'
import type { ContentStatus } from '@/types/content'

interface EditorActionsBarProps {
  status: ContentStatus
  lastSavedAt: string | null
  isSaving: boolean
  onSaveDraft: () => void
  onRender: () => void
  onSchedule: () => void
  onPublish: () => void
}

export function EditorActionsBar({
  status,
  lastSavedAt,
  isSaving,
  onSaveDraft,
  onRender,
  onSchedule,
  onPublish,
}: EditorActionsBarProps) {
  function handleSave() {
    onSaveDraft()
    toast.success('Rascunho salvo com sucesso')
  }

  function handleRender() {
    onRender()
    toast.info('Renderizacao de PNGs iniciada')
  }

  function handleSchedule() {
    onSchedule()
    toast.info('Agendamento em breve')
  }

  function handlePublish() {
    onPublish()
    toast.warning('Publicacao iniciada')
  }

  return (
    <div className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <EditorStatusBar
          status={status}
          lastSavedAt={lastSavedAt}
          isSaving={isSaving}
        />
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" onClick={handleSave} disabled={isSaving}>
            <Save className="size-3.5" data-icon="inline-start" />
            Salvar rascunho
          </Button>
          <Button variant="secondary" size="sm" onClick={handleRender}>
            <Image className="size-3.5" data-icon="inline-start" />
            Renderizar PNGs
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <Button variant="outline" size="sm" onClick={handleSchedule}>
            <CalendarClock className="size-3.5" data-icon="inline-start" />
            Agendar
          </Button>
          <Button variant="destructive" size="sm" onClick={handlePublish}>
            <Send className="size-3.5" data-icon="inline-start" />
            Publicar agora
          </Button>
        </div>
      </div>
    </div>
  )
}

'use client'

/**
 * StudioShell (RFC §7) — orquestra o estúdio editável: carrega o Content, monta
 * a cena viva pelo scene-engine, lista thumbnails, edita o slide ativo com
 * seleção/move/resize (overrides persistidos) e exporta os PNGs (Aprovar).
 * Carregado via dynamic(ssr:false) — depende de canvas/Konva/FontFace.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { toast } from 'sonner'
import { AlertTriangle, ArrowLeft, Redo2, Undo2, Loader2, ImageDown } from 'lucide-react'
import { getContent } from '../api/content-api'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SlideStage } from './SlideStage'
import { SlideThumbs } from './SlideThumbs'
import { RegenerateSlideButton } from './RegenerateSlideButton'
import { Inspector } from './Inspector'
import { StudioToolbar } from './StudioToolbar'
import { selectableBoxes } from './lib/selectable'
import { collectScenePayloads } from './lib/content-to-doc'
import { useStudioScene } from './hooks/use-studio-scene'
import { usePersistOverrides } from './hooks/use-persist-overrides'
import { usePersistText } from './hooks/use-persist-text'
import { useStudioExport } from './hooks/use-studio-export'
import { useStudioStore } from './studio-store'
import { initialRaw } from './lib/content-to-doc'
import { PublishDialog } from '../components/editor/publish-dialog'

export default function StudioShell({ contentId }: { contentId: string }) {
  const { data: content, isLoading, isError } = useQuery({
    queryKey: ['content', contentId],
    queryFn: () => getContent(contentId),
  })

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] gap-3 p-4">
        <Skeleton className="h-full w-32 rounded-xl" />
        <Skeleton className="h-full flex-1 rounded-xl" />
      </div>
    )
  }
  if (isError || !content) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="size-6 text-destructive" />
        </div>
        <p className="text-sm text-muted-foreground">Conteúdo não encontrado.</p>
        <Link href="/content">
          <Button variant="outline" size="sm">
            <ArrowLeft className="size-3.5" data-icon="inline-start" />
            Voltar
          </Button>
        </Link>
      </div>
    )
  }

  return <StudioEditor content={content} />
}

/** Editor montado com um Content já carregado (usado pelo shell e pela rota demo). */
export function StudioEditor({ content }: { content: import('@/types/content').Content }) {
  const { scene, metrics, brandKit, ready, fontError } = useStudioScene(content)
  usePersistOverrides(content)
  usePersistText(content)
  const { exporting, done, total, exportAll } = useStudioExport(content)
  const queryClient = useQueryClient()
  const [publishOpen, setPublishOpen] = useState(false)

  const activeIndex = useStudioStore((s) => s.activeIndex)
  const setActive = useStudioStore((s) => s.setActive)
  const reorderSlides = useStudioStore((s) => s.reorderSlides)
  // reordenação exige draft de texto (ordem vive em slidesData.slides)
  const canReorder = useStudioStore((s) => !!s.draft?.slides?.length)
  const init = useStudioStore((s) => s.init)
  const undo = useStudioStore((s) => s.undo)
  const redo = useStudioStore((s) => s.redo)
  const dirty = useStudioStore((s) => s.dirty)
  const textDirty = useStudioStore((s) => s.textDirty)
  const selectedIds = useStudioStore((s) => s.selectedIds)

  const wrapRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(540)

  // inicializa overrides + draft de texto + elementos livres; re-inicializa
  // quando o content muda no servidor (ex.: regenerar slide → updatedAt muda)
  useEffect(() => {
    const { overrides, added, groups } = collectScenePayloads(content)
    init(overrides, initialRaw(content), added, groups, (content.styleData as never) ?? null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content.id, content.updatedAt, init])

  // dimensiona o palco ao container
  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth
      const h = el.clientHeight
      setSize(Math.max(280, Math.min(w - 32, h - 32, 720)))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // teclado: undo/redo + agrupar/desagrupar
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return
      const key = e.key.toLowerCase()
      if (key === 'z') {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
      } else if (key === 'g') {
        e.preventDefault()
        const st = useStudioStore.getState()
        if (e.shiftKey) st.ungroupSelection(st.activeIndex)
        else st.groupSelection(st.activeIndex)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  async function onApprove() {
    if (!scene || !metrics) return
    try {
      const n = await exportAll(scene, metrics)
      toast.success(`${n} slides exportados e salvos`)
      // o export gravou imageUrl/imageKey nos slides — invalida os caches pra
      // listagem/detalhe refletirem, e abre o fluxo de publicação/agendamento
      queryClient.invalidateQueries({ queryKey: ['content', content.id] })
      queryClient.invalidateQueries({ queryKey: ['contents'] })
      setPublishOpen(true)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Falha ao exportar')
    }
  }

  const activeSlide = scene?.slides[activeIndex]
  const boxes = useMemo(() => {
    if (!activeSlide || !metrics) return []
    return selectableBoxes(activeSlide, metrics)
  }, [activeSlide, metrics])
  const selectedBox = useMemo(
    () => boxes.find((b) => b.id === selectedIds[0]) ?? null,
    [boxes, selectedIds],
  )
  // px real do texto selecionado (estilo dominante do container) — p/ edição em px
  const selectedTextPx = useMemo(() => {
    if (!activeSlide || !selectedBox || selectedBox.kind !== 'text') return undefined
    let px = 0
    for (const n of activeSlide.nodes) {
      if (n.type === 'glyphrun' && n.container === selectedBox.id) px = Math.max(px, n.style.size)
    }
    return px || undefined
  }, [activeSlide, selectedBox])

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* toolbar */}
      <header className="flex items-center justify-between gap-2 border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <Link href="/content">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="size-3.5" data-icon="inline-start" />
              Voltar
            </Button>
          </Link>
          <span className="text-sm font-medium text-muted-foreground">{content.slug}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{dirty || textDirty ? 'salvando…' : 'salvo'}</span>
          <RegenerateSlideButton contentId={content.id} position={activeIndex} total={scene?.slides.length ?? 0} />
          <Button variant="ghost" size="icon" onClick={undo} aria-label="Desfazer">
            <Undo2 className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={redo} aria-label="Refazer">
            <Redo2 className="size-4" />
          </Button>
          <Button size="sm" onClick={onApprove} disabled={!ready || exporting}>
            {exporting ? <Loader2 className="size-3.5 animate-spin" data-icon="inline-start" /> : <ImageDown className="size-3.5" data-icon="inline-start" />}
            {exporting ? `Exportando ${done}/${total}` : 'Aprovar'}
          </Button>
        </div>
      </header>

      {fontError && (
        <div className="border-b bg-destructive/10 px-4 py-1.5 text-xs text-destructive">
          Falha ao carregar fontes: {fontError}
        </div>
      )}

      {/* inserir + alinhar */}
      <StudioToolbar contentId={content.id} kit={brandKit} boxes={boxes} />

      <div className="flex min-h-0 flex-1">
        {/* thumbnails */}
        <aside className="hidden w-32 shrink-0 border-r lg:block">
          {scene && metrics && (
            <SlideThumbs scene={scene} metrics={metrics} activeIndex={activeIndex} onSelect={setActive} onReorder={canReorder ? reorderSlides : undefined} />
          )}
        </aside>

        {/* palco */}
        <main ref={wrapRef} className="flex min-w-0 flex-1 items-center justify-center bg-muted/30 p-4">
          {ready && metrics && activeSlide ? (
            <SlideStage slide={activeSlide} metrics={metrics} index={activeIndex} size={size} kit={brandKit} />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
              <span className="text-sm">Carregando engine e fontes…</span>
            </div>
          )}
        </main>

        {/* inspector */}
        <aside className="hidden w-60 shrink-0 overflow-y-auto border-l xl:block">
          <Inspector kit={brandKit} activeIndex={activeIndex} selectedBox={selectedBox} textPx={selectedTextPx} />
        </aside>
      </div>

      {/* pós-aprovação: publicar agora ou agendar */}
      <PublishDialog
        contentId={content.id}
        initialMode="schedule"
        open={publishOpen}
        onOpenChange={setPublishOpen}
      />
    </div>
  )
}

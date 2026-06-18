'use client'

/**
 * Designer free-form de templates custom (RFC fase 2). O usuário posiciona slots
 * (headline, imagem, subtítulo, bullets, CTA, label) num canvas 1080². O fundo é
 * o render real do engine (WYSIWYG); as caixas por cima são arrastáveis e
 * redimensionáveis. Salva como Template ('post' = 1 slide, 'carousel' = molde).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Loader2, Plus, Trash2, AlignLeft, AlignCenter, AlignRight, Check, X } from 'lucide-react'
import type { LayoutSlot, LayoutSpec, SlotType } from '@publisher/scene-engine'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LayoutPreview } from './layout-preview'
import { defaultLayoutSlots } from '../lib/default-layout'
import { useCreateTemplate, useUpdateTemplate } from '../hooks/use-custom-templates'
import type { CustomTemplate } from '../api/templates-api'

const CANVAS = 1080
const SLOT_META: Record<SlotType, { label: string; color: string }> = {
  headline: { label: 'Headline', color: '#C7634F' },
  subtitle: { label: 'Subtítulo', color: '#7C6CFF' },
  body: { label: 'Texto', color: '#2563EB' },
  bullets: { label: 'Bullets', color: '#059669' },
  image: { label: 'Imagem', color: '#D97706' },
  cta: { label: 'CTA', color: '#DC2626' },
  label: { label: 'Label', color: '#7C3AED' },
}
const SLOT_TYPES = Object.keys(SLOT_META) as SlotType[]

let uid = 0
const nextId = () => `s${Date.now().toString(36)}${uid++}`

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

interface TemplateDesignerProps {
  existing?: CustomTemplate
}

export function TemplateDesigner({ existing }: TemplateDesignerProps) {
  const router = useRouter()
  const create = useCreateTemplate()
  const update = useUpdateTemplate()
  const saving = create.isPending || update.isPending

  const [name, setName] = useState(existing?.name ?? 'Meu template')
  const [kind, setKind] = useState<'post' | 'carousel'>(existing?.kind ?? 'post')
  const [slots, setSlots] = useState<LayoutSlot[]>(existing?.layout.slots ?? defaultLayoutSlots())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [slideIndex, setSlideIndex] = useState(0)

  const wrapRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ id: string; mode: 'move' | 'resize'; startX: number; startY: number; frame: LayoutSlot['frame']; scale: number } | null>(null)
  const rafRef = useRef<number | null>(null)

  const spec = useMemo<LayoutSpec>(
    () => ({ kind, width: CANVAS, height: CANVAS, background: existing?.layout.background ?? 'bg', slots }),
    [kind, slots, existing],
  )
  const styleData = existing?.styleData ?? null

  const patchFrame = useCallback((id: string, frame: LayoutSlot['frame']) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, frame } : s)))
  }, [])

  // teclado: Delete/Backspace remove o slot selecionado (ignora se digitando)
  useEffect(() => {
    if (!selectedId) return
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return
      const el = document.activeElement as HTMLElement | null
      const tag = el?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el?.isContentEditable) return
      e.preventDefault()
      setSlots((prev) => prev.filter((s) => s.id !== selectedId))
      setSelectedId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId])

  const onPointerDown = (e: React.PointerEvent, id: string, mode: 'move' | 'resize') => {
    e.stopPropagation()
    const el = wrapRef.current
    const slot = slots.find((s) => s.id === id)
    if (!el || !slot) return
    setSelectedId(id)
    const scale = el.clientWidth / CANVAS
    dragRef.current = { id, mode, startX: e.clientX, startY: e.clientY, frame: { ...slot.frame }, scale }
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d) return
    const dx = (e.clientX - d.startX) / d.scale
    const dy = (e.clientY - d.startY) / d.scale
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      if (d.mode === 'move') {
        patchFrame(d.id, {
          ...d.frame,
          x: clamp(d.frame.x + dx, 0, CANVAS - d.frame.w),
          y: clamp(d.frame.y + dy, 0, CANVAS - d.frame.h),
        })
      } else {
        patchFrame(d.id, {
          ...d.frame,
          w: clamp(d.frame.w + dx, 80, CANVAS - d.frame.x),
          h: clamp(d.frame.h + dy, 40, CANVAS - d.frame.y),
        })
      }
    })
  }

  const onPointerUp = () => {
    dragRef.current = null
  }

  function addSlot(type: SlotType) {
    const slot: LayoutSlot = { id: nextId(), type, frame: { x: 120, y: 120, w: 700, h: type === 'image' ? 360 : 160 }, align: 'left' }
    setSlots((prev) => [...prev, slot])
    setSelectedId(slot.id)
  }
  function removeSlot(id: string) {
    setSlots((prev) => prev.filter((s) => s.id !== id))
    if (selectedId === id) setSelectedId(null)
  }
  function setSlotProp(id: string, patch: Partial<LayoutSlot>) {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  async function onSave() {
    if (!name.trim()) {
      toast.error('Dê um nome ao template.')
      return
    }
    const input = { name: name.trim(), kind, format: '1:1', layout: { ...spec, kind }, styleData }
    try {
      if (existing) await update.mutateAsync({ id: existing.id, input })
      else await create.mutateAsync(input)
      toast.success('Template salvo.')
      router.push('/templates')
    } catch {
      toast.error('Falha ao salvar o template.')
    }
  }

  const selected = slots.find((s) => s.id === selectedId) ?? null

  return (
    <div className="flex flex-col gap-4">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/templates')}>
            <ArrowLeft className="size-3.5" data-icon="inline-start" />
            Voltar
          </Button>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-56 rounded-md border border-input bg-background px-2 py-1.5 text-sm font-medium"
            placeholder="Nome do template"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-md border border-border text-sm">
            {(['post', 'carousel'] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => { setKind(k); setSlideIndex(0) }}
                className={cn('px-3 py-1.5', kind === k ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted')}
              >
                {k === 'post' ? 'Post único' : 'Carrossel'}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={onSave} disabled={saving}>
            {saving ? <Loader2 className="size-3.5 animate-spin" data-icon="inline-start" /> : <Check className="size-3.5" data-icon="inline-start" />}
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* canvas WYSIWYG */}
        <div className="flex flex-col items-center gap-3">
          <div
            ref={wrapRef}
            className="relative aspect-square w-full max-w-140 select-none overflow-hidden rounded-xl border border-border bg-muted/30 touch-none"
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onClick={() => setSelectedId(null)}
          >
            {/* fundo: render real do engine */}
            <LayoutPreview spec={spec} styleData={styleData} slideIndex={slideIndex} size={560} className="pointer-events-none absolute inset-0" />

            {/* caixas dos slots */}
            {slots.map((slot) => {
              const meta = SLOT_META[slot.type]
              const pct = (v: number) => `${(v / CANVAS) * 100}%`
              const isSel = slot.id === selectedId
              return (
                <div
                  key={slot.id}
                  onPointerDown={(e) => onPointerDown(e, slot.id, 'move')}
                  onClick={(e) => e.stopPropagation()}
                  className={cn('absolute cursor-move rounded-[3px] border', isSel ? 'border-2' : 'border-dashed')}
                  style={{
                    left: pct(slot.frame.x),
                    top: pct(slot.frame.y),
                    width: pct(slot.frame.w),
                    height: pct(slot.frame.h),
                    borderColor: meta.color,
                    background: `${meta.color}14`,
                  }}
                >
                  <span
                    className="pointer-events-none absolute -top-px left-0 rounded-br-[3px] rounded-tl-xs px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white"
                    style={{ background: meta.color }}
                  >
                    {meta.label}
                  </span>
                  {/* excluir slot (aparece quando selecionado) */}
                  {isSel && (
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => { e.stopPropagation(); removeSlot(slot.id) }}
                      className="absolute -right-2.5 -top-2.5 flex size-5 items-center justify-center rounded-full border border-white bg-destructive text-white shadow-sm"
                      aria-label="Excluir slot"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                  {/* handle de resize (SE) */}
                  <span
                    onPointerDown={(e) => onPointerDown(e, slot.id, 'resize')}
                    className="absolute -bottom-1 -right-1 size-3 cursor-se-resize rounded-full border border-white"
                    style={{ background: meta.color }}
                  />
                </div>
              )
            })}
          </div>

          {/* navegação de slides (carrossel): o molde é o mesmo; capa e corpo
              mostram a diferença (capa não tem imagem/bullets, corpo tem). */}
          {kind === 'carousel' && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Pré-visualizar:</span>
              {[['Capa', 0], ['Corpo', 1]].map(([lbl, i]) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => setSlideIndex(i as number)}
                  className={cn('rounded px-2 py-0.5', slideIndex === i ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}
                >
                  {lbl}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* painel lateral */}
        <div className="space-y-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium">Adicionar slot</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {SLOT_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => addSlot(t)}
                  className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-xs hover:bg-muted"
                >
                  <Plus className="size-3" style={{ color: SLOT_META[t].color }} />
                  {SLOT_META[t].label}
                </button>
              ))}
            </div>
          </div>

          {selected ? (
            <div className="space-y-3 rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: SLOT_META[selected.type].color }}>
                  {SLOT_META[selected.type].label}
                </span>
                <button type="button" onClick={() => removeSlot(selected.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="size-3.5" />
                </button>
              </div>

              <label className="block">
                <span className="mb-1 block text-[11px] text-muted-foreground">Tipo</span>
                <select
                  value={selected.type}
                  onChange={(e) => setSlotProp(selected.id, { type: e.target.value as SlotType })}
                  className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                >
                  {SLOT_TYPES.map((t) => (
                    <option key={t} value={t}>{SLOT_META[t].label}</option>
                  ))}
                </select>
              </label>

              <div>
                <span className="mb-1 block text-[11px] text-muted-foreground">Alinhamento</span>
                <div className="flex overflow-hidden rounded-md border border-border">
                  {([['left', AlignLeft], ['center', AlignCenter], ['right', AlignRight]] as const).map(([a, Icon]) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setSlotProp(selected.id, { align: a })}
                      className={cn('flex flex-1 items-center justify-center py-1.5', (selected.align ?? 'left') === a ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}
                    >
                      <Icon className="size-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
              Clique numa caixa pra editar. Arraste pra mover, use o ponto no canto pra redimensionar.
            </p>
          )}

          <p className="text-[11px] text-muted-foreground">
            {kind === 'post'
              ? 'Post único: o conteúdo gerado preenche os slots em 1 imagem.'
              : 'Carrossel: este molde se aplica a cada slide (capa, corpo, CTA). Slots sem conteúdo no slide somem.'}
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useCallback, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@/hooks/use-debounce'
import { updateContent } from '../../api/content-api'
import { CoverEditor } from './cover-editor'
import { SlideEditorCard } from './slide-editor-card'
import { CtaEditor } from './cta-editor'
import { CaptionEditor } from './caption-editor'
import { EditorActionsBar } from './editor-actions-bar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import type { Content, Slide } from '@/types/content'

interface EditorSplitLayoutProps {
  content: Content
}

export function EditorSplitLayout({ content }: EditorSplitLayoutProps) {
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    labelTopoCapa: content.labelTopoCapa,
    labelCapa: content.labelCapa,
    hookCapa: content.hookCapa,
    slides: content.slides,
    ctaLabelTopo: content.ctaLabelTopo,
    ctaLabel: content.ctaLabel,
    ctaText: content.ctaText,
    ctaSub: content.ctaSub,
    caption: content.caption,
  })

  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null)

  const debouncedData = useDebounce(formData, 30000)

  const saveMutation = useMutation({
    mutationFn: (data: Partial<Content>) => updateContent(content.id, data),
    onSuccess: () => {
      setLastSavedAt(format(new Date(), 'HH:mm'))
      queryClient.invalidateQueries({ queryKey: ['content', content.id] })
    },
  })

  useEffect(() => {
    if (debouncedData !== formData) return
    // Only auto-save if data actually changed from original
    const hasChanges =
      debouncedData.labelTopoCapa !== content.labelTopoCapa ||
      debouncedData.labelCapa !== content.labelCapa ||
      debouncedData.hookCapa !== content.hookCapa ||
      debouncedData.ctaLabelTopo !== content.ctaLabelTopo ||
      debouncedData.ctaLabel !== content.ctaLabel ||
      debouncedData.ctaText !== content.ctaText ||
      debouncedData.ctaSub !== content.ctaSub ||
      debouncedData.caption !== content.caption ||
      JSON.stringify(debouncedData.slides) !== JSON.stringify(content.slides)

    if (hasChanges) {
      saveMutation.mutate(debouncedData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedData])

  const updateCoverField = useCallback(
    (field: 'labelTopoCapa' | 'labelCapa' | 'hookCapa', value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const updateSlide = useCallback((updatedSlide: Slide) => {
    setFormData((prev) => ({
      ...prev,
      slides: prev.slides.map((s) => (s.id === updatedSlide.id ? updatedSlide : s)),
    }))
  }, [])

  const updateCtaField = useCallback(
    (field: 'ctaLabelTopo' | 'ctaLabel' | 'ctaText' | 'ctaSub', value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const updateCaption = useCallback((caption: string) => {
    setFormData((prev) => ({ ...prev, caption }))
  }, [])

  function handleSaveDraft() {
    saveMutation.mutate(formData)
  }

  function handleRender() {
    // Placeholder - trigger render job
  }

  function handleSchedule() {
    // Placeholder - open schedule dialog
  }

  function handlePublish() {
    // Placeholder - trigger publish
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Editor */}
        <div className="w-[55%] min-w-0 border-r">
          <ScrollArea className="h-full">
            <div className="space-y-4 p-4">
              <CoverEditor
                labelTopoCapa={formData.labelTopoCapa}
                labelCapa={formData.labelCapa}
                hookCapa={formData.hookCapa}
                onChange={updateCoverField}
              />

              {formData.slides.map((slide) => (
                <SlideEditorCard
                  key={slide.id}
                  slide={slide}
                  onChange={updateSlide}
                />
              ))}

              <CtaEditor
                ctaLabelTopo={formData.ctaLabelTopo}
                ctaLabel={formData.ctaLabel}
                ctaText={formData.ctaText}
                ctaSub={formData.ctaSub}
                onChange={updateCtaField}
              />

              <CaptionEditor
                caption={formData.caption}
                onChange={updateCaption}
              />
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-[45%] min-w-0">
          <ScrollArea className="h-full">
            <div className="sticky top-0 p-4">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Preview
                </h3>

                {/* Cover preview */}
                <div className="rounded-lg border bg-zinc-950 p-6 text-white">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-2">
                    {formData.labelTopoCapa}
                  </p>
                  <p className="text-lg font-bold leading-tight mb-3">
                    {formData.labelCapa}
                  </p>
                  <div
                    className="text-sm leading-relaxed text-zinc-300 [&>em]:italic [&>em]:text-white [&>.strong]:font-bold [&>.strong]:text-white"
                    dangerouslySetInnerHTML={{ __html: formData.hookCapa }}
                  />
                </div>

                <Separator />

                {/* Slides preview */}
                {formData.slides.map((slide) => (
                  <div key={slide.id} className="rounded-lg border bg-zinc-950 p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                        {slide.labelTopo}
                      </p>
                      {slide.tag && (
                        <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                          {slide.tag}
                        </span>
                      )}
                    </div>

                    {slide.paragraphs && slide.paragraphs.length > 0 && (
                      <div className="space-y-2">
                        {slide.paragraphs.map((p, i) => (
                          <p key={i} className="text-xs leading-relaxed text-zinc-300">{p}</p>
                        ))}
                      </div>
                    )}

                    {slide.list && slide.list.length > 0 && (
                      <ul className="space-y-1">
                        {slide.list.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                            <span className="mt-0.5 text-primary">&#8226;</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {slide.stats && slide.stats.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {slide.stats.map(([num, desc], i) => (
                          <div key={i} className="text-center">
                            <p className="text-lg font-bold text-white">{num}</p>
                            <p className="text-[10px] text-zinc-400">{desc}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {slide.cards && slide.cards.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {slide.cards.map((card, i) => (
                          <div
                            key={i}
                            className={`rounded-md border p-2 ${
                              card.highlight
                                ? 'border-primary/50 bg-primary/10'
                                : 'border-zinc-800 bg-zinc-900'
                            }`}
                          >
                            <p className="text-[10px] font-semibold uppercase text-zinc-400">{card.label}</p>
                            <p className="text-sm">{card.icon} {card.title}</p>
                            <p className="text-[10px] text-zinc-400">{card.body}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {slide.callout && (
                      <p className="rounded border-l-2 border-primary pl-3 text-xs italic text-zinc-300">
                        {slide.callout}
                      </p>
                    )}
                  </div>
                ))}

                <Separator />

                {/* CTA preview */}
                <div className="rounded-lg border bg-zinc-950 p-6 text-center text-white">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1">
                    {formData.ctaLabelTopo}
                  </p>
                  <p className="text-xs text-zinc-400 mb-3">{formData.ctaLabel}</p>
                  <div
                    className="text-sm font-medium [&>.keyword]:rounded [&>.keyword]:bg-primary/30 [&>.keyword]:px-1 [&>.keyword]:font-bold"
                    dangerouslySetInnerHTML={{ __html: formData.ctaText }}
                  />
                  <p className="mt-2 text-[10px] text-zinc-500">{formData.ctaSub}</p>
                </div>

                <Separator />

                {/* Caption preview */}
                {formData.caption && (
                  <div className="rounded-lg border p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Legenda</p>
                    <p className="whitespace-pre-wrap text-xs leading-relaxed text-foreground">
                      {formData.caption}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      <EditorActionsBar
        status={content.status}
        lastSavedAt={lastSavedAt}
        isSaving={saveMutation.isPending}
        onSaveDraft={handleSaveDraft}
        onRender={handleRender}
        onSchedule={handleSchedule}
        onPublish={handlePublish}
      />
    </div>
  )
}

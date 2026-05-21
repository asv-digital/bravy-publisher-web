'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useWizardStore } from './wizard-store'

export function StepPreview() {
  const generatedContent = useWizardStore((s) => s.generatedContent)
  const setGeneratedContent = useWizardStore((s) => s.setGeneratedContent)

  if (!generatedContent) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Preview</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Nenhum conteudo gerado ainda. Volte e gere o conteudo.
          </p>
        </div>
      </div>
    )
  }

  const handleCaptionChange = (value: string) => {
    setGeneratedContent({
      ...generatedContent,
      caption: value,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Preview do conteudo</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Revise e edite o conteudo gerado
        </p>
      </div>

      {/* Hook / Capa */}
      <Card>
        <CardHeader>
          <CardTitle>Capa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {generatedContent.labelTopoCapa && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Label topo
              </p>
              <p className="text-sm">{generatedContent.labelTopoCapa}</p>
            </div>
          )}
          {generatedContent.labelCapa && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Label
              </p>
              <p className="text-sm">{generatedContent.labelCapa}</p>
            </div>
          )}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Hook
            </p>
            <p className="text-base font-semibold">{generatedContent.hookCapa}</p>
          </div>
        </CardContent>
      </Card>

      {/* Slides */}
      {generatedContent.slides.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Slides</CardTitle>
              <Badge variant="secondary">
                {generatedContent.slides.length} slides
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedContent.slides.map((slide, index) => (
              <div key={slide.id}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="tabular-nums">
                      #{slide.position}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {slide.labelTopo}
                    </span>
                  </div>

                  {(slide.headlineTop || slide.headlineEm || slide.headlineBottom) && (
                    <p className="text-sm font-medium">
                      {[slide.headlineTop, slide.headlineEm, slide.headlineBottom]
                        .filter(Boolean)
                        .join(' ')}
                    </p>
                  )}

                  {slide.paragraphs && slide.paragraphs.length > 0 && (
                    <div className="text-sm text-muted-foreground space-y-1">
                      {slide.paragraphs.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  )}

                  {slide.list && slide.list.length > 0 && (
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
                      {slide.list.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {slide.cards && slide.cards.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {slide.cards.map((card, i) => (
                        <div
                          key={i}
                          className="rounded-lg border p-2 text-xs space-y-1"
                        >
                          <p className="font-medium">{card.title}</p>
                          <p className="text-muted-foreground">{card.body}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {slide.callout && (
                    <div className="rounded-lg bg-muted p-3 text-sm italic">
                      {slide.callout}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      {(generatedContent.ctaText || generatedContent.ctaSub) && (
        <Card>
          <CardHeader>
            <CardTitle>CTA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {generatedContent.ctaLabelTopo && (
              <p className="text-xs text-muted-foreground">
                {generatedContent.ctaLabelTopo}
              </p>
            )}
            {generatedContent.ctaLabel && (
              <p className="text-sm font-medium">{generatedContent.ctaLabel}</p>
            )}
            {generatedContent.ctaText && (
              <p className="text-base font-semibold">{generatedContent.ctaText}</p>
            )}
            {generatedContent.ctaSub && (
              <p className="text-sm text-muted-foreground">
                {generatedContent.ctaSub}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Caption */}
      <Card>
        <CardHeader>
          <CardTitle>Caption</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="caption-input">Texto da legenda (editavel)</Label>
          <Textarea
            id="caption-input"
            value={generatedContent.caption}
            onChange={(e) => handleCaptionChange(e.target.value)}
            className="min-h-40 resize-y"
          />
        </CardContent>
      </Card>
    </div>
  )
}

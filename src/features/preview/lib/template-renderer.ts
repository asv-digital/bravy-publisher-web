import type { Content, Slide } from '@/types/content'
import { getAccentColor } from './persona-palette'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderRichText(html: string): string {
  // Content already contains safe HTML tags like <em>, <span class="strong">, <span class="keyword">
  return html
}

function renderCoverSlide(content: Content, accent: string): string {
  return `
    <div class="slide slide-cover">
      <div class="topbar">
        <span class="topbar-label">${renderRichText(content.labelTopoCapa)}</span>
        <span class="topbar-asterisk">*</span>
      </div>
      <div class="cover-body">
        <div class="cover-tag">${renderRichText(content.labelCapa)}</div>
        <h1 class="cover-headline">${renderRichText(content.hookCapa)}</h1>
      </div>
      <div class="cover-footer">
        <span class="footer-tag">${escapeHtml(content.persona)}</span>
        <span class="footer-divider">/</span>
        <span class="footer-tag">${escapeHtml(content.templateSlug)}</span>
        <span class="footer-divider">/</span>
        <span class="footer-tag">padrao ${escapeHtml(content.pattern)}</span>
      </div>
    </div>`
}

function renderContentSlide(slide: Slide, index: number): string {
  let bodyHtml = ''

  if (slide.paragraphs && slide.paragraphs.length > 0) {
    bodyHtml = slide.paragraphs
      .map((p) => `<p class="slide-paragraph">${renderRichText(p)}</p>`)
      .join('\n        ')
  }

  if (slide.list && slide.list.length > 0) {
    const items = slide.list
      .map((item, i) => `<li class="slide-list-item"><span class="list-number">${String(i + 1).padStart(2, '0')}</span><span>${renderRichText(item)}</span></li>`)
      .join('\n          ')
    bodyHtml += `\n        <ul class="slide-list">${items}</ul>`
  }

  if (slide.stats && slide.stats.length > 0) {
    const statItems = slide.stats
      .map(([value, label]) => `
        <div class="stat-item">
          <span class="stat-value">${renderRichText(value)}</span>
          <span class="stat-label">${renderRichText(label)}</span>
        </div>`)
      .join('')
    bodyHtml += `\n        <div class="stats-grid">${statItems}\n        </div>`
  }

  if (slide.cards && slide.cards.length > 0) {
    const cardItems = slide.cards
      .map((card) => `
        <div class="content-card${card.highlight ? ' content-card--highlight' : ''}">
          <div class="card-label">${escapeHtml(card.label)}</div>
          ${card.icon ? `<div class="card-icon">${card.icon}</div>` : ''}
          <div class="card-title">${renderRichText(card.title)}</div>
          <div class="card-body">${renderRichText(card.body)}</div>
        </div>`)
      .join('')
    bodyHtml += `\n        <div class="cards-grid">${cardItems}\n        </div>`
  }

  if (slide.callout) {
    bodyHtml += `\n        <div class="slide-callout">${renderRichText(slide.callout)}</div>`
  }

  return `
    <div class="slide slide-content">
      <div class="bg-number">${String(index + 2).padStart(2, '0')}</div>
      <div class="slide-kicker">
        <span class="kicker-label">${renderRichText(slide.labelTopo)}</span>
      </div>
      ${slide.tag ? `<div class="slide-tag">${renderRichText(slide.tag)}</div>` : ''}
      <div class="slide-body">
        ${bodyHtml}
      </div>
    </div>`
}

function renderCtaSlide(content: Content): string {
  return `
    <div class="slide slide-cta">
      <div class="cta-kicker">${renderRichText(content.ctaLabelTopo)}</div>
      <div class="cta-body">
        <div class="cta-pill">${renderRichText(content.ctaLabel)}</div>
        <div class="cta-text">${renderRichText(content.ctaText)}</div>
        <div class="cta-sub">${renderRichText(content.ctaSub)}</div>
      </div>
    </div>`
}

export function renderContent(content: Content): string {
  const accent = getAccentColor(content.persona)
  const slides = content.slides || []
  const totalSlides = slides.length + 2 // cover + content slides + CTA

  const coverHtml = renderCoverSlide(content, accent)
  const contentSlidesHtml = slides
    .map((slide, i) => renderContentSlide(slide, i))
    .join('')
  const ctaHtml = renderCtaSlide(content)

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=1080">
<style>
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap');

:root {
  --cream: #F5F2EE;
  --ink: #141413;
  --accent: ${accent};
  --muted: #6B6B68;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: var(--cream);
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

.gallery {
  display: flex;
  width: ${totalSlides * 1080}px;
}

.slide {
  width: 1080px;
  height: 1080px;
  position: relative;
  padding: 60px;
  display: flex;
  flex-direction: column;
  background: var(--cream);
  overflow: hidden;
  flex-shrink: 0;
}

/* ============ COVER SLIDE ============ */
.slide-cover {
  justify-content: space-between;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1.5px solid var(--ink);
}

.topbar-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink);
}

.topbar-asterisk {
  font-family: 'DM Serif Display', serif;
  font-size: 36px;
  color: var(--accent);
  line-height: 1;
}

.cover-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
  padding: 40px 0;
}

.cover-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--accent);
  text-transform: lowercase;
}

.cover-headline {
  font-family: 'Source Serif 4', serif;
  font-size: 58px;
  font-weight: 700;
  line-height: 1.12;
  color: var(--ink);
  max-width: 900px;
}

.cover-headline em {
  font-style: italic;
  color: var(--accent);
}

.cover-headline .strong {
  font-weight: 700;
}

.cover-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid rgba(20, 20, 19, 0.15);
}

.footer-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.05em;
  text-transform: lowercase;
  color: var(--muted);
}

.footer-divider {
  color: rgba(20, 20, 19, 0.2);
  font-size: 12px;
}

/* ============ CONTENT SLIDES ============ */
.slide-content {
  justify-content: flex-start;
  gap: 0;
}

.bg-number {
  position: absolute;
  top: -30px;
  right: 30px;
  font-family: 'Source Serif 4', serif;
  font-size: 320px;
  font-weight: 700;
  color: rgba(20, 20, 19, 0.04);
  line-height: 1;
  pointer-events: none;
  user-select: none;
}

.slide-kicker {
  margin-bottom: 16px;
}

.kicker-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: lowercase;
  color: var(--accent);
}

.slide-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--muted);
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(20, 20, 19, 0.1);
}

.slide-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
}

.slide-paragraph {
  font-family: 'Source Serif 4', serif;
  font-size: 30px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--ink);
}

.slide-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.slide-list-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  font-family: 'Source Serif 4', serif;
  font-size: 28px;
  line-height: 1.4;
  color: var(--ink);
}

.list-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  color: var(--accent);
  min-width: 28px;
  padding-top: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-top: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 28px;
  border: 1px solid rgba(20, 20, 19, 0.1);
  border-radius: 12px;
}

.stat-value {
  font-family: 'DM Serif Display', serif;
  font-size: 48px;
  font-weight: 400;
  color: var(--accent);
  line-height: 1.1;
}

.stat-label {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: var(--muted);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 8px;
}

.content-card {
  padding: 32px;
  border: 1px solid rgba(20, 20, 19, 0.1);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(20, 20, 19, 0.02);
}

.content-card--highlight {
  background: var(--accent);
  border-color: var(--accent);
}

.content-card--highlight .card-label,
.content-card--highlight .card-title,
.content-card--highlight .card-body {
  color: #fff;
}

.card-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
}

.card-icon {
  font-size: 32px;
  line-height: 1;
}

.card-title {
  font-family: 'DM Serif Display', serif;
  font-size: 36px;
  color: var(--ink);
  line-height: 1.1;
}

.card-body {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: var(--muted);
  line-height: 1.5;
}

.slide-callout {
  font-family: 'Source Serif 4', serif;
  font-size: 26px;
  font-style: italic;
  color: var(--accent);
  padding: 24px 28px;
  border-left: 3px solid var(--accent);
  background: rgba(20, 20, 19, 0.02);
  border-radius: 0 12px 12px 0;
  line-height: 1.5;
}

/* ============ CTA SLIDE ============ */
.slide-cta {
  background: var(--accent);
  justify-content: space-between;
  color: #fff;
}

.cta-kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: lowercase;
  color: rgba(255, 255, 255, 0.7);
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.cta-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 28px;
}

.cta-pill {
  display: inline-block;
  align-self: flex-start;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: lowercase;
  padding: 8px 20px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 100px;
  color: #fff;
}

.cta-text {
  font-family: 'Source Serif 4', serif;
  font-size: 48px;
  font-weight: 600;
  line-height: 1.15;
  color: #fff;
  max-width: 800px;
}

.cta-text .keyword {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 12px;
  border-radius: 6px;
}

.cta-sub {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.65);
}
</style>
</head>
<body>
<div class="gallery">
  ${coverHtml}
  ${contentSlidesHtml}
  ${ctaHtml}
</div>
</body>
</html>`
}

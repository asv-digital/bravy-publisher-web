'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/layout/empty-state'
import { PERSONAS, PATTERNS } from '@/lib/constants'
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import { ContentStatusBadge } from './content-status-badge'
import { ContentRowActions } from './content-row-actions'
import { ContentBulkActions } from './content-bulk-actions'
import { ContentFilters } from './content-filters'
import { useContents } from '../hooks/use-contents'
import type { ContentFilterParams } from '../types/content-filters'
import type { Content } from '@/types/content'

const PAGE_SIZE = 10

function formatSlug(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function getPersonaLabel(persona: string): string {
  return PERSONAS.find((p) => p.value === persona)?.label ?? persona
}

function getPatternLabel(pattern: string): string {
  const found = PATTERNS.find((p) => p.value === pattern)
  return found ? `${found.value} - ${found.label}` : pattern
}

export function ContentTable() {
  const router = useRouter()
  const [filters, setFilters] = useState<ContentFilterParams>({
    page: 1,
    pageSize: PAGE_SIZE,
  })
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const { data, isLoading } = useContents(filters)

  const contents = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1
  const currentPage = filters.page ?? 1

  const startItem = (currentPage - 1) * PAGE_SIZE + 1
  const endItem = Math.min(currentPage * PAGE_SIZE, total)

  const allSelected = contents.length > 0 && contents.every((c) => selectedIds.includes(c.id))
  const someSelected = contents.some((c) => selectedIds.includes(c.id))

  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !contents.some((c) => c.id === id)))
    } else {
      setSelectedIds((prev) => {
        const newIds = contents.map((c) => c.id).filter((id) => !prev.includes(id))
        return [...prev, ...newIds]
      })
    }
  }, [allSelected, contents])

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }, [])

  function goToPage(page: number) {
    setFilters((prev) => ({ ...prev, page }))
  }

  function handleRowClick(content: Content) {
    router.push(`/content/${content.id}`)
  }

  const headerClasses = 'bg-gray-50/80 text-xs font-medium uppercase tracking-wider text-gray-500 dark:bg-gray-800/50 dark:text-gray-400'

  if (isLoading) {
    return (
      <div>
        <ContentFilters filters={filters} onFiltersChange={setFilters} />
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 hover:bg-transparent dark:border-gray-800">
                <TableHead className={`${headerClasses} w-[44px]`} />
                <TableHead className={headerClasses}>Titulo</TableHead>
                <TableHead className={headerClasses}>Status</TableHead>
                <TableHead className={headerClasses}>Persona</TableHead>
                <TableHead className={headerClasses}>Padrao</TableHead>
                <TableHead className={headerClasses}>Tipo</TableHead>
                <TableHead className={headerClasses}>Criado em</TableHead>
                <TableHead className={`${headerClasses} w-[44px]`} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-b border-gray-100 hover:bg-transparent dark:border-gray-800">
                  <TableCell><Skeleton className="h-4 w-4 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[200px] rounded" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[80px] rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px] rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[120px] rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px] rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px] rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-4 rounded" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (!isLoading && contents.length === 0) {
    return (
      <div>
        <ContentFilters filters={filters} onFiltersChange={setFilters} />
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <EmptyState
            icon={FileText}
            title="Nenhum conteudo encontrado"
            description="Crie seu primeiro conteudo para comecar a publicar nas redes sociais."
            action={
              <Button onClick={() => router.push('/content/new')}>
                Novo conteudo
              </Button>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <ContentFilters filters={filters} onFiltersChange={setFilters} />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 hover:bg-transparent dark:border-gray-800">
              <TableHead className={`${headerClasses} w-[44px]`}>
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className={headerClasses}>Titulo</TableHead>
              <TableHead className={headerClasses}>Status</TableHead>
              <TableHead className={headerClasses}>Persona</TableHead>
              <TableHead className={headerClasses}>Padrao</TableHead>
              <TableHead className={headerClasses}>Tipo</TableHead>
              <TableHead className={headerClasses}>Criado em</TableHead>
              <TableHead className={headerClasses}>Publicacao</TableHead>
              <TableHead className={`${headerClasses} w-[44px]`} />
            </TableRow>
          </TableHeader>
          <TableBody>
            {contents.map((content) => (
              <TableRow
                key={content.id}
                className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-gray-800/30"
                onClick={() => handleRowClick(content)}
                data-state={selectedIds.includes(content.id) ? 'selected' : undefined}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.includes(content.id)}
                    onCheckedChange={() => toggleSelect(content.id)}
                  />
                </TableCell>
                <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                  {formatSlug(content.slug)}
                </TableCell>
                <TableCell>
                  <ContentStatusBadge status={content.status} />
                </TableCell>
                <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                  {getPersonaLabel(content.persona)}
                </TableCell>
                <TableCell className="text-sm text-gray-500 dark:text-gray-500">
                  {getPatternLabel(content.pattern)}
                </TableCell>
                <TableCell className="text-sm text-gray-500 dark:text-gray-500">
                  {content.contentType}
                </TableCell>
                <TableCell className="text-sm text-gray-500 tabular-nums dark:text-gray-500">
                  {format(new Date(content.createdAt), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  {(() => {
                    const date = content.publishedAt || content.scheduledAt
                    if (!date) return <span className="text-gray-300 dark:text-gray-600">--</span>
                    const d = new Date(date)
                    const isFuture = d > new Date()
                    return (
                      <span
                        className={
                          isFuture
                            ? 'text-sm font-medium tabular-nums text-purple-600 dark:text-purple-400'
                            : 'text-sm font-medium tabular-nums text-emerald-600 dark:text-emerald-400'
                        }
                      >
                        {format(d, 'dd/MM/yyyy')}
                      </span>
                    )
                  })()}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <ContentRowActions contentId={content.id} contentSlug={content.slug} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-gray-800">
          <p className="text-sm text-gray-500 tabular-nums dark:text-gray-400">
            Mostrando <span className="font-medium text-gray-700 dark:text-gray-300">{startItem}</span>
            {' '}-{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300">{endItem}</span>
            {' '}de{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300">{total}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 rounded-lg border-gray-200 px-2.5 text-sm text-gray-600 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="mr-0.5 h-3.5 w-3.5" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 rounded-lg border-gray-200 px-2.5 text-sm text-gray-600 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Proximo
              <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <ContentBulkActions
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
      />
    </div>
  )
}

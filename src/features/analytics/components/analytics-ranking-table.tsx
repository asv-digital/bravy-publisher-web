'use client'

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRanking } from '../hooks/use-ranking'
import { PERSONA_COLORS } from '@/lib/constants'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

function formatNumber(num: number): string {
  return num.toLocaleString('pt-BR')
}

interface AnalyticsRankingTableProps {
  period: '30d' | '60d' | '90d'
}

export function AnalyticsRankingTable({ period }: AnalyticsRankingTableProps) {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useRanking(page, period)

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ranking de posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ranking de posts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Post</TableHead>
              <TableHead className="text-right">Curtidas</TableHead>
              <TableHead className="text-right">Comentarios</TableHead>
              <TableHead className="text-right">Alcance</TableHead>
              <TableHead className="text-right">Engajamento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((item, index) => {
              const colors = PERSONA_COLORS[item.persona]
              const position = (page - 1) * data.pageSize + index + 1

              return (
                <TableRow key={item.contentId}>
                  <TableCell className="font-medium text-muted-foreground">
                    {position}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate max-w-[200px]">
                        {item.slug}
                      </span>
                      <span
                        className={cn(
                          'inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium',
                        )}
                        style={{
                          backgroundColor: colors.soft,
                          color: colors.accent,
                        }}
                      >
                        {item.persona}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(item.analytics.likes)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(item.analytics.comments)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(item.analytics.reach)}
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums text-emerald-600">
                    {item.analytics.engagementRate.toFixed(1)}%
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {data.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-muted-foreground">
              Pagina {data.page} de {data.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page >= data.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

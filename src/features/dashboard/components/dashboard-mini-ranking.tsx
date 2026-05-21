'use client'

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, CardAction } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboard } from '../hooks/use-dashboard'
import { PERSONA_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Trophy, ArrowRight } from 'lucide-react'

export function DashboardMiniRanking() {
  const { data, isLoading } = useDashboard()

  if (isLoading || !data) {
    return (
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-900">
            Top Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0 divide-y divide-gray-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
          <Trophy className="h-4 w-4 text-orange-500" />
          Top Posts
        </CardTitle>
        <CardAction>
          <Link
            href="/analytics"
            className="flex items-center gap-1 text-xs font-medium text-gray-400 transition-colors hover:text-gray-600"
          >
            Ver todos
            <ArrowRight className="h-3 w-3" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-gray-100">
          {data.topPosts.slice(0, 5).map((post, index) => {
            const colors = PERSONA_COLORS[post.persona]
            const isTopThree = index < 3
            const truncatedSlug =
              post.slug.length > 25
                ? post.slug.slice(0, 25) + '...'
                : post.slug

            return (
              <Link
                key={post.contentId}
                href={`/content/${post.contentId}`}
                className="flex items-center gap-3 py-3 transition-colors hover:bg-gray-50 first:pt-0 last:pb-0 -mx-4 px-4"
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                    isTopThree
                      ? 'bg-orange-50 text-orange-600'
                      : 'bg-gray-50 text-gray-400',
                  )}
                >
                  {index + 1}
                </span>
                <span className="flex-1 truncate text-sm font-medium text-gray-700">
                  {truncatedSlug}
                </span>
                <span
                  className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    backgroundColor: colors.soft,
                    color: colors.accent,
                  }}
                >
                  {post.persona}
                </span>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-emerald-600">
                  {post.analytics.engagementRate.toFixed(1)}%
                </span>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

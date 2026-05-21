'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboard } from '../hooks/use-dashboard'
import {
  UserPlus,
  UserMinus,
  TrendingUp,
  Heart,
  MessageCircle,
  Bookmark,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace('.', ',') + 'M'
  }
  if (num >= 1_000) {
    return num.toLocaleString('pt-BR')
  }
  return num.toString()
}

interface KpiCardProps {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: string
  trend: number
  trendLabel: string
}

function KpiCard({ icon, iconBg, label, value, trend, trendLabel }: KpiCardProps) {
  const isPositive = trend >= 0
  const isNeutral = trend === 0

  return (
    <Card className="shadow-none">
      <CardContent className="pt-0">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              iconBg,
            )}
          >
            {icon}
          </div>
          {!isNeutral && (
            <div
              className={cn(
                'flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium',
                isPositive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-700',
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(trend).toFixed(1)}%
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>
        <p className="mt-2 text-xs text-gray-400">{trendLabel}</p>
      </CardContent>
    </Card>
  )
}

function KpiCardSkeleton() {
  return (
    <Card className="shadow-none">
      <CardContent className="pt-0">
        <div className="flex items-start justify-between">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-2 h-7 w-28" />
        </div>
        <Skeleton className="mt-2 h-3 w-32" />
      </CardContent>
    </Card>
  )
}

export function DashboardSummaryCards() {
  const { data, isLoading } = useDashboard()

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <KpiCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const prevFollowers = 980
  const prevUnfollowers = 180
  const prevEngagement = 5.8
  const prevLikes = 32100
  const prevComments = 10800
  const prevSaves = 5778

  const cards: KpiCardProps[] = [
    {
      icon: <UserPlus className="h-5 w-5 text-emerald-600" />,
      iconBg: 'bg-emerald-50',
      label: 'Novos seguidores',
      value: formatNumber(data.totalFollowersGained),
      trend: ((data.totalFollowersGained - prevFollowers) / prevFollowers) * 100,
      trendLabel: 'vs. periodo anterior',
    },
    {
      icon: <UserMinus className="h-5 w-5 text-red-600" />,
      iconBg: 'bg-red-50',
      label: 'Deixaram de seguir',
      value: formatNumber(data.totalUnfollowers),
      trend: -((data.totalUnfollowers - prevUnfollowers) / prevUnfollowers) * 100,
      trendLabel: 'vs. periodo anterior',
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-orange-600" />,
      iconBg: 'bg-orange-50',
      label: 'Taxa de engajamento',
      value: data.avgEngagementRate.toFixed(2) + '%',
      trend: ((data.avgEngagementRate - prevEngagement) / prevEngagement) * 100,
      trendLabel: 'vs. periodo anterior',
    },
    {
      icon: <Heart className="h-5 w-5 text-pink-600" />,
      iconBg: 'bg-pink-50',
      label: 'Curtidas',
      value: formatNumber(data.totalLikes),
      trend: ((data.totalLikes - prevLikes) / prevLikes) * 100,
      trendLabel: 'vs. periodo anterior',
    },
    {
      icon: <MessageCircle className="h-5 w-5 text-blue-600" />,
      iconBg: 'bg-blue-50',
      label: 'Comentarios',
      value: formatNumber(data.totalComments),
      trend: ((data.totalComments - prevComments) / prevComments) * 100,
      trendLabel: 'vs. periodo anterior',
    },
    {
      icon: <Bookmark className="h-5 w-5 text-purple-600" />,
      iconBg: 'bg-purple-50',
      label: 'Salvamentos',
      value: formatNumber(data.totalSaves),
      trend: ((data.totalSaves - prevSaves) / prevSaves) * 100,
      trendLabel: 'vs. periodo anterior',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {cards.map((card) => (
        <KpiCard key={card.label} {...card} />
      ))}
    </div>
  )
}

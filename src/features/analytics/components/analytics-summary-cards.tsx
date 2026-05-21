'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAnalytics } from '../hooks/use-analytics'
import {
  UserPlus,
  UserMinus,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Eye,
  TrendingUp,
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

interface MetricCardProps {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: string
  trend: number
}

function MetricCard({ icon, iconBg, label, value, trend }: MetricCardProps) {
  const isPositive = trend >= 0

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
        </div>
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </p>
        </div>
        <p className="mt-2 text-xs text-gray-400">vs. periodo anterior</p>
      </CardContent>
    </Card>
  )
}

function MetricCardSkeleton() {
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

interface AnalyticsSummaryCardsProps {
  period: '30d' | '60d' | '90d'
}

export function AnalyticsSummaryCards({ period }: AnalyticsSummaryCardsProps) {
  const { data, isLoading } = useAnalytics(period)

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const prev = data.previousPeriod

  const metrics: MetricCardProps[] = [
    {
      icon: <UserPlus className="h-5 w-5 text-emerald-600" />,
      iconBg: 'bg-emerald-50',
      label: 'Seguidores ganhos',
      value: formatNumber(data.totalFollowersGained),
      trend: ((data.totalFollowersGained - prev.totalFollowersGained) / prev.totalFollowersGained) * 100,
    },
    {
      icon: <UserMinus className="h-5 w-5 text-red-600" />,
      iconBg: 'bg-red-50',
      label: 'Perdidos',
      value: formatNumber(data.totalUnfollowers),
      trend: -((data.totalUnfollowers - prev.totalUnfollowers) / prev.totalUnfollowers) * 100,
    },
    {
      icon: <Heart className="h-5 w-5 text-pink-600" />,
      iconBg: 'bg-pink-50',
      label: 'Curtidas',
      value: formatNumber(data.totalLikes),
      trend: ((data.totalLikes - prev.totalLikes) / prev.totalLikes) * 100,
    },
    {
      icon: <MessageCircle className="h-5 w-5 text-blue-600" />,
      iconBg: 'bg-blue-50',
      label: 'Comentarios',
      value: formatNumber(data.totalComments),
      trend: ((data.totalComments - prev.totalComments) / prev.totalComments) * 100,
    },
    {
      icon: <Share2 className="h-5 w-5 text-indigo-600" />,
      iconBg: 'bg-indigo-50',
      label: 'Compartilhamentos',
      value: formatNumber(data.totalShares),
      trend: ((data.totalShares - prev.totalShares) / prev.totalShares) * 100,
    },
    {
      icon: <Bookmark className="h-5 w-5 text-purple-600" />,
      iconBg: 'bg-purple-50',
      label: 'Salvamentos',
      value: formatNumber(data.totalSaves),
      trend: ((data.totalSaves - prev.totalSaves) / prev.totalSaves) * 100,
    },
    {
      icon: <Eye className="h-5 w-5 text-cyan-600" />,
      iconBg: 'bg-cyan-50',
      label: 'Alcance total',
      value: formatNumber(data.totalReach),
      trend: ((data.totalReach - prev.totalReach) / prev.totalReach) * 100,
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-orange-600" />,
      iconBg: 'bg-orange-50',
      label: 'Engajamento medio',
      value: data.avgEngagementRate.toFixed(2) + '%',
      trend: ((data.avgEngagementRate - prev.avgEngagementRate) / prev.avgEngagementRate) * 100,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </div>
  )
}

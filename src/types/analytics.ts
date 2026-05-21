import type { Persona, Pattern } from './content'

export interface AnalyticsData {
  likes: number
  comments: number
  shares: number
  saves: number
  reach: number
  impressions: number
  engagementRate: number
}

export interface DailyMetric {
  date: string
  engagement: number
  reach: number
  impressions: number
  likes: number
  comments: number
  newFollowers: number
  unfollowers: number
  postsByDay: number
}

export interface ContentTypeBreakdown {
  type: string
  count: number
  engagement: number
}

export interface AnalyticsSummary {
  totalPosts: number
  avgEngagementRate: number
  totalReach: number
  totalImpressions: number
  totalLikes: number
  totalComments: number
  totalShares: number
  totalSaves: number
  totalFollowersGained: number
  totalUnfollowers: number
  period: '30d' | '60d' | '90d'
  dailyData: DailyMetric[]
  contentTypeBreakdown: ContentTypeBreakdown[]
  postsPerDay: { date: string; count: number }[]
  previousPeriod: {
    avgEngagementRate: number
    totalReach: number
    totalImpressions: number
    totalLikes: number
    totalComments: number
    totalShares: number
    totalSaves: number
    totalFollowersGained: number
    totalUnfollowers: number
  }
}

export interface RankingItem {
  contentId: string
  slug: string
  persona: Persona
  pattern: Pattern
  publishedAt: string
  analytics: AnalyticsData
  thumbnailUrl?: string
}

export interface BreakdownItem {
  label: string
  value: number
  count: number
}

export interface DashboardSummary {
  totalPublished: number
  avgEngagement: number
  totalReach: number
  scheduledCount: number
  totalFollowersGained: number
  totalUnfollowers: number
  totalLikes: number
  totalComments: number
  totalShares: number
  totalSaves: number
  avgEngagementRate: number
  contentTypeBreakdown: ContentTypeBreakdown[]
  postsPerDay: { date: string; count: number }[]
  dailyEngagement: DailyMetric[]
  topPosts: RankingItem[]
  recentPublished: { id: string; slug: string; publishedAt: string; engagement: number }[]
  upcoming: { id: string; slug: string; scheduledAt: string; persona: Persona }[]
}

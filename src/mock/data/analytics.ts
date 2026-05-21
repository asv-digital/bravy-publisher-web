import type { AnalyticsSummary, RankingItem, DashboardSummary, DailyMetric, ContentTypeBreakdown } from '@/types/analytics'

function generateDailyData(days: number): DailyMetric[] {
  const data: DailyMetric[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      engagement: Math.round((2 + Math.random() * 8) * 100) / 100,
      reach: Math.floor(500 + Math.random() * 4500),
      impressions: Math.floor(1000 + Math.random() * 9000),
      likes: Math.floor(50 + Math.random() * 450),
      comments: Math.floor(10 + Math.random() * 200),
      newFollowers: Math.floor(10 + Math.random() * 70),
      unfollowers: Math.floor(1 + Math.random() * 14),
      postsByDay: Math.floor(Math.random() * 4),
    })
  }
  return data
}

function generatePostsPerDay(days: number): { date: string; count: number }[] {
  const data: { date: string; count: number }[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      count: Math.floor(Math.random() * 4),
    })
  }
  return data
}

function generateContentTypeBreakdown(totalPosts: number): ContentTypeBreakdown[] {
  const carouselCount = Math.round(totalPosts * 0.6)
  const postCount = Math.round(totalPosts * 0.25)
  const reelCount = totalPosts - carouselCount - postCount

  return [
    { type: 'Carrossel', count: carouselCount, engagement: Math.round((5 + Math.random() * 5) * 100) / 100 },
    { type: 'Post', count: postCount, engagement: Math.round((3 + Math.random() * 4) * 100) / 100 },
    { type: 'Reel', count: reelCount, engagement: Math.round((6 + Math.random() * 6) * 100) / 100 },
  ]
}

const dailyData30 = generateDailyData(30)

export const mockAnalyticsSummary: AnalyticsSummary = {
  totalPosts: 83,
  avgEngagementRate: 6.42,
  totalReach: 284000,
  totalImpressions: 512000,
  totalLikes: 38400,
  totalComments: 12600,
  totalShares: 4608,
  totalSaves: 6912,
  totalFollowersGained: dailyData30.reduce((sum, d) => sum + d.newFollowers, 0),
  totalUnfollowers: dailyData30.reduce((sum, d) => sum + d.unfollowers, 0),
  period: '30d',
  dailyData: dailyData30,
  contentTypeBreakdown: generateContentTypeBreakdown(83),
  postsPerDay: generatePostsPerDay(30),
  previousPeriod: {
    avgEngagementRate: 5.8,
    totalReach: 245000,
    totalImpressions: 468000,
    totalLikes: 32100,
    totalComments: 10800,
    totalShares: 3852,
    totalSaves: 5778,
    totalFollowersGained: 980,
    totalUnfollowers: 180,
  },
}

export const mockRanking: RankingItem[] = [
  { contentId: 'cnt_01', slug: '101-recuperacao-tributaria-dominio', persona: 'contador', pattern: 'A', publishedAt: '2026-05-02T20:55:00Z', analytics: { likes: 4640, comments: 3991, shares: 412, saves: 890, reach: 45000, impressions: 78000, engagementRate: 11.2 } },
  { contentId: 'cnt_02', slug: '102-prescricao-trabalhista-claude', persona: 'advogado', pattern: 'C', publishedAt: '2026-05-04T20:00:00Z', analytics: { likes: 3200, comments: 2100, shares: 380, saves: 720, reach: 38000, impressions: 62000, engagementRate: 9.8 } },
  { contentId: 'cnt_r3', slug: '045-sped-reinf-automatico', persona: 'contador', pattern: 'A', publishedAt: '2026-04-15T20:00:00Z', analytics: { likes: 2800, comments: 1950, shares: 290, saves: 650, reach: 32000, impressions: 55000, engagementRate: 8.9 } },
  { contentId: 'cnt_r4', slug: '038-contrato-analise-ia', persona: 'advogado', pattern: 'F', publishedAt: '2026-04-10T20:00:00Z', analytics: { likes: 2400, comments: 1800, shares: 250, saves: 580, reach: 28000, impressions: 48000, engagementRate: 8.2 } },
  { contentId: 'cnt_r5', slug: '062-dctfweb-conferencia', persona: 'contador', pattern: 'C', publishedAt: '2026-04-20T20:00:00Z', analytics: { likes: 2100, comments: 1600, shares: 210, saves: 520, reach: 25000, impressions: 42000, engagementRate: 7.6 } },
  { contentId: 'cnt_r6', slug: '071-gestao-processos-advogado', persona: 'advogado', pattern: 'B', publishedAt: '2026-04-25T20:00:00Z', analytics: { likes: 1900, comments: 1400, shares: 190, saves: 480, reach: 22000, impressions: 38000, engagementRate: 7.1 } },
  { contentId: 'cnt_r7', slug: '055-balancete-mensal-auto', persona: 'contador', pattern: 'A', publishedAt: '2026-04-18T20:00:00Z', analytics: { likes: 1700, comments: 1200, shares: 170, saves: 420, reach: 20000, impressions: 34000, engagementRate: 6.8 } },
  { contentId: 'cnt_r8', slug: '080-audiencia-prep-ia', persona: 'advogado', pattern: 'D', publishedAt: '2026-04-28T20:00:00Z', analytics: { likes: 1500, comments: 1100, shares: 150, saves: 380, reach: 18000, impressions: 30000, engagementRate: 6.3 } },
  { contentId: 'cnt_r9', slug: '048-per-dcomp-automatizado', persona: 'contador', pattern: 'E', publishedAt: '2026-04-16T20:00:00Z', analytics: { likes: 1300, comments: 950, shares: 130, saves: 340, reach: 16000, impressions: 27000, engagementRate: 5.9 } },
  { contentId: 'cnt_r10', slug: '090-proposta-comercial-ia', persona: 'empresario', pattern: 'B', publishedAt: '2026-05-01T20:00:00Z', analytics: { likes: 1100, comments: 820, shares: 110, saves: 300, reach: 14000, impressions: 24000, engagementRate: 5.4 } },
]

export const mockDashboardSummary: DashboardSummary = {
  totalPublished: 83,
  avgEngagement: 6.42,
  totalReach: 284000,
  scheduledCount: 2,
  totalFollowersGained: dailyData30.reduce((sum, d) => sum + d.newFollowers, 0),
  totalUnfollowers: dailyData30.reduce((sum, d) => sum + d.unfollowers, 0),
  totalLikes: 38400,
  totalComments: 12600,
  totalShares: 4608,
  totalSaves: 6912,
  avgEngagementRate: 6.42,
  contentTypeBreakdown: generateContentTypeBreakdown(83),
  postsPerDay: generatePostsPerDay(30),
  dailyEngagement: dailyData30,
  topPosts: mockRanking.slice(0, 5),
  recentPublished: [
    { id: 'cnt_01', slug: '101-recuperacao-tributaria-dominio', publishedAt: '2026-05-02T20:55:00Z', engagement: 11.2 },
    { id: 'cnt_02', slug: '102-prescricao-trabalhista-claude', publishedAt: '2026-05-04T20:00:00Z', engagement: 9.8 },
  ],
  upcoming: [
    { id: 'cnt_06', slug: '106-folha-pagamento-esocial', scheduledAt: '2026-05-22T20:00:00Z', persona: 'contador' },
    { id: 'cnt_07', slug: '107-contrato-social-analise', scheduledAt: '2026-05-23T20:00:00Z', persona: 'advogado' },
  ],
}

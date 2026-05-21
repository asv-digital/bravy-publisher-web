import type { InternalAxiosRequestConfig } from 'axios'
import { mockContents } from './data/contents'
import { mockTemplates } from './data/templates'
import { mockSocialAccounts } from './data/social-accounts'
import { mockAnalyticsSummary, mockRanking, mockDashboardSummary } from './data/analytics'
import { mockLoginResponse, mockUser } from './data/users'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize
  return {
    data: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
    totalPages: Math.ceil(items.length / pageSize),
  }
}

type MockRoute = {
  match: (method: string, url: string) => boolean
  handle: (config: InternalAxiosRequestConfig) => Promise<{ data: unknown; status: number }>
}

const routes: MockRoute[] = [
  {
    match: (m, u) => m === 'post' && u.includes('/auth/login'),
    handle: async () => {
      await delay(400)
      return { data: mockLoginResponse, status: 200 }
    },
  },
  {
    match: (m, u) => m === 'post' && u.includes('/auth/refresh'),
    handle: async () => {
      await delay(200)
      return { data: { accessToken: 'new_mock_token', refreshToken: 'new_mock_refresh', expiresIn: 900 }, status: 200 }
    },
  },
  {
    match: (m, u) => m === 'get' && u.includes('/users/me'),
    handle: async () => {
      await delay(200)
      return { data: mockUser, status: 200 }
    },
  },
  {
    match: (m, u) => m === 'get' && /\/contents\/[^/]+$/.test(u) && !u.includes('/contents?'),
    handle: async (config) => {
      await delay(300)
      const id = config.url!.split('/').pop()
      const content = mockContents.find((c) => c.id === id)
      if (!content) return { data: { message: 'Not found' }, status: 404 }
      return { data: content, status: 200 }
    },
  },
  {
    match: (m, u) => m === 'get' && (u.includes('/contents') && !u.includes('/contents/')),
    handle: async (config) => {
      await delay(300)
      const params = new URLSearchParams(config.url?.split('?')[1] || '')
      let filtered = [...mockContents]
      const status = params.get('status')
      if (status) filtered = filtered.filter((c) => c.status === status)
      const persona = params.get('persona')
      if (persona) filtered = filtered.filter((c) => c.persona === persona)
      const contentType = params.get('contentType')
      if (contentType) filtered = filtered.filter((c) => c.contentType === contentType)
      const page = parseInt(params.get('page') || '1')
      const pageSize = parseInt(params.get('pageSize') || '20')
      return { data: paginate(filtered, page, pageSize), status: 200 }
    },
  },
  {
    match: (m, u) => m === 'post' && u.includes('/contents'),
    handle: async () => {
      await delay(500)
      const newContent = { ...mockContents[7], id: `cnt_${Date.now()}`, status: 'DRAFT' as const, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      return { data: newContent, status: 201 }
    },
  },
  {
    match: (m, u) => m === 'patch' && u.includes('/contents/'),
    handle: async (config) => {
      await delay(300)
      const id = config.url!.split('/').pop()
      const content = mockContents.find((c) => c.id === id)
      if (!content) return { data: { message: 'Not found' }, status: 404 }
      return { data: { ...content, ...(config.data ? JSON.parse(config.data as string) : {}), updatedAt: new Date().toISOString() }, status: 200 }
    },
  },
  {
    match: (m, u) => m === 'delete' && u.includes('/contents/'),
    handle: async () => {
      await delay(300)
      return { data: { success: true }, status: 200 }
    },
  },
  {
    match: (m, u) => m === 'post' && u.includes('/generation/generate'),
    handle: async () => {
      await delay(3000)
      const generated = { ...mockContents[2], id: `cnt_${Date.now()}`, status: 'READY' as const }
      return { data: generated, status: 200 }
    },
  },
  {
    match: (m, u) => m === 'post' && u.includes('/render/'),
    handle: async () => {
      await delay(500)
      return { data: { id: `rj_${Date.now()}`, status: 'PROCESSING', progress: 0, attempts: 1 }, status: 200 }
    },
  },
  {
    match: (m, u) => m === 'get' && u.includes('/render/') && u.includes('/status'),
    handle: async () => {
      await delay(300)
      return { data: { id: 'rj_mock', status: 'COMPLETED', progress: 100, attempts: 1 }, status: 200 }
    },
  },
  {
    match: (m, u) => m === 'post' && u.includes('/publish/'),
    handle: async () => {
      await delay(1000)
      return { data: { id: 'pt_mock', status: 'PUBLISHED', externalMediaId: '184543687751144' + Math.floor(Math.random() * 100) }, status: 200 }
    },
  },
  {
    match: (m, u) => m === 'get' && u.includes('/templates'),
    handle: async () => {
      await delay(300)
      return { data: mockTemplates, status: 200 }
    },
  },
  {
    match: (m, u) => m === 'get' && u.includes('/social-accounts'),
    handle: async () => {
      await delay(300)
      return { data: mockSocialAccounts, status: 200 }
    },
  },
  {
    match: (m, u) => m === 'delete' && u.includes('/social-accounts/'),
    handle: async () => {
      await delay(300)
      return { data: { success: true }, status: 200 }
    },
  },
  {
    match: (m, u) => m === 'get' && u.includes('/analytics/dashboard'),
    handle: async () => {
      await delay(400)
      return { data: mockDashboardSummary, status: 200 }
    },
  },
  {
    match: (m, u) => m === 'get' && u.includes('/analytics/summary'),
    handle: async (config) => {
      await delay(400)
      const params = new URLSearchParams(config.url?.split('?')[1] || '')
      const period = params.get('period') || '30d'
      const days = period === '90d' ? 90 : period === '60d' ? 60 : 30
      return {
        data: { ...mockAnalyticsSummary, period, dailyData: mockAnalyticsSummary.dailyData.slice(-days) },
        status: 200,
      }
    },
  },
  {
    match: (m, u) => m === 'get' && u.includes('/analytics/ranking'),
    handle: async (config) => {
      await delay(300)
      const params = new URLSearchParams(config.url?.split('?')[1] || '')
      const page = parseInt(params.get('page') || '1')
      return { data: paginate(mockRanking, page, 10), status: 200 }
    },
  },
  {
    match: (m, u) => m === 'get' && u.includes('/datasets/patterns'),
    handle: async () => {
      await delay(200)
      return { data: [
        { id: 'A', nome: 'Lista de promessas', score: 16613 },
        { id: 'B', nome: 'Polarizacao cultural', score: 5410 },
        { id: 'C', nome: 'Movimento errado vs certo', score: 19578 },
        { id: 'D', nome: 'Newsjacking', score: 2607 },
        { id: 'E', nome: 'Profecia matematica', score: 3383 },
        { id: 'F', nome: 'Marcacao social', score: 2236 },
      ], status: 200 }
    },
  },
]

export async function mockInterceptor(config: InternalAxiosRequestConfig) {
  const method = config.method?.toLowerCase() || 'get'
  const url = config.url || ''

  for (const route of routes) {
    if (route.match(method, url)) {
      const result = await route.handle(config)
      return {
        ...config,
        adapter: () =>
          Promise.resolve({
            data: result.data,
            status: result.status,
            statusText: 'OK',
            headers: {},
            config,
          }),
      }
    }
  }

  return config
}

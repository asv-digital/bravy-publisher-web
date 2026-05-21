import { api } from '@/lib/api-client'
import type { Content } from '@/types/content'

export async function getScheduledContents(): Promise<Content[]> {
  const { data } = await api.get('/contents', {
    params: { status: 'SCHEDULED', pageSize: 50 },
  })
  return data.data ?? data
}

export async function getPublishedContents(): Promise<Content[]> {
  const { data } = await api.get('/contents', {
    params: { status: 'PUBLISHED', pageSize: 50 },
  })
  return data.data ?? data
}

export async function getAllContentsForCalendar(): Promise<Content[]> {
  const { data } = await api.get('/contents', {
    params: { pageSize: 100 },
  })
  return data.data ?? data
}

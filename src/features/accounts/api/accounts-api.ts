import { api } from '@/lib/api-client'
import type { SocialAccount } from '@/types/social-account'

export async function getAccounts(): Promise<SocialAccount[]> {
  const { data } = await api.get<SocialAccount[]>('/social-accounts')
  return data
}

export async function disconnectAccount(id: string): Promise<void> {
  await api.delete(`/social-accounts/${id}`)
}

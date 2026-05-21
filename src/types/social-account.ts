export type Platform = 'INSTAGRAM' | 'LINKEDIN' | 'TIKTOK' | 'TWITTER'

export interface SocialAccount {
  id: string
  platform: Platform
  accountName: string
  accountId: string
  connected: boolean
  tokenExpiresAt: string
  avatarUrl?: string
  createdAt: string
}

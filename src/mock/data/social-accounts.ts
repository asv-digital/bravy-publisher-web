import type { SocialAccount } from '@/types/social-account'

export const mockSocialAccounts: SocialAccount[] = [
  {
    id: 'sa_01',
    platform: 'INSTAGRAM',
    accountName: '@jp.asv',
    accountId: '31529476478',
    connected: true,
    tokenExpiresAt: '2026-07-15T00:00:00Z',
    avatarUrl: undefined,
    createdAt: '2025-11-01T10:00:00Z',
  },
  {
    id: 'sa_02',
    platform: 'INSTAGRAM',
    accountName: '@bravyschool',
    accountId: '44829173622',
    connected: true,
    tokenExpiresAt: '2026-05-25T00:00:00Z',
    avatarUrl: undefined,
    createdAt: '2025-11-15T10:00:00Z',
  },
  {
    id: 'sa_03',
    platform: 'LINKEDIN',
    accountName: 'Bravy Tecnologia',
    accountId: 'bravy-tecnologia',
    connected: false,
    tokenExpiresAt: '2026-04-01T00:00:00Z',
    avatarUrl: undefined,
    createdAt: '2026-01-10T10:00:00Z',
  },
]

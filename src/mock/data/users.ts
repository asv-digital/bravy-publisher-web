import type { User, LoginResponse } from '@/types/auth'

export const mockUser: User = {
  id: 'usr_01',
  email: 'tiago@bravy.com.br',
  name: 'Tiago Teles',
  role: 'OWNER',
  tenantId: 'ten_01',
  tenantName: 'Bravy',
  avatarUrl: undefined,
  createdAt: '2025-01-15T10:00:00Z',
}

export const mockLoginResponse: LoginResponse = {
  accessToken: 'mock_access_token_jwt',
  refreshToken: 'mock_refresh_token_jwt',
  expiresIn: 900,
  user: mockUser,
}

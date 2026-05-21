export type UserRole = 'OWNER' | 'ADMIN' | 'EDITOR'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  tenantId: string
  tenantName: string
  avatarUrl?: string
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: User
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  companyName: string
  timezone?: string
}

import { api } from '@/lib/api-client'
import type { LoginRequest, LoginResponse, User } from '@/types/auth'

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', credentials)
  return data
}

export async function refreshToken(token: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/refresh', {
    refreshToken: token,
  })
  return data
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/users/me')
  return data
}

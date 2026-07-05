import { apiRequest, apiRequestWithRefresh, loadTokens } from './client'
import type { AuthRegisterResponse, TokenPair, UserResponse } from './types'

export async function login(email: string, password: string) {
  return apiRequest<TokenPair>('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  })
}

export async function register(input: {
  email: string
  password: string
  full_name: string
  province?: string
  district?: string
}) {
  return apiRequest<AuthRegisterResponse>('/auth/register', {
    method: 'POST',
    body: input,
    auth: false,
  })
}

export async function refresh(refreshToken: string) {
  return apiRequest<TokenPair>('/auth/refresh', {
    method: 'POST',
    body: { refresh_token: refreshToken },
    auth: false,
  })
}

export async function me() {
  return apiRequestWithRefresh<UserResponse>('/auth/me', {}, async () => {
    const tokens = loadTokens()
    if (!tokens?.refresh_token) {
      throw new Error('Missing refresh token')
    }
    return refresh(tokens.refresh_token)
  })
}

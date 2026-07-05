import { API_BASE_URL, AUTH_STORAGE_KEY } from './config'
import type { ApiEnvelope, TokenPair } from './types'
import { ApiError } from './types'

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  auth?: boolean
}

export function loadTokens(): TokenPair | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as TokenPair
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function saveTokens(tokens: TokenPair) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(tokens))
}

export function clearTokens() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getAccessToken(): string | null {
  return loadTokens()?.access_token ?? null
}

async function parseEnvelope<T>(response: Response): Promise<T> {
  let payload: ApiEnvelope<T> | null = null

  try {
    payload = (await response.json()) as ApiEnvelope<T>
  } catch {
    throw new ApiError(response.status, response.statusText || 'Invalid server response')
  }

  if (!response.ok || !payload.success) {
    throw new ApiError(response.status, payload.message || 'Request failed', payload.request_id)
  }

  return payload.data
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.auth !== false) {
    const token = getAccessToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  return parseEnvelope<T>(response)
}

export async function apiRequestWithRefresh<T>(
  path: string,
  options: RequestOptions = {},
  refreshFn?: () => Promise<TokenPair>,
): Promise<T> {
  try {
    return await apiRequest<T>(path, options)
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || !refreshFn) {
      throw error
    }

    const tokens = await refreshFn()
    saveTokens(tokens)
    return apiRequest<T>(path, options)
  }
}

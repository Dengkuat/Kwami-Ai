import { apiRequest, apiRequestWithRefresh } from './client'
import { refresh } from './authApi'
import { loadTokens, saveTokens } from './client'
import type { ChatRequest, ChatResponse, ChecklistResponse } from './types'

async function withRefresh<T>(path: string, options: Parameters<typeof apiRequest>[1]) {
  return apiRequestWithRefresh<T>(path, options, async () => {
    const tokens = loadTokens()
    if (!tokens?.refresh_token) {
      throw new Error('Missing refresh token')
    }
    const next = await refresh(tokens.refresh_token)
    saveTokens(next)
    return next
  })
}

export async function sendChat(body: ChatRequest) {
  return withRefresh<ChatResponse>('/ai/chat', {
    method: 'POST',
    body,
  })
}

export async function getSuggestions(serviceId?: string) {
  const suffix = serviceId ? `?service_id=${serviceId}` : ''
  return apiRequest<string[]>(`/ai/suggestions${suffix}`, { auth: false })
}

export async function generateChecklist(serviceId: string) {
  return withRefresh<ChecklistResponse>('/ai/generate-checklist', {
    method: 'POST',
    body: { service_id: serviceId },
  })
}

export async function updateChecklistItem(
  checklistId: string,
  itemId: string,
  status: 'not_done' | 'done' | 'skipped',
) {
  return withRefresh(`/checklists/${checklistId}/items/${itemId}`, {
    method: 'PATCH',
    body: { status },
  })
}

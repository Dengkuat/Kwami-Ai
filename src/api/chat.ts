import { API_ENDPOINTS } from '../config/api'

export type ChatLanguage = 'en' | 'rw'

export type ChatRole = 'user' | 'assistant'

export interface ChatHistoryMessage {
  role: ChatRole
  content: string
}

export interface ChatAttachment {
  [key: string]: unknown
}

export interface ChatRequestPayload {
  message: string
  language: ChatLanguage
  history: ChatHistoryMessage[]
}

export interface ChatResponseData {
  reply: string
  language: string
  model: string
  attachments: ChatAttachment[]
}

interface ApiError {
  code?: string
  field?: string | null
  detail?: string
}

interface ChatResponseEnvelope {
  success: boolean
  message?: string
  data: ChatResponseData | null
  errors?: ApiError[] | null
}

function envelopeErrorMessage(envelope: ChatResponseEnvelope | null): string {
  if (!envelope) return 'Chat request returned an invalid response'
  if (envelope.message) return envelope.message
  const detail = envelope.errors?.find((e) => e.detail)?.detail
  return detail ?? 'Chat request returned an unsuccessful response'
}

/**
 * Non-streaming chat request. Used as a fallback when streaming fails.
 */
export async function sendChatMessage(
  payload: ChatRequestPayload,
  signal?: AbortSignal,
): Promise<ChatResponseData> {
  const response = await fetch(API_ENDPOINTS.chat, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })

  const envelope = (await response.json().catch(() => null)) as ChatResponseEnvelope | null
  if (!response.ok || !envelope?.success || !envelope.data) {
    throw new Error(envelopeErrorMessage(envelope))
  }

  return envelope.data
}

export interface StreamCallbacks {
  onDelta: (chunk: string) => void
  onDone?: () => void
  signal?: AbortSignal
}

/**
 * Streaming chat request against the POST SSE endpoint.
 *
 * EventSource cannot be used because it only supports GET, so we POST with
 * fetch and read the ReadableStream body, splitting Server-Sent-Event frames
 * on the blank-line delimiter and parsing each `data:` payload as JSON.
 */
export async function streamChatMessage(
  payload: ChatRequestPayload,
  { onDelta, onDone, signal }: StreamCallbacks,
): Promise<void> {
  const response = await fetch(API_ENDPOINTS.chatStream, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  })

  if (!response.ok || !response.body) {
    throw new Error(`Streaming chat request failed with status ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let finished = false

  const processEvent = (rawEvent: string) => {
    // A single SSE event may contain multiple `data:` lines.
    const dataLines = rawEvent
      .split('\n')
      .map((line) => line.trimStart())
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice('data:'.length).trim())

    if (dataLines.length === 0) return

    const dataStr = dataLines.join('\n')
    if (!dataStr || dataStr === '[DONE]') {
      if (dataStr === '[DONE]') {
        finished = true
        onDone?.()
      }
      return
    }

    try {
      const parsed = JSON.parse(dataStr) as {
        delta?: string
        done?: boolean
        error?: string
      }
      if (parsed.error) {
        throw new Error(parsed.error)
      }
      if (typeof parsed.delta === 'string' && parsed.delta.length > 0) {
        onDelta(parsed.delta)
      }
      if (parsed.done) {
        finished = true
        onDone?.()
      }
    } catch (error) {
      // Ignore keep-alive/non-JSON frames; re-throw genuine backend errors.
      if (error instanceof Error && error.message && dataStr.includes('error')) {
        throw error
      }
    }
  }

  try {
    while (!finished) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      let separatorIndex = buffer.indexOf('\n\n')
      while (separatorIndex !== -1) {
        const rawEvent = buffer.slice(0, separatorIndex)
        buffer = buffer.slice(separatorIndex + 2)
        processEvent(rawEvent)
        if (finished) break
        separatorIndex = buffer.indexOf('\n\n')
      }
    }

    // Flush any remaining buffered event.
    if (!finished && buffer.trim().length > 0) {
      processEvent(buffer)
    }
  } finally {
    reader.cancel().catch(() => {})
  }

  if (!finished) {
    onDone?.()
  }
}

export interface UploadPayload extends ChatRequestPayload {
  files: File[]
}

/**
 * Multipart chat request with file attachments.
 */
export async function uploadChatMessage(
  { message, language, history, files }: UploadPayload,
  signal?: AbortSignal,
): Promise<ChatResponseData> {
  const formData = new FormData()
  formData.append('message', message)
  formData.append('language', language)
  formData.append('history', JSON.stringify(history))
  files.slice(0, 5).forEach((file) => formData.append('files', file))

  const response = await fetch(API_ENDPOINTS.chatUpload, {
    method: 'POST',
    body: formData,
    signal,
  })

  const envelope = (await response.json().catch(() => null)) as ChatResponseEnvelope | null
  if (!response.ok || !envelope?.success || !envelope.data) {
    throw new Error(envelopeErrorMessage(envelope))
  }

  return envelope.data
}

export async function checkHealth(signal?: AbortSignal): Promise<boolean> {
  try {
    const response = await fetch(API_ENDPOINTS.healthLive, { signal })
    return response.ok
  } catch {
    return false
  }
}

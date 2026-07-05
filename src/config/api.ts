// Backend API configuration for the Kwami AI backend.
// The base URL is intentionally hardcoded here (NOT read from an .env file)
// so the frontend always talks to the live deployed backend.
export const API_BASE_URL = 'https://kwami-ai-backend.vercel.app'

export const API_ENDPOINTS = {
  chat: `${API_BASE_URL}/api/v1/chat`,
  chatStream: `${API_BASE_URL}/api/v1/chat/stream`,
  chatUpload: `${API_BASE_URL}/api/v1/chat/upload`,
  healthLive: `${API_BASE_URL}/api/v1/health/live`,
} as const

// Max number of prior messages sent as conversation history.
export const MAX_HISTORY_MESSAGES = 20

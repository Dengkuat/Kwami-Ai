export interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
  request_id: string
  timestamp: string
}

export interface TokenPair {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface UserResponse {
  id: string
  email: string
  full_name: string
  role: string
  is_active: boolean
  province: string | null
  district: string | null
}

export interface AuthRegisterResponse {
  user: UserResponse
  tokens: TokenPair
}

export interface ServiceCategoryResponse {
  id: string
  label: string
  icon: string
  service_count: number
}

export interface ServiceCardResponse {
  id: string
  slug: string
  title: string
  description: string
  category: string
  is_popular: boolean
  primary_fee: number | null
  fee_currency: string
  estimated_timeline: string | null
}

export interface PaginatedServices {
  items: ServiceCardResponse[]
  total: number
  page: number
  page_size: number
  pages: number
}

export interface ChatRequest {
  message: string
  conversation_id?: string | null
  service_id?: string | null
  locale?: 'en' | 'rw'
  province?: string | null
  district?: string | null
}

export interface ChatResponse {
  conversation_id: string
  message: string
  grounded: boolean
  refused: boolean
  service_id: string | null
  service_title: string | null
  suggestions: string[]
  sources: Array<{
    service_id: string | null
    service_title: string | null
    chunk_type: string | null
    content: string
  }>
}

export interface ChecklistItemResponse {
  id: string
  label: string
  status: 'not_done' | 'done' | 'skipped'
  sort_order: number
}

export interface ChecklistResponse {
  id: string
  title: string
  service_id: string | null
  items: ChecklistItemResponse[]
  created_at: string
  done_count: number
  total_count: number
  progress_label: string
}

export class ApiError extends Error {
  status: number
  requestId?: string

  constructor(status: number, message: string, requestId?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.requestId = requestId
  }
}

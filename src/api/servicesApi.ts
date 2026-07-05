import { apiRequest } from './client'
import type { PaginatedServices, ServiceCardResponse, ServiceCategoryResponse } from './types'

export async function listCategories() {
  return apiRequest<ServiceCategoryResponse[]>('/services/categories', { auth: false })
}

export async function listServices(params?: {
  search?: string
  category?: string
  popular?: boolean
  page?: number
  page_size?: number
}) {
  const query = new URLSearchParams()

  if (params?.search) query.set('search', params.search)
  if (params?.category) query.set('category', params.category)
  if (params?.popular) query.set('popular', 'true')
  if (params?.page) query.set('page', String(params.page))
  if (params?.page_size) query.set('page_size', String(params.page_size))

  const suffix = query.toString() ? `?${query.toString()}` : ''
  return apiRequest<PaginatedServices>(`/services${suffix}`, { auth: false })
}

export async function getServiceBySlug(slug: string) {
  return apiRequest<Record<string, unknown>>(`/services/slug/${slug}`, { auth: false })
}

export async function getServiceById(serviceId: string) {
  return apiRequest<Record<string, unknown>>(`/services/${serviceId}`, { auth: false })
}

export type { ServiceCardResponse }

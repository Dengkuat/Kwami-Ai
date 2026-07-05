import type { ServiceCardResponse, ServiceCategoryResponse } from '../api/types'
import type { CategoryItem, ServiceCategory, ServiceIcon, ServiceItem } from '../data/servicesData'

const categoryLabels: Record<string, ServiceCategory> = {
  identity: 'Identity',
  business: 'Business',
  family: 'Family',
  land: 'Land',
  transport: 'Transport',
}

const categoryIcons: Record<string, ServiceIcon> = {
  identity: 'identity',
  business: 'business',
  family: 'family',
  land: 'land',
  transport: 'transport',
  document: 'document',
}

export function mapCategory(category: ServiceCategoryResponse): CategoryItem {
  return {
    id: category.id,
    label: category.label,
    icon: categoryIcons[category.icon] ?? categoryIcons[category.id] ?? 'document',
  }
}

export function mapServiceCard(service: ServiceCardResponse): ServiceItem {
  const categoryKey = service.category.toLowerCase()

  return {
    id: service.slug,
    backendId: service.id,
    name: service.title,
    category: categoryLabels[categoryKey] ?? 'Identity',
    description: service.description,
    fee:
      service.primary_fee != null
        ? `${service.fee_currency} ${service.primary_fee.toLocaleString()}`
        : 'Fee varies',
    icon: categoryIcons[categoryKey] ?? 'document',
  }
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  )
}

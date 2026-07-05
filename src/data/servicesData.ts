export type ServiceCategory =
  | 'Identity'
  | 'Business'
  | 'Family'
  | 'Land'
  | 'Transport'

export type ServiceIcon =
  | 'identity'
  | 'business'
  | 'family'
  | 'land'
  | 'transport'
  | 'document'

export interface CategoryItem {
  id: string
  label: string
  icon: ServiceIcon
}

export interface ServiceItem {
  id: string
  backendId?: string
  name: string
  category: ServiceCategory
  description: string
  fee: string
  icon: ServiceIcon
}

export const categories: CategoryItem[] = [
  { id: 'identity', label: 'Identity', icon: 'identity' },
  { id: 'business', label: 'Business', icon: 'business' },
  { id: 'family', label: 'Family', icon: 'family' },
  { id: 'land', label: 'Land', icon: 'land' },
  { id: 'transport', label: 'Transport', icon: 'transport' },
]

export const popularServices: ServiceItem[] = [
  {
    id: 'national-id',
    name: 'New National ID',
    category: 'Identity',
    description: 'Request or replace your Rwanda National ID card online.',
    fee: 'RWF 5,000',
    icon: 'identity',
  },
  {
    id: 'land-title',
    name: 'Land Title Transfer',
    category: 'Land',
    description: 'Apply for legal ownership transfer of land property parcels.',
    fee: 'RWF 25,000',
    icon: 'land',
  },
  {
    id: 'birth-certificate',
    name: 'Birth Certificate',
    category: 'Family',
    description: 'Official digital birth registration and certificate issuance.',
    fee: 'RWF 1,500',
    icon: 'document',
  },
  {
    id: 'driving-license',
    name: 'Driving License Renewal',
    category: 'Transport',
    description: 'Renew your existing driving permit before expiration.',
    fee: 'RWF 10,000',
    icon: 'transport',
  },
]

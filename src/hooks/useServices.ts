import { useEffect, useState } from 'react'
import { servicesApi } from '../api'
import { mapCategory, mapServiceCard } from '../lib/apiMappers'
import { categories as fallbackCategories, popularServices as fallbackServices } from '../data/servicesData'
import type { CategoryItem, ServiceItem } from '../data/servicesData'

type UseServicesOptions = {
  search?: string
  category?: string
  popular?: boolean
}

export function useServices({ search, category, popular = true }: UseServicesOptions = {}) {
  const [categories, setCategories] = useState<CategoryItem[]>(fallbackCategories)
  const [services, setServices] = useState<ServiceItem[]>(fallbackServices)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)

      try {
        const [categoryResponse, serviceResponse] = await Promise.all([
          servicesApi.listCategories(),
          servicesApi.listServices({
            search: search || undefined,
            category: category || undefined,
            popular: !search && !category ? popular : false,
          }),
        ])

        if (cancelled) return

        setCategories(
          categoryResponse.length > 0 ? categoryResponse.map(mapCategory) : fallbackCategories,
        )
        setServices(
          serviceResponse.items.length > 0
            ? serviceResponse.items.map(mapServiceCard)
            : fallbackServices,
        )
        setUsingFallback(false)
      } catch {
        if (cancelled) return
        setCategories(fallbackCategories)
        setServices(fallbackServices)
        setUsingFallback(true)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [search, category, popular])

  return { categories, services, loading, usingFallback }
}

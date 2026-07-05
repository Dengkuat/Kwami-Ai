import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import CategoryScroll from '../components/services/CategoryScroll'
import GuidanceCta from '../components/services/GuidanceCta'
import ServiceCard from '../components/services/ServiceCard'
import { SearchIcon } from '../components/icons/ServiceIcons'
import { categories, popularServices, type ServiceItem } from '../data/servicesData'
import { buildPresetChatLink } from '../data/chatPresets'

const CATEGORY_PARAM = 'category'

function ServicesPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  const handleServiceSelect = useCallback(
    (service: ServiceItem) => {
      const lang = document.documentElement.lang === 'rw' ? 'rw' : 'en'
      navigate(buildPresetChatLink(service.id, lang, service.name))
    },
    [navigate],
  )

  const rawCategory = searchParams.get(CATEGORY_PARAM)
  const activeCategory =
    rawCategory && categories.some((category) => category.id === rawCategory)
      ? rawCategory
      : null

  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      const next = new URLSearchParams(searchParams)
      if (categoryId === activeCategory) {
        next.delete(CATEGORY_PARAM)
      } else {
        next.set(CATEGORY_PARAM, categoryId)
      }
      setSearchParams(next, { replace: true })
    },
    [activeCategory, searchParams, setSearchParams],
  )

  const handleClearCategory = useCallback(() => {
    const next = new URLSearchParams(searchParams)
    next.delete(CATEGORY_PARAM)
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  const filteredServices = useMemo(() => {
    let results = popularServices

    if (activeCategory) {
      results = results.filter(
        (service) => service.category.toLowerCase() === activeCategory,
      )
    }

    const query = searchQuery.trim().toLowerCase()
    if (query) {
      results = results.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.category.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query),
      )
    }

    return results
  }, [activeCategory, searchQuery])

  const activeCategoryLabel = categories.find(
    (category) => category.id === activeCategory,
  )?.label

  return (
    <AppShell>
      <div className="px-4 pt-5 sm:px-6 lg:px-0">
        <h2 className="mb-4 text-2xl font-bold leading-tight text-kwami-green-dark sm:text-3xl">
          How can we help you today?
        </h2>

        <label className="relative mb-6 block">
          <span className="sr-only">Search for services</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search for services (e.g., National ID, Land Title)"
            className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-kwami-green focus:outline-none focus:ring-2 focus:ring-kwami-green/20"
          />
        </label>

        <div className="mb-7">
          <CategoryScroll
            categories={categories}
            activeCategoryId={activeCategory}
            onCategorySelect={handleCategorySelect}
            onClearCategory={handleClearCategory}
          />
        </div>

        <section className="mb-6">
          <h2 className="mb-4 text-base font-semibold text-gray-800">
            {activeCategoryLabel ? `${activeCategoryLabel} Services` : 'Popular Services'}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onSelect={handleServiceSelect}
              />
            ))}
            {filteredServices.length === 0 && (
              <p className="rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
                {searchQuery.trim()
                  ? 'No services match your search.'
                  : activeCategoryLabel
                    ? `No services found in ${activeCategoryLabel}.`
                    : 'No services available.'}
              </p>
            )}
          </div>
        </section>

        <GuidanceCta />
      </div>
    </AppShell>
  )
}

export default ServicesPage

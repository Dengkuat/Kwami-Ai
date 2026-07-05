import { useMemo, useState } from 'react'
import AppShell from '../components/layout/AppShell'
import CategoryScroll from '../components/services/CategoryScroll'
import GuidanceCta from '../components/services/GuidanceCta'
import ServiceCard from '../components/services/ServiceCard'
import { SearchIcon } from '../components/icons/ServiceIcons'
import { categories, popularServices } from '../data/servicesData'

function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return popularServices

    return popularServices.filter(
      (service) =>
        service.name.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query),
    )
  }, [searchQuery])

  return (
    <AppShell>
      <div className="px-4 pt-5">
        <h2 className="mb-4 text-2xl font-bold leading-tight text-kwami-green-dark">
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
          <CategoryScroll categories={categories} />
        </div>

        <section className="mb-6">
          <h2 className="mb-4 text-base font-semibold text-gray-800">Popular Services</h2>
          <div className="space-y-3">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
            {filteredServices.length === 0 && (
              <p className="rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
                No services match your search.
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

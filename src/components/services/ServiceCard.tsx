import type { ServiceItem } from '../../data/servicesData'
import { ChevronRightIcon, ServiceIconGlyph } from '../icons/ServiceIcons'

interface ServiceCardProps {
  service: ServiceItem
  onSelect?: (service: ServiceItem) => void
}

function ServiceCard({ service, onSelect }: ServiceCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(service)}
      className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-left transition-shadow hover:shadow-sm"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-kwami-blue text-kwami-blue-icon">
        <ServiceIconGlyph icon={service.icon} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="mb-1 flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-gray-900">{service.name}</span>
          <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-500">
            {service.category}
          </span>
        </span>
        <span className="mb-2 block text-xs leading-relaxed text-gray-500">{service.description}</span>
        <span className="text-sm font-bold text-kwami-green">{service.fee}</span>
      </span>

      <ChevronRightIcon />
    </button>
  )
}

export default ServiceCard

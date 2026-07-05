import { useState } from 'react'
import type { CategoryItem } from '../../data/servicesData'
import { ServiceIconGlyph } from '../icons/ServiceIcons'

interface CategoryScrollProps {
  categories: CategoryItem[]
}

function CategoryScroll({ categories }: CategoryScrollProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '')

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">Categories</h2>
        <button type="button" className="text-sm font-medium text-kwami-green hover:text-kwami-green-dark">
          See all
        </button>
      </div>

      <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-1">
        {categories.map((category) => {
          const isActive = category.id === activeId

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setActiveId(category.id)}
              className="flex w-[4.5rem] shrink-0 flex-col items-center gap-2"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
                  isActive
                    ? 'bg-kwami-blue text-kwami-blue-icon'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <ServiceIconGlyph icon={category.icon} />
              </span>
              <span className="text-xs font-medium text-gray-700">{category.label}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default CategoryScroll

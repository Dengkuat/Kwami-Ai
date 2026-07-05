import type { ServiceIcon } from '../../data/servicesData'

const iconClass = 'h-5 w-5'

export function ServiceIconGlyph({ icon }: { icon: ServiceIcon }) {
  switch (icon) {
    case 'identity':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="10" cy="11" r="2" stroke="currentColor" strokeWidth="1.75" />
          <path d="M7 16c.8-1.5 2-2.25 3-2.25s2.2.75 3 2.25" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M15 9h3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M15 12h3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      )
    case 'business':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="4" y="8" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M4 12h16" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      )
    case 'family':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="9" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="16" cy="9" r="2" stroke="currentColor" strokeWidth="1.75" />
          <path d="M4.5 18c.6-2.4 2.4-3.75 4.5-3.75S12.9 15.6 13.5 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M14.5 17.25c.45-1.35 1.5-2.25 2.75-2.25 1.1 0 2 .55 2.55 1.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      )
    case 'land':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 18l6.5-8 4 5 3-3.5L20 18H4Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
          <circle cx="16.5" cy="7.5" r="1.5" fill="currentColor" />
        </svg>
      )
    case 'transport':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 9h14l-1.5 8H6.5L5 9Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
          <path d="M7 9l1.5-3h7L17 9" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
          <circle cx="8" cy="17.5" r="1.25" fill="currentColor" />
          <circle cx="16" cy="17.5" r="1.25" fill="currentColor" />
        </svg>
      )
    case 'document':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M8 4h7l3 3v13H8V4Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
          <path d="M15 4v3h3" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
          <path d="M10 11h6M10 14h6M10 17h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      )
  }
}

export function ChevronRightIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SearchIcon() {
  return (
    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

export function MenuIcon() {
  return (
    <svg className="h-6 w-6 text-gray-700" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

export function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 10.5 12 5l7.5 5.5V19a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19v-8.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        fill={active ? 'currentColor' : 'none'}
      />
    </svg>
  )
}

export function ServicesIcon({ active }: { active?: boolean }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.75" fill={active ? 'currentColor' : 'none'} />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.75" fill={active ? 'currentColor' : 'none'} />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.75" fill={active ? 'currentColor' : 'none'} />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.75" fill={active ? 'currentColor' : 'none'} />
    </svg>
  )
}

export function ChatIcon({ active }: { active?: boolean }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6.5h12a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2H10l-4.5 3v-3.5A2 2 0 0 1 4 15V8.5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        fill={active ? 'currentColor' : 'none'}
      />
    </svg>
  )
}

export function ProfileIcon({ active }: { active?: boolean }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.75" fill={active ? 'currentColor' : 'none'} />
      <path
        d="M6 19c.9-2.75 3-4.25 6-4.25s5.1 1.5 6 4.25"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        fill={active ? 'currentColor' : 'none'}
      />
    </svg>
  )
}

import { NavLink } from 'react-router-dom'
import { landingContent, type Language } from '../pages/landingContent'
import { ROUTE_PATHS } from '../routes/routePaths'
import './BottomNav.css'

const navItems = [
  {
    path: ROUTE_PATHS.landing,
    labelKey: 'home' as const,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    path: ROUTE_PATHS.services,
    labelKey: 'services' as const,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
      </svg>
    ),
  },
  {
    path: ROUTE_PATHS.chat,
    labelKey: 'chat' as const,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
      </svg>
    ),
  },
  {
    path: ROUTE_PATHS.checklist,
    labelKey: 'checklist' as const,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    ),
  },
  {
    path: ROUTE_PATHS.profile,
    labelKey: 'profile' as const,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
  },
]

type BottomNavProps = {
  language?: Language
}

function BottomNav({ language = 'english' }: BottomNavProps) {
  const t = landingContent[language]

  return (
    <nav className="bottom-nav" aria-label={t.navAria}>
      {navItems.map(({ path, labelKey, icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`
          }
          end={path === ROUTE_PATHS.landing}
        >
          <span className="bottom-nav__icon">{icon}</span>
          <span className="bottom-nav__label">{t.nav[labelKey]}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav

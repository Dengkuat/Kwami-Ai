import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { landingContent, type Language } from '../pages/landingContent'
import { ROUTE_PATHS } from '../routes/routePaths'
import './SideMenu.css'

type SideMenuProps = {
  isOpen: boolean
  onClose: () => void
  language: Language
}

const menuItems = [
  {
    path: ROUTE_PATHS.landing,
    labelKey: 'home' as const,
    end: true,
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
    path: ROUTE_PATHS.profile,
    labelKey: 'profile' as const,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
  },
]

function SideMenu({ isOpen, onClose, language }: SideMenuProps) {
  const t = landingContent[language]

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <>
      <button
        type="button"
        className={`side-menu__backdrop${isOpen ? ' side-menu__backdrop--open' : ''}`}
        aria-label={t.closeMenuLabel}
        onClick={onClose}
        tabIndex={isOpen ? 0 : -1}
      />

      <aside
        className={`side-menu${isOpen ? ' side-menu--open' : ''}`}
        aria-hidden={!isOpen}
        aria-label={t.menuTitle}
      >
        <div className="side-menu__header">
          <h2 className="side-menu__brand">Kigali Kwima</h2>
          <button
            type="button"
            className="side-menu__close"
            aria-label={t.closeMenuLabel}
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <nav className="side-menu__nav">
          {menuItems.map(({ path, labelKey, end, icon }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                `side-menu__link${isActive ? ' side-menu__link--active' : ''}`
              }
              onClick={onClose}
            >
              <span className="side-menu__link-icon">{icon}</span>
              {t.nav[labelKey]}
            </NavLink>
          ))}

          <div className="side-menu__divider" role="presentation" />

          <NavLink
            to={ROUTE_PATHS.checklist}
            className={({ isActive }) =>
              `side-menu__link${isActive ? ' side-menu__link--active' : ''}`
            }
            onClick={onClose}
          >
            <span className="side-menu__link-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </span>
            {t.menuChecklist}
          </NavLink>
        </nav>
      </aside>
    </>
  )
}

export default SideMenu

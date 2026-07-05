import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { APP_NAME } from '../../config/brand'
import { useLanguage } from '../../context/language'
import { landingContent } from '../../pages/landingContent'
import { navItems } from './navConfig'
import './SideMenu.css'

type SideMenuProps = {
  isOpen: boolean
  onClose: () => void
}

function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const { lang } = useLanguage()
  const language = lang === 'rw' ? 'kinyarwanda' : 'english'
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
    <div className="lg:hidden">
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
          <h2 className="side-menu__brand">{APP_NAME}</h2>
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
          {navItems.map(({ id, to, end, icon: Icon }) => (
            <NavLink
              key={id}
              to={to}
              end={end}
              className={({ isActive }) =>
                `side-menu__link${isActive ? ' side-menu__link--active' : ''}`
              }
              onClick={onClose}
            >
              {({ isActive }) => (
                <>
                  <span className="side-menu__link-icon">
                    <Icon active={isActive} />
                  </span>
                  {t.nav[id]}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  )
}

export default SideMenu

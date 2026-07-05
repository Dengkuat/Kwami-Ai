import { NavLink } from 'react-router-dom'
import { APP_NAME } from '../../config/brand'
import { useLanguage } from '../../context/language'
import { landingContent } from '../../pages/landingContent'
import { navItems } from './navConfig'

function DesktopNav() {
  const { lang, toggleLang } = useLanguage()
  const language = lang === 'rw' ? 'kinyarwanda' : 'english'
  const t = landingContent[language]

  return (
    <aside className="sticky top-0 hidden h-screen lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-gray-100 lg:bg-white">
      <div className="flex h-14 items-center px-5">
        <span className="text-lg font-bold text-kwami-green">{APP_NAME}</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label={t.navAria}>
        {navItems.map(({ id, to, end, icon: Icon }) => (
          <NavLink
            key={id}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-kwami-green text-white'
                  : 'text-gray-600 hover:bg-kwami-green-light hover:text-kwami-green-dark'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon active={isActive} />
                {t.nav[id]}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 p-4">
        <button
          type="button"
          onClick={toggleLang}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-kwami-green transition hover:bg-kwami-green-light"
        >
          {t.headerLang}
        </button>
      </div>
    </aside>
  )
}

export default DesktopNav

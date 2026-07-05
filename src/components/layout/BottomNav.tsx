import { NavLink } from 'react-router-dom'
import { useLanguage } from '../../context/language'
import { landingContent } from '../../pages/landingContent'
import { navItems } from './navConfig'

function BottomNav() {
  const { lang } = useLanguage()
  const language = lang === 'rw' ? 'kinyarwanda' : 'english'
  const t = landingContent[language]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 lg:hidden"
      aria-label={t.navAria}
    >
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[430px] items-center justify-around px-1 pb-[env(safe-area-inset-bottom)] sm:max-w-xl md:max-w-2xl">
        {navItems.map(({ id, to, end, icon: Icon }) => (
          <NavLink
            key={id}
            to={to}
            end={end}
            className="flex flex-1 flex-col items-center justify-center"
          >
            {({ isActive }) => (
              <div
                className={`flex flex-col items-center gap-1 rounded-full px-2 py-2 transition-colors sm:px-3 ${
                  isActive ? 'bg-kwami-green text-white' : 'text-gray-500'
                }`}
              >
                <Icon active={isActive} />
                <span
                  className={`text-[10px] font-medium sm:text-xs ${isActive ? 'text-white' : 'text-gray-500'}`}
                >
                  {t.nav[id]}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav

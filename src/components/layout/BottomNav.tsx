import { NavLink } from 'react-router-dom'
import { useLanguage } from '../../context/language'
import { landingContent } from '../../pages/landingContent'
import { ROUTE_PATHS } from '../../routes/routePaths'
import {
  ChatIcon,
  ChecklistIcon,
  HomeIcon,
  ProfileIcon,
  ServicesIcon,
} from '../icons/ServiceIcons'

type NavTab = 'home' | 'services' | 'chat' | 'checklist' | 'profile'

const navItems: { id: NavTab; to: string; icon: typeof HomeIcon }[] = [
  { id: 'home', to: ROUTE_PATHS.landing, icon: HomeIcon },
  { id: 'services', to: ROUTE_PATHS.services, icon: ServicesIcon },
  { id: 'chat', to: ROUTE_PATHS.chat, icon: ChatIcon },
  { id: 'checklist', to: ROUTE_PATHS.checklist, icon: ChecklistIcon },
  { id: 'profile', to: ROUTE_PATHS.profile, icon: ProfileIcon },
]

function BottomNav() {
  const { lang } = useLanguage()
  const language = lang === 'rw' ? 'kinyarwanda' : 'english'
  const t = landingContent[language]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-100 bg-white">
      <div className="mx-auto flex h-[4.5rem] max-w-md items-center justify-around px-1">
        {navItems.map(({ id, to, icon: Icon }) => (
          <NavLink
            key={id}
            to={to}
            end={to === ROUTE_PATHS.landing}
            className="flex flex-1 flex-col items-center justify-center"
          >
            {({ isActive }) => (
              <div
                className={`flex flex-col items-center gap-1 rounded-full px-2 py-2 transition-colors sm:px-3 ${
                  isActive ? 'bg-kwami-green text-white' : 'text-gray-500'
                }`}
              >
                <Icon active={isActive} />
                <span className={`text-[10px] font-medium sm:text-xs ${isActive ? 'text-white' : 'text-gray-500'}`}>
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

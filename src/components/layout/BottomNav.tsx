import { NavLink } from 'react-router-dom'
import { ROUTE_PATHS } from '../../routes/routePaths'
import { ChatIcon, HomeIcon, ProfileIcon, ServicesIcon } from '../icons/ServiceIcons'

type NavTab = 'home' | 'services' | 'chat' | 'profile'

const navItems: { id: NavTab; label: string; to: string; icon: typeof HomeIcon }[] = [
  { id: 'home', label: 'Home', to: ROUTE_PATHS.landing, icon: HomeIcon },
  { id: 'services', label: 'Services', to: ROUTE_PATHS.services, icon: ServicesIcon },
  { id: 'chat', label: 'Chat', to: ROUTE_PATHS.chat, icon: ChatIcon },
  { id: 'profile', label: 'Profile', to: ROUTE_PATHS.profile, icon: ProfileIcon },
]

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-100 bg-white">
      <div className="mx-auto flex h-[4.5rem] max-w-md items-center justify-around px-2">
        {navItems.map(({ id, label, to, icon: Icon }) => (
          <NavLink
            key={id}
            to={to}
            className="flex flex-1 flex-col items-center justify-center"
          >
            {({ isActive }) => (
              <div
                className={`flex flex-col items-center gap-1 rounded-full px-4 py-2 transition-colors ${
                  isActive ? 'bg-kwami-green text-white' : 'text-gray-500'
                }`}
              >
                <Icon active={isActive} />
                <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {label}
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

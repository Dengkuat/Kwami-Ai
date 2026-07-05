import {
  ChatIcon,
  ChecklistIcon,
  HomeIcon,
  ProfileIcon,
  ServicesIcon,
} from '../icons/ServiceIcons'
import { ROUTE_PATHS } from '../../routes/routePaths'

export type NavTab = 'home' | 'services' | 'chat' | 'checklist' | 'profile'

export const navItems: {
  id: NavTab
  to: string
  end?: boolean
  icon: typeof HomeIcon
}[] = [
  { id: 'home', to: ROUTE_PATHS.landing, end: true, icon: HomeIcon },
  { id: 'services', to: ROUTE_PATHS.services, icon: ServicesIcon },
  { id: 'chat', to: ROUTE_PATHS.chat, icon: ChatIcon },
  { id: 'checklist', to: ROUTE_PATHS.checklist, icon: ChecklistIcon },
  { id: 'profile', to: ROUTE_PATHS.profile, icon: ProfileIcon },
]

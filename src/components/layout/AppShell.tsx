import { useState, type ReactNode } from 'react'
import AppHeader from './AppHeader'
import BottomNav from './BottomNav'
import DesktopNav from './DesktopNav'
import SideMenu from './SideMenu'

interface AppShellProps {
  children: ReactNode
  mainClassName?: string
  contentClassName?: string
  wide?: boolean
}

function AppShell({
  children,
  mainClassName = '',
  contentClassName = '',
  wide = false,
}: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const contentWidth = wide
    ? 'max-w-none xl:max-w-6xl'
    : 'max-w-none lg:max-w-3xl xl:max-w-4xl'

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-white shadow-sm sm:max-w-xl md:max-w-2xl lg:max-w-none lg:flex-row lg:shadow-none">
        <DesktopNav />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <AppHeader onOpenMenu={() => setMenuOpen(true)} />
          <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

          <main
            className={`flex-1 overflow-y-auto pb-[var(--app-shell-padding-bottom)] lg:pb-8 lg:px-6 xl:px-10 ${mainClassName}`}
          >
            <div className={`mx-auto w-full ${contentWidth} ${contentClassName}`}>
              {children}
            </div>
          </main>

          <BottomNav />
        </div>
      </div>
    </div>
  )
}

export default AppShell

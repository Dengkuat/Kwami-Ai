import type { ReactNode } from 'react'
import AppHeader from './AppHeader'
import BottomNav from './BottomNav'

interface AppShellProps {
  children: ReactNode
}

function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <AppHeader />
        <main className="flex-1 overflow-y-auto pb-24">{children}</main>
        <BottomNav />
      </div>
    </div>
  )
}

export default AppShell

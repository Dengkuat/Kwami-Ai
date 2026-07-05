import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/language'
import { DEMO_PROFILE } from '../../data/demoProfile'
import { ROUTE_PATHS } from '../../routes/routePaths'

export interface ConversationSummary {
  id: string
  title: string
  updatedAt: number
}

interface ChatSidebarProps {
  conversations: ConversationSummary[]
  activeId: string | null
  search: string
  onSearchChange: (value: string) => void
  onSelect: (id: string) => void
  onNewChat: () => void
  onDelete: (id: string) => void
  onClose: () => void
}

const SIDEBAR_TEXT = {
  en: {
    newChat: 'New Chat',
    search: 'Search chats...',
    recent: 'Recent Chats',
    tools: 'Tools',
    services: 'Services',
    checklist: 'Checklists',
    settings: 'Settings',
    noChats: 'No conversations yet',
    plan: 'Free Plan',
    user: 'Guest User',
    aiTools: 'AI Tools',
  },
  rw: {
    newChat: 'Ikiganiro Gishya',
    search: 'Shakisha ibiganiro...',
    recent: 'Ibiganiro Bya Vuba',
    tools: 'Ibikoresho',
    services: 'Serivisi',
    checklist: 'Urutonde',
    settings: 'Igenamiterere',
    noChats: 'Nta biganiro birahari',
    plan: 'Gahunda y\'Ubuntu',
    user: 'Umukoresha',
    aiTools: 'Ibikoresho bya AI',
  },
} as const

function relativeTime(ts: number, lang: 'en' | 'rw'): string {
  const diff = Date.now() - ts
  const mins = Math.round(diff / 60000)
  if (mins < 1) return lang === 'rw' ? 'nonaha' : 'now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.round(hrs / 24)
  return `${days}d`
}

export function KwamiLogo({ className = '' }: { className?: string }) {
  return (
    <span
      className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-kwami-green to-emerald-500 text-white shadow-sm ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <path
          d="M12 3l2.2 4.6L19 9l-3.4 3.4.8 4.9L12 15l-4.4 2.3.8-4.9L5 9l4.8-1.4L12 3z"
          fill="currentColor"
        />
      </svg>
    </span>
  )
}

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

function ChatSidebar({
  conversations,
  activeId,
  search,
  onSearchChange,
  onSelect,
  onNewChat,
  onDelete,
  onClose,
}: ChatSidebarProps) {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const t = SIDEBAR_TEXT[lang]

  const filtered = conversations
    .filter((c) => c.title.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <div className="flex h-full w-72 flex-col border-r border-gray-100 bg-white">
      {/* Brand */}
      <div className="flex items-center justify-between px-4 py-4">
        <button
          type="button"
          onClick={() => navigate(ROUTE_PATHS.landing)}
          className="flex items-center gap-2.5"
        >
          <KwamiLogo />
          <span className="text-lg font-bold text-kwami-green-dark">Kwami AI</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 lg:hidden"
          aria-label="Close sidebar"
        >
          <Icon path="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </button>
      </div>

      {/* New chat */}
      <div className="px-3">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-kwami-green px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-kwami-green-dark"
        >
          <Icon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z" />
          {t.newChat}
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-1 pt-3">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon path="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" />
          </span>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.search}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-kwami-green focus:bg-white focus:outline-none focus:ring-2 focus:ring-kwami-green/15"
          />
        </div>
      </div>

      {/* Recent chats */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <p className="px-2 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          {t.recent}
        </p>
        <ul className="space-y-0.5">
          {filtered.length === 0 && (
            <li className="px-2 py-2 text-sm text-gray-400">{t.noChats}</li>
          )}
          {filtered.map((c) => (
            <li key={c.id}>
              <div
                className={`group flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition ${
                  c.id === activeId
                    ? 'bg-kwami-green-light text-kwami-green-dark'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(c.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <span className="text-gray-400">
                    <Icon path="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{c.title}</span>
                </button>
                <span className="shrink-0 text-[11px] text-gray-400 group-hover:hidden">
                  {relativeTime(c.updatedAt, lang)}
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(c.id)}
                  className="hidden shrink-0 rounded p-1 text-gray-400 hover:bg-white hover:text-red-500 group-hover:block"
                  aria-label="Delete conversation"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M6 7h12l-1 13H7L6 7zm3-3h6l1 2H8l1-2z" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Tools */}
        <p className="px-2 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
          {t.tools}
        </p>
        <nav className="space-y-0.5">
          <button
            type="button"
            onClick={() => navigate(ROUTE_PATHS.services)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            <span className="text-gray-400">
              <Icon path="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
            </span>
            {t.services}
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTE_PATHS.checklist)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            <span className="text-gray-400">
              <Icon path="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </span>
            {t.checklist}
          </button>
          <button
            type="button"
            onClick={() => navigate(ROUTE_PATHS.profile)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            <span className="text-gray-400">
              <Icon path="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.03 7.03 0 0 0-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.48.48 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94 0 .32.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.13.24.42.32.66.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.25.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.24.1.53.02.66-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.03-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z" />
            </span>
            {t.settings}
          </button>
        </nav>
      </div>

      {/* User card */}
      <div className="border-t border-gray-100 p-3">
        <button
          type="button"
          onClick={() => navigate(ROUTE_PATHS.profile)}
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-gray-50"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-kwami-green-light font-semibold text-kwami-green">
            {DEMO_PROFILE.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-800">{DEMO_PROFILE.name}</p>
            <p className="truncate text-xs text-gray-400">{DEMO_PROFILE.email}</p>
          </div>
        </button>
      </div>
    </div>
  )
}

export default ChatSidebar

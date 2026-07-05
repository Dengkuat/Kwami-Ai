import { useLanguage } from '../../context/language'
import { APP_NAME } from '../../config/brand'
import { landingContent } from '../../pages/landingContent'

type AppHeaderProps = {
  onOpenMenu: () => void
}

function AppHeader({ onOpenMenu }: AppHeaderProps) {
  const { lang, toggleLang } = useLanguage()
  const language = lang === 'rw' ? 'kinyarwanda' : 'english'
  const t = landingContent[language]

  return (
    <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 pt-[env(safe-area-inset-top)] backdrop-blur supports-[backdrop-filter]:bg-white/80 lg:hidden">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-0">
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex h-10 w-10 items-center justify-center rounded-full text-kwami-green hover:bg-kwami-green-light lg:hidden"
          aria-label={t.menuLabel}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>

        <h1 className="text-lg font-bold text-kwami-green">{APP_NAME}</h1>

        <button
          type="button"
          onClick={toggleLang}
          className="min-w-10 text-sm font-semibold text-kwami-green hover:text-kwami-green-dark"
          aria-label="Switch language"
        >
          {t.headerLang}
        </button>
      </div>
    </header>
  )
}

export default AppHeader

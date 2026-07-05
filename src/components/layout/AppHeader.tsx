import { useLanguage } from '../../context/language'
import { landingContent } from '../../pages/landingContent'

function AppHeader() {
  const { lang, toggleLang } = useLanguage()
  const language = lang === 'rw' ? 'kinyarwanda' : 'english'
  const t = landingContent[language]

  return (
    <header className="sticky top-0 z-20 border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
        <div className="h-10 w-10" aria-hidden="true" />

        <h1 className="text-lg font-bold text-kwami-green">Kigali Kwima</h1>

        <button
          type="button"
          onClick={toggleLang}
          className="text-sm font-medium text-kwami-green hover:text-kwami-green-dark"
          aria-label="Switch language"
        >
          {t.headerLang}
        </button>
      </div>
    </header>
  )
}

export default AppHeader

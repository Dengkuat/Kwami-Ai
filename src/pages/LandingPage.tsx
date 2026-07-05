import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import SideMenu from '../components/SideMenu'
import { ROUTE_PATHS } from '../routes/routePaths'
import { landingContent, type Language } from './landingContent'
import './LandingPage.css'

const featureIcons = {
  irembo: {
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 13h8v2H8v-2zm0 4h5v2H8v-2z" />
      </svg>
    ),
  },
  health: {
    iconBg: '#fef9c3',
    iconColor: '#ca8a04',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v4h4v2h-4v4h-2v-4H7v-2h4V7z" />
      </svg>
    ),
  },
  legal: {
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 3L4 9v2h1v10h6v-6h2v6h6V11h1V9l-8-6zm0 2.5L18 9H6l6-3.5z" />
      </svg>
    ),
  },
} as const

function LandingPage() {
  const navigate = useNavigate()
  const [language, setLanguage] = useState<Language>('kinyarwanda')
  const [menuOpen, setMenuOpen] = useState(false)
  const t = landingContent[language]

  useEffect(() => {
    document.documentElement.lang = language === 'kinyarwanda' ? 'rw' : 'en'
  }, [language])

  return (
    <div className="landing-page">
      <SideMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        language={language}
      />

      <header className="landing-header">
        <button
          type="button"
          className="landing-header__menu"
          aria-label={t.menuLabel}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
        <h1 className="landing-header__title">Kigali Kwima</h1>
        <span className="landing-header__lang">{t.headerLang}</span>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="landing-hero__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="7" y="9" width="3" height="3" rx="0.5" />
              <rect x="14" y="9" width="3" height="3" rx="0.5" />
              <path d="M9 15h6v1.5c0 .83-.67 1.5-1.5 1.5h-3c-.83 0-1.5-.67-1.5-1.5V15z" />
            </svg>
          </div>
          <h2 className="landing-hero__title">{t.heroTitle}</h2>
          <p className="landing-hero__subtitle">{t.heroSubtitle}</p>
        </section>

        <section className="landing-language" aria-labelledby="language-heading">
          <p id="language-heading" className="landing-language__label">
            {t.languageLabel}
          </p>
          <div className="landing-language__options" role="group" aria-label={t.languageLabel}>
            <button
              type="button"
              className={`landing-language__option${
                language === 'kinyarwanda' ? ' landing-language__option--active' : ''
              }`}
              aria-pressed={language === 'kinyarwanda'}
              onClick={() => setLanguage('kinyarwanda')}
            >
              <span className="landing-language__option-title">Kinyarwanda</span>
              <span className="landing-language__option-sub">{t.kinyarwandaSub}</span>
            </button>
            <button
              type="button"
              className={`landing-language__option${
                language === 'english' ? ' landing-language__option--active' : ''
              }`}
              aria-pressed={language === 'english'}
              onClick={() => setLanguage('english')}
            >
              <span className="landing-language__option-title">English</span>
              <span className="landing-language__option-sub">{t.englishSub}</span>
            </button>
          </div>
        </section>

        <button
          type="button"
          className="landing-cta"
          onClick={() => navigate(ROUTE_PATHS.chat)}
        >
          {t.cta}
          <span aria-hidden="true">→</span>
        </button>

        <section className="landing-features" aria-label={t.featuresAria}>
          {t.features.map(({ id, title, description }) => {
            const { iconBg, iconColor, icon } = featureIcons[id as keyof typeof featureIcons]
            return (
              <button
                key={id}
                type="button"
                className="landing-feature-card"
                onClick={() => navigate(ROUTE_PATHS.chat)}
              >
                <span
                  className="landing-feature-card__icon"
                  style={{ backgroundColor: iconBg, color: iconColor }}
                >
                  {icon}
                </span>
                <span className="landing-feature-card__content">
                  <span className="landing-feature-card__title">{title}</span>
                  <span className="landing-feature-card__desc">{description}</span>
                </span>
              </button>
            )
          })}
        </section>
      </main>

      <BottomNav language={language} />
    </div>
  )
}

export default LandingPage

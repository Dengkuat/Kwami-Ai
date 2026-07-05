import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage, type Lang } from '../../context/language'
import { ROUTE_PATHS } from '../../routes/routePaths'
import './onboarding.css'

export const ONBOARDED_SESSION_KEY = 'kwami.onboarded.session'

export function hasOnboardedThisSession(): boolean {
  if (typeof window === 'undefined') return true
  try {
    return window.sessionStorage.getItem(ONBOARDED_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function markOnboarded() {
  try {
    window.sessionStorage.setItem(ONBOARDED_SESSION_KEY, '1')
  } catch {
    // ignore
  }
}

interface Slide {
  key: string
  title: { en: string; rw: string }
  body: { en: string; rw: string }
  icon: React.ReactNode
}

const SLIDES: Slide[] = [
  {
    key: 'welcome',
    title: { en: 'Welcome to Kwami AI', rw: 'Ikaze kuri Kwami AI' },
    body: {
      en: 'Your friendly AI companion for navigating Rwandan government services with ease.',
      rw: 'Umufasha wawe wa AI ukworohereza kubona serivisi za Leta y\'u Rwanda.',
    },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-14 w-14 text-white">
        <path
          d="M12 3l2.4 5 5.6.8-4 4 1 5.6L12 21l-5-2.6 1-5.6-4-4 5.6-.8L12 3z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    key: 'what',
    title: { en: 'Everything in one place', rw: 'Byose ahantu hamwe' },
    body: {
      en: 'Chat for step-by-step guidance, build document checklists, and find nearby offices on embedded maps.',
      rw: 'Ganira ubona amabwiriza y\'intambwe, ukore urutonde rw\'impapuro, kandi ubone ibiro biri hafi ku makarita.',
    },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-14 w-14 text-white">
        <path
          d="M4 5h16v10H8l-4 4V5z"
          fill="currentColor"
          opacity="0.9"
        />
        <path d="M8 9h8M8 12h5" stroke="#1a6b42" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'start',
    title: { en: 'Ready to start?', rw: 'Witeguye gutangira?' },
    body: {
      en: 'Ask a question or tap a quick action. Kwami replies in your language, in real time.',
      rw: 'Baza ikibazo cyangwa ukande ku bikorwa byihuse. Kwami asubiza mu rurimi rwawe, ako kanya.',
    },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-14 w-14 text-white">
        <path d="M5 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const TEXT = {
  en: { skip: 'Skip', back: 'Back', next: 'Next', start: 'Get started', chooseLang: 'Language' },
  rw: { skip: 'Simbuka', back: 'Subira', next: 'Komeza', start: 'Tangira', chooseLang: 'Ururimi' },
}

function Onboarding() {
  const navigate = useNavigate()
  const { lang, setLang } = useLanguage()
  const [visible, setVisible] = useState(() => !hasOnboardedThisSession())
  const [step, setStep] = useState(0)

  if (!visible) return null

  const t = TEXT[lang]
  const slide = SLIDES[step]
  const isLast = step === SLIDES.length - 1

  const dismiss = (goToChat: boolean) => {
    markOnboarded()
    setVisible(false)
    if (goToChat) navigate(`${ROUTE_PATHS.chat}?lang=${lang}`)
  }

  const langOptions: { code: Lang; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'rw', label: 'Kinyarwanda' },
  ]

  return (
    <div className="kw-onboard-overlay">
      <div className="kw-blob kw-blob--1" />
      <div className="kw-blob kw-blob--2" />

      {/* Top bar: language + skip */}
      <div className="relative flex items-center justify-between px-5 pt-5 sm:px-8">
        <div
          className="flex overflow-hidden rounded-full border border-kwami-green/20 bg-white/80 backdrop-blur"
          role="group"
          aria-label={t.chooseLang}
        >
          {langOptions.map((opt) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => setLang(opt.code)}
              aria-pressed={lang === opt.code}
              className={`px-3 py-1.5 text-xs font-semibold transition ${
                lang === opt.code
                  ? 'bg-kwami-green text-white'
                  : 'text-kwami-green-dark hover:bg-kwami-green-light'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => dismiss(false)}
          className="rounded-full px-4 py-1.5 text-sm font-medium text-gray-500 hover:bg-white/70 hover:text-gray-700"
        >
          {t.skip}
        </button>
      </div>

      {/* Slide content */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div key={slide.key} className="kw-slide flex flex-col items-center">
          <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
            <span className="kw-ring" />
            <span className="kw-ring kw-ring--2" />
            <span className="kw-hero-icon flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-kwami-green to-emerald-500 shadow-lg shadow-kwami-green/30">
              {slide.icon}
            </span>
          </div>
          <h2 className="max-w-md text-2xl font-bold text-gray-800 sm:text-3xl">
            {slide.title[lang]}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500 sm:text-base">
            {slide.body[lang]}
          </p>
        </div>
      </div>

      {/* Dots */}
      <div className="relative flex items-center justify-center gap-2 pb-4">
        {SLIDES.map((s, i) => (
          <button
            key={s.key}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setStep(i)}
            className={`h-2 rounded-full transition-all ${
              i === step ? 'w-6 bg-kwami-green' : 'w-2 bg-kwami-green/25'
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="relative flex items-center justify-between gap-3 px-6 pb-8 sm:px-8">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-full px-5 py-2.5 text-sm font-semibold text-gray-500 transition hover:bg-white/70 disabled:invisible"
        >
          {t.back}
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={() => dismiss(true)}
            className="flex items-center gap-2 rounded-full bg-kwami-green px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-kwami-green/30 transition hover:bg-kwami-green-dark"
          >
            {t.start}
            <span aria-hidden="true">→</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(SLIDES.length - 1, s + 1))}
            className="flex items-center gap-2 rounded-full bg-kwami-green px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-kwami-green/30 transition hover:bg-kwami-green-dark"
          >
            {t.next}
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default Onboarding

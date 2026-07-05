import AppShell from '../components/layout/AppShell'
import { useLanguage } from '../context/language'
import { DEMO_PROFILE } from '../data/demoProfile'

const PROFILE_TEXT = {
  en: {
    title: 'Your Profile',
    subtitle: 'Demo account for submission preview',
    email: 'Email',
    location: 'Location',
    memberSince: 'Member since',
    demoNote: 'This is static demo data — no sign-in required.',
  },
  rw: {
    title: 'Umwirondoro Wawe',
    subtitle: 'Konti y\'icyitegererezo yo gutanga porojeti',
    email: 'Imeri',
    location: 'Aho utuye',
    memberSince: 'Umunyamuryango kuva',
    demoNote: 'Amakuru y\'icyitegererezo gusa — nta kwiyandikisha bisabwa.',
  },
} as const

function ProfilePage() {
  const { lang } = useLanguage()
  const t = PROFILE_TEXT[lang]

  return (
    <AppShell>
      <div className="px-4 py-6">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-kwami-green to-emerald-600 px-6 py-8 text-center text-white">
            <span className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-2xl font-bold ring-4 ring-white/30">
              {DEMO_PROFILE.initials}
            </span>
            <h2 className="text-xl font-bold">{DEMO_PROFILE.name}</h2>
            <p className="mt-1 text-sm text-emerald-100">{t.subtitle}</p>
          </div>

          <div className="space-y-4 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{t.email}</p>
              <p className="mt-1 text-sm font-medium text-gray-800">{DEMO_PROFILE.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{t.location}</p>
              <p className="mt-1 text-sm font-medium text-gray-800">{DEMO_PROFILE.location}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{t.memberSince}</p>
              <p className="mt-1 text-sm font-medium text-gray-800">{DEMO_PROFILE.memberSince}</p>
            </div>
          </div>
        </div>

        <p className="mt-4 rounded-xl bg-kwami-green-light px-4 py-3 text-center text-xs text-kwami-green-dark">
          {t.demoNote}
        </p>
      </div>
    </AppShell>
  )
}

export default ProfilePage

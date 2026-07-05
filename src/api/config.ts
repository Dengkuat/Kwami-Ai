export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1'

export const AUTH_STORAGE_KEY = 'kwami-auth-tokens'
export const LOCALE_STORAGE_KEY = 'kwami-locale'

export type ApiLocale = 'en' | 'rw'

export function getStoredLocale(): ApiLocale {
  const value = localStorage.getItem(LOCALE_STORAGE_KEY)
  return value === 'rw' ? 'rw' : 'en'
}

export function setStoredLocale(locale: ApiLocale) {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}

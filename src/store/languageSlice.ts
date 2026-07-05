import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Language } from '../pages/landingContent'

export interface LanguageState {
  current: Language
}

const STORAGE_KEY = 'kwami.language'

function readStoredLanguage(): Language {
  if (typeof window === 'undefined') return 'kinyarwanda'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'english' || stored === 'kinyarwanda' ? stored : 'kinyarwanda'
}

function persist(language: Language) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, language)
  }
}

const initialState: LanguageState = {
  current: readStoredLanguage(),
}

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      state.current = action.payload
      persist(state.current)
    },
    toggleLanguage(state) {
      state.current = state.current === 'kinyarwanda' ? 'english' : 'kinyarwanda'
      persist(state.current)
    },
  },
})

export const { setLanguage, toggleLanguage } = languageSlice.actions
export default languageSlice.reducer

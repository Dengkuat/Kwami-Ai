import { configureStore } from '@reduxjs/toolkit'
import checklistReducer, { CHECKLISTS_STORAGE_KEY } from './checklistSlice'

export const store = configureStore({
  reducer: {
    checklist: checklistReducer,
  },
})

// Persist checklists to localStorage on every change so they survive reloads.
if (typeof window !== 'undefined') {
  let lastSerialized: string | null = null
  store.subscribe(() => {
    try {
      const serialized = JSON.stringify(store.getState().checklist)
      if (serialized !== lastSerialized) {
        lastSerialized = serialized
        window.localStorage.setItem(CHECKLISTS_STORAGE_KEY, serialized)
      }
    } catch {
      // Ignore write failures (e.g. storage full or unavailable).
    }
  })
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

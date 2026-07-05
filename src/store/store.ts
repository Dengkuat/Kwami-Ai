import { configureStore } from '@reduxjs/toolkit'
import checklistReducer from './checklistSlice'
import chatReducer from './chatSlice'
import languageReducer from './languageSlice'

export const store = configureStore({
  reducer: {
    checklist: checklistReducer,
    chat: chatReducer,
    language: languageReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

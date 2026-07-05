import { configureStore } from '@reduxjs/toolkit'

const emptyRootReducer = (state = {}) => state

export const store = configureStore({
  reducer: emptyRootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

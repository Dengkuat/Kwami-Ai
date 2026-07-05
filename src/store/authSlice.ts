import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authApi, clearTokens, loadTokens, saveTokens } from '../api'
import type { TokenPair, UserResponse } from '../api/types'

type AuthState = {
  user: UserResponse | null
  tokens: TokenPair | null
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error'
  error: string | null
}

const initialState: AuthState = {
  user: null,
  tokens: loadTokens(),
  status: 'idle',
  error: null,
}

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    const stored = loadTokens()
    const devEmail = import.meta.env.VITE_DEV_EMAIL as string | undefined
    const devPassword = import.meta.env.VITE_DEV_PASSWORD as string | undefined

    if (stored?.access_token) {
      try {
        const user = await authApi.me()
        return { user, tokens: loadTokens()! }
      } catch {
        if (stored.refresh_token) {
          try {
            const tokens = await authApi.refresh(stored.refresh_token)
            saveTokens(tokens)
            const user = await authApi.me()
            return { user, tokens }
          } catch {
            clearTokens()
          }
        } else {
          clearTokens()
        }
      }
    }

    if (devEmail && devPassword) {
      const tokens = await authApi.login(devEmail, devPassword)
      saveTokens(tokens)
      const user = await authApi.me()
      return { user, tokens }
    }

    return rejectWithValue('Not authenticated')
  },
)

export const ensureAuthenticated = createAsyncThunk(
  'auth/ensureAuthenticated',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState }
    if (state.auth.status === 'authenticated' && state.auth.user) {
      return { user: state.auth.user, tokens: state.auth.tokens! }
    }

    try {
      return await dispatch(initializeAuth()).unwrap()
    } catch {
      const devEmail = import.meta.env.VITE_DEV_EMAIL as string | undefined
      const devPassword = import.meta.env.VITE_DEV_PASSWORD as string | undefined

      if (devEmail && devPassword) {
        return rejectWithValue('Set VITE_DEV_EMAIL and VITE_DEV_PASSWORD in .env.local')
      }

      return rejectWithValue('Sign in required for this feature')
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      clearTokens()
      state.user = null
      state.tokens = null
      state.status = 'unauthenticated'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.tokens = action.payload.tokens
        state.status = 'authenticated'
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.user = null
        state.tokens = null
        state.status = 'unauthenticated'
      })
      .addCase(ensureAuthenticated.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(ensureAuthenticated.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.tokens = action.payload.tokens
        state.status = 'authenticated'
      })
      .addCase(ensureAuthenticated.rejected, (state, action) => {
        state.status = 'unauthenticated'
        state.error = (action.payload as string) ?? action.error.message ?? 'Authentication failed'
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer

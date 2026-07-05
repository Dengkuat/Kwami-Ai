import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { sendToGemini, type ChatTurn } from '../utils/gemini'
import type { RootState } from './store'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface ChatState {
  messages: ChatMessage[]
  status: 'idle' | 'loading'
  error: string | null
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Muraho! I'm Kwami, your assistant for Kigali Kwima. Ask me anything about Rwandan government services, or any question you have.",
}

const initialState: ChatState = {
  messages: [WELCOME_MESSAGE],
  status: 'idle',
  error: null,
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export const sendMessage = createAsyncThunk<
  ChatMessage,
  string,
  { state: RootState; rejectValue: string }
>('chat/sendMessage', async (text, { getState, rejectWithValue }) => {
  const history: ChatTurn[] = getState().chat.messages
    .filter((message) => message.id !== 'welcome')
    .map((message) => ({ role: message.role, content: message.content }))

  history.push({ role: 'user', content: text })

  const language = getState().language.current

  try {
    const reply = await sendToGemini(history, language)
    return { id: createId(), role: 'assistant', content: reply }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
    return rejectWithValue(message)
  }
})

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearChat() {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.status = 'loading'
        state.error = null
        state.messages.push({
          id: createId(),
          role: 'user',
          content: action.meta.arg,
        })
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<ChatMessage>) => {
        state.status = 'idle'
        state.messages.push(action.payload)
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'idle'
        state.error = action.payload ?? 'Something went wrong. Please try again.'
        state.messages.push({
          id: createId(),
          role: 'assistant',
          content: `⚠️ ${state.error}`,
        })
      })
  },
})

export const { clearChat } = chatSlice.actions
export default chatSlice.reducer

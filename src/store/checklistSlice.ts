import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'

export const CHECKLISTS_STORAGE_KEY = 'kwami.checklists.v1'

export interface ChecklistItem {
  id: string
  text: string
  done: boolean
}

export interface Checklist {
  id: string
  title: string
  items: ChecklistItem[]
  createdAt: number
}

export interface ChecklistState {
  lists: Checklist[]
}

function makeItem(text: string): ChecklistItem {
  return { id: nanoid(), text: text.trim(), done: false }
}

function makeList(title: string, items: string[] = []): Checklist {
  return {
    id: nanoid(),
    title: title.trim() || 'Untitled checklist',
    items: items.map((text) => makeItem(text)).filter((item) => item.text.length > 0),
    createdAt: Date.now(),
  }
}

/**
 * Load persisted checklists from localStorage. Returns a seed checklist on the
 * very first run so the page isn't empty, and falls back gracefully if the
 * stored value is missing or corrupt.
 */
export function loadPersistedState(): ChecklistState {
  if (typeof window === 'undefined') {
    return { lists: [] }
  }

  try {
    const raw = window.localStorage.getItem(CHECKLISTS_STORAGE_KEY)
    if (!raw) {
      return {
        lists: [
          makeList('Passport Application', [
            'National ID card',
            'Recent passport photo (4×5 cm, white background)',
            'Proof of payment (application fee)',
            'Completed application form',
          ]),
        ],
      }
    }

    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || !Array.isArray((parsed as ChecklistState).lists)) {
      return { lists: [] }
    }

    // Defensively normalise the stored shape.
    const lists = (parsed as ChecklistState).lists
      .filter((list) => list && typeof list.id === 'string')
      .map((list) => ({
        id: list.id,
        title: typeof list.title === 'string' ? list.title : 'Untitled checklist',
        createdAt: typeof list.createdAt === 'number' ? list.createdAt : Date.now(),
        items: Array.isArray(list.items)
          ? list.items
              .filter((item) => item && typeof item.id === 'string')
              .map((item) => ({
                id: item.id,
                text: typeof item.text === 'string' ? item.text : '',
                done: Boolean(item.done),
              }))
          : [],
      }))

    return { lists }
  } catch {
    return { lists: [] }
  }
}

const initialState: ChecklistState = loadPersistedState()

const checklistSlice = createSlice({
  name: 'checklist',
  initialState,
  reducers: {
    addChecklist: {
      reducer(state, action: PayloadAction<Checklist>) {
        state.lists.unshift(action.payload)
      },
      prepare(payload: { title: string; items?: string[] }) {
        return { payload: makeList(payload.title, payload.items ?? []) }
      },
    },
    renameChecklist(state, action: PayloadAction<{ listId: string; title: string }>) {
      const list = state.lists.find((l) => l.id === action.payload.listId)
      if (list) {
        list.title = action.payload.title.trim() || 'Untitled checklist'
      }
    },
    deleteChecklist(state, action: PayloadAction<string>) {
      state.lists = state.lists.filter((l) => l.id !== action.payload)
    },
    addItem: {
      reducer(state, action: PayloadAction<{ listId: string; item: ChecklistItem }>) {
        const list = state.lists.find((l) => l.id === action.payload.listId)
        if (list && action.payload.item.text.length > 0) {
          list.items.push(action.payload.item)
        }
      },
      prepare(payload: { listId: string; text: string }) {
        return { payload: { listId: payload.listId, item: makeItem(payload.text) } }
      },
    },
    editItem(
      state,
      action: PayloadAction<{ listId: string; itemId: string; text: string }>,
    ) {
      const list = state.lists.find((l) => l.id === action.payload.listId)
      const item = list?.items.find((i) => i.id === action.payload.itemId)
      if (item) {
        item.text = action.payload.text.trim()
      }
    },
    removeItem(state, action: PayloadAction<{ listId: string; itemId: string }>) {
      const list = state.lists.find((l) => l.id === action.payload.listId)
      if (list) {
        list.items = list.items.filter((i) => i.id !== action.payload.itemId)
      }
    },
    toggleItem(state, action: PayloadAction<{ listId: string; itemId: string }>) {
      const list = state.lists.find((l) => l.id === action.payload.listId)
      const item = list?.items.find((i) => i.id === action.payload.itemId)
      if (item) {
        item.done = !item.done
      }
    },
    clearCompleted(state, action: PayloadAction<string>) {
      const list = state.lists.find((l) => l.id === action.payload)
      if (list) {
        list.items = list.items.filter((i) => !i.done)
      }
    },
  },
})

export const {
  addChecklist,
  renameChecklist,
  deleteChecklist,
  addItem,
  editItem,
  removeItem,
  toggleItem,
  clearCompleted,
} = checklistSlice.actions

export default checklistSlice.reducer

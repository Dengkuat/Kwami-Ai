import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface ChecklistItem {
  id: string
  title: string
  description: string
  completed: boolean
}

export interface ChecklistTemplate {
  applicationName: string
  items: Omit<ChecklistItem, 'completed'>[]
}

export interface ChecklistState {
  serviceId: string
  applicationName: string
  items: ChecklistItem[]
}

// Real-world checklist data keyed by service id.
// `higher-education-equivalence` uses real requirements; the rest are placeholders.
export const CHECKLIST_TEMPLATES: Record<string, ChecklistTemplate> = {
  'higher-education-equivalence': {
    applicationName: 'Higher Education Equivalence',
    items: [
      {
        id: 'passport-photo',
        title: 'Passport Photo',
        description: '4×5 cm, white background',
      },
      {
        id: 'notarized-transcript',
        title: 'Notarized Academic Transcript',
        description: 'Official transcript, notarized',
      },
      {
        id: 'final-certificate',
        title: 'Final Certificate',
        description: 'Original final degree certificate',
      },
    ],
  },
  'national-id': {
    applicationName: 'National ID Application',
    items: [
      { id: 'birth-certificate', title: 'Birth Certificate', description: 'Digital copy uploaded' },
      { id: 'passport-photo', title: 'Passport Photo', description: '4×5 cm, white background' },
      {
        id: 'proof-of-residence',
        title: 'Proof of Residence',
        description: 'Sector-level certificate',
      },
      {
        id: 'application-fee',
        title: 'Application Fee Receipt',
        description: 'RWF 500, pay online',
      },
    ],
  },
  'land-transfer': {
    applicationName: 'Land Title Transfer',
    items: [
      { id: 'title-deed', title: 'Land Title Deed', description: 'Original title document' },
      { id: 'tax-clearance', title: 'Tax Clearance', description: 'Cleared property taxes' },
      { id: 'id-copies', title: 'ID Copies', description: 'Buyer and seller IDs' },
      { id: 'transfer-fee', title: 'Transfer Fee Receipt', description: 'Pay at RDB' },
    ],
  },
  'birth-certificate': {
    applicationName: 'Birth Certificate',
    items: [
      { id: 'notification', title: 'Birth Notification', description: 'From hospital or sector' },
      { id: 'parents-id', title: "Parents' IDs", description: 'Copies of both parents' },
      { id: 'witness', title: 'Witness Declaration', description: 'If born at home' },
    ],
  },
}

export const DEFAULT_SERVICE_ID = 'higher-education-equivalence'

function buildState(serviceId: string): ChecklistState {
  const template = CHECKLIST_TEMPLATES[serviceId] ?? CHECKLIST_TEMPLATES[DEFAULT_SERVICE_ID]
  const resolvedId = CHECKLIST_TEMPLATES[serviceId] ? serviceId : DEFAULT_SERVICE_ID
  return {
    serviceId: resolvedId,
    applicationName: template.applicationName,
    items: template.items.map((item) => ({ ...item, completed: false })),
  }
}

const initialState: ChecklistState = buildState(DEFAULT_SERVICE_ID)

const checklistSlice = createSlice({
  name: 'checklist',
  initialState,
  reducers: {
    loadChecklist(_state, action: PayloadAction<string>) {
      return buildState(action.payload)
    },
    toggleItem(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.id === action.payload)
      if (item) {
        item.completed = !item.completed
      }
    },
    completeItem(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.id === action.payload)
      if (item) {
        item.completed = true
      }
    },
    resetChecklist(state) {
      state.items.forEach((item) => {
        item.completed = false
      })
    },
  },
})

export const { loadChecklist, toggleItem, completeItem, resetChecklist } = checklistSlice.actions
export default checklistSlice.reducer

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MarkdownMessage from '../components/chat/MarkdownMessage'
import ChatSidebar, { KwamiLogo, type ConversationSummary } from '../components/chat/ChatSidebar'
import {
  sendChatMessage,
  streamChatMessage,
  uploadChatMessage,
  type ChatHistoryMessage,
} from '../api/chat'
import { MAX_HISTORY_MESSAGES } from '../config/api'
import { useAppDispatch } from '../hooks'
import { addChecklist } from '../store/checklistSlice'
import { deriveChecklistTitle, parseChecklistItems } from '../utils/parseChecklist'
import { ROUTE_PATHS } from '../routes/routePaths'
import { useLanguage } from '../context/language'
import '../components/chat/chat.css'

type Feedback = 'up' | 'down' | null

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  isError?: boolean
  feedback?: Feedback
}

interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

const CONVERSATIONS_STORAGE_KEY = 'kwami.conversations.v1'

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const UI_TEXT = {
  en: {
    subtitle: 'Your guide to Rwandan government services',
    newChatTitle: 'New Chat',
    emptyTitle: 'How can I help you today?',
    emptyBody: 'Ask about IDs, passports, land, health, business and more.',
    placeholder: 'Ask me anything...',
    errorGeneric: 'Something went wrong. Please try again.',
    errorNetwork: 'Could not reach the assistant. Check your connection and try again.',
    share: 'Share Chat',
    clear: 'Clear chat',
    save: 'Save as checklist',
    aiTools: 'AI Tools',
    disclaimer: 'Kwami can make mistakes. Consider checking important information.',
  },
  rw: {
    subtitle: 'Umuyobozi wawe wa serivisi za Leta y\'u Rwanda',
    newChatTitle: 'Ikiganiro Gishya',
    emptyTitle: 'Nagufasha iki uyu munsi?',
    emptyBody: 'Baza ku ndangamuntu, pasiporo, ubutaka, ubuzima, ubucuruzi n\'ibindi.',
    placeholder: 'Baza ikibazo cyose...',
    errorGeneric: 'Habaye ikibazo. Ongera ugerageze.',
    errorNetwork: 'Ntibyashobotse kugera ku mufasha. Reba interineti maze wongere ugerageze.',
    share: 'Sangiza',
    clear: 'Siba ikiganiro',
    save: 'Bika nk\'urutonde',
    aiTools: 'Ibikoresho bya AI',
    disclaimer: 'Kwami ashobora kwibeshya. Genzura amakuru y\'ingenzi.',
  },
} as const

interface QuickAction {
  label: { en: string; rw: string }
  q: { en: string; rw: string }
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: { en: 'Apply for National ID', rw: 'Gusaba Indangamuntu' },
    q: {
      en: 'How do I apply for or replace a National ID card in Rwanda? What are the steps, fees and required documents?',
      rw: 'Nasaba nte cyangwa nsimbuze indangamuntu mu Rwanda? Ni izihe ntambwe, amafaranga n\'impapuro bisabwa?',
    },
  },
  {
    label: { en: 'Passport steps', rw: 'Intambwe za pasiporo' },
    q: {
      en: 'What are the steps to get a passport in Rwanda? Include required documents, fees and where to apply.',
      rw: 'Ni izihe ntambwe zo kubona pasiporo mu Rwanda? Shyiramo impapuro zisabwa, amafaranga n\'aho usaba.',
    },
  },
  {
    label: { en: 'Irembo help', rw: 'Ubufasha bwa Irembo' },
    q: {
      en: 'How do I use Irembo to apply for documents like a birth certificate, national ID, or permit in Rwanda?',
      rw: 'Nakoresha nte Irembo gusaba impapuro nk\'impamyabumenyi y\'amavuko, indangamuntu, cyangwa uruhushya mu Rwanda?',
    },
  },
  {
    label: { en: 'Find nearest office', rw: 'Shaka ibiro biri hafi' },
    q: {
      en: 'Where is the nearest government service office to me and how do I find it on the map?',
      rw: 'Ibiro bya Leta biri hafi yanjye biri he kandi nabishaka nte ku ikarita?',
    },
  },
  {
    label: { en: 'Health insurance (Mutuelle)', rw: 'Mutuelle de Santé' },
    q: {
      en: 'Tell me about Mutuelle de Santé and how to find nearby clinics and hospitals in Rwanda.',
      rw: 'Mbwira ku Mutuelle de Santé n\'uko nabona amavuriro n\'ibitaro biri hafi mu Rwanda.',
    },
  },
  {
    label: { en: 'Register a business', rw: 'Kwandikisha ubucuruzi' },
    q: {
      en: 'How do I register a business in Rwanda? Walk me through the steps and requirements.',
      rw: 'Nandikisha nte ubucuruzi mu Rwanda? Nyobora mu ntambwe n\'ibisabwa.',
    },
  },
]

function loadConversations(): Conversation[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CONVERSATIONS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Conversation[]
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((c) => c && typeof c.id === 'string')
      .map((c) => ({
        id: c.id,
        title: typeof c.title === 'string' ? c.title : 'New Chat',
        createdAt: typeof c.createdAt === 'number' ? c.createdAt : Date.now(),
        updatedAt: typeof c.updatedAt === 'number' ? c.updatedAt : Date.now(),
        messages: Array.isArray(c.messages)
          ? c.messages
              .filter((m) => m && (m.role === 'user' || m.role === 'assistant'))
              .map((m) => ({
                id: typeof m.id === 'string' ? m.id : uid(),
                role: m.role,
                content: typeof m.content === 'string' ? m.content : '',
                isError: Boolean(m.isError),
                feedback: m.feedback === 'up' || m.feedback === 'down' ? m.feedback : null,
              }))
          : [],
      }))
  } catch {
    return []
  }
}

function persistConversations(conversations: Conversation[]) {
  try {
    // Keep only conversations that actually have messages.
    const toStore = conversations.filter((c) => c.messages.length > 0).slice(0, 40)
    window.localStorage.setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(toStore))
  } catch {
    // ignore
  }
}

function newConversation(title: string): Conversation {
  const now = Date.now()
  return { id: uid(), title, messages: [], createdAt: now, updatedAt: now }
}

/* ---------- small presentational icons ---------- */

function Icon({ path, className = 'h-5 w-5' }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

function ChatPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { lang, setLang } = useLanguage()

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const loaded = loadConversations()
    return loaded.length > 0 ? loaded : [newConversation('New Chat')]
  })
  const [activeId, setActiveId] = useState<string>(() => conversations[0].id)
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const messagesRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Refs mirror state so send logic can read the latest values synchronously.
  const convosRef = useRef<Conversation[]>(conversations)
  convosRef.current = conversations
  const activeIdRef = useRef<string>(activeId)
  activeIdRef.current = activeId
  const langRef = useRef(lang)
  langRef.current = lang
  const streamingRef = useRef(isStreaming)
  streamingRef.current = isStreaming

  const t = UI_TEXT[lang]

  const activeConversation =
    conversations.find((c) => c.id === activeId) ?? conversations[0]
  const messages = activeConversation?.messages ?? []

  useEffect(() => {
    persistConversations(conversations)
  }, [conversations])

  const scrollToBottom = useCallback(() => {
    const el = messagesRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [conversations, isStreaming, scrollToBottom])

  const buildHistory = useCallback((msgs: ChatMessage[]): ChatHistoryMessage[] => {
    return msgs
      .filter((m) => !m.isError && m.content.trim().length > 0)
      .slice(-MAX_HISTORY_MESSAGES)
      .map((m) => ({ role: m.role, content: m.content }))
  }, [])

  // Update messages of a specific conversation, keeping refs + title in sync.
  const updateConversationMessages = useCallback(
    (convId: string, updater: (msgs: ChatMessage[]) => ChatMessage[]) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c
          const nextMessages = updater(c.messages)
          const firstUser = nextMessages.find((m) => m.role === 'user')
          const title =
            c.title === 'New Chat' && firstUser
              ? firstUser.content.slice(0, 42) + (firstUser.content.length > 42 ? '…' : '')
              : c.title
          return { ...c, messages: nextMessages, title, updatedAt: Date.now() }
        }),
      )
    },
    [],
  )

  const runSend = useCallback(
    async (text: string, attachedFiles: File[]) => {
      const trimmed = text.trim()
      if (!trimmed && attachedFiles.length === 0) return
      if (streamingRef.current) return

      const convId = activeIdRef.current
      const priorMessages =
        convosRef.current.find((c) => c.id === convId)?.messages ?? []

      // Build history from the CURRENT committed messages BEFORE this new turn.
      const historyForRequest = buildHistory(priorMessages)

      setError(null)
      setIsStreaming(true)
      streamingRef.current = true

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      const userMessage: ChatMessage = { id: uid(), role: 'user', content: trimmed }
      const assistantId = uid()

      updateConversationMessages(convId, (msgs) => [
        ...msgs,
        userMessage,
        { id: assistantId, role: 'assistant', content: '', feedback: null },
      ])

      const payload = {
        message: trimmed,
        language: langRef.current,
        history: historyForRequest,
      }

      const appendDelta = (chunk: string) => {
        updateConversationMessages(convId, (msgs) =>
          msgs.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m)),
        )
      }

      const setAssistantContent = (content: string, isError = false) => {
        updateConversationMessages(convId, (msgs) =>
          msgs.map((m) => (m.id === assistantId ? { ...m, content, isError } : m)),
        )
      }

      try {
        if (attachedFiles.length > 0) {
          const data = await uploadChatMessage(
            { ...payload, files: attachedFiles },
            controller.signal,
          )
          setAssistantContent(data.reply)
        } else {
          let received = false
          try {
            await streamChatMessage(payload, {
              signal: controller.signal,
              onDelta: (chunk) => {
                received = true
                appendDelta(chunk)
              },
            })
            if (!received) {
              const data = await sendChatMessage(payload, controller.signal)
              setAssistantContent(data.reply)
            }
          } catch (streamError) {
            if (controller.signal.aborted) throw streamError
            const data = await sendChatMessage(payload, controller.signal)
            setAssistantContent(data.reply)
          }
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          const message =
            err instanceof TypeError
              ? t.errorNetwork
              : err instanceof Error && err.message
                ? err.message
                : t.errorGeneric
          setError(message)
          updateConversationMessages(convId, (msgs) =>
            msgs.map((m) =>
              m.id === assistantId && m.content.trim().length === 0
                ? { ...m, content: message, isError: true }
                : m,
            ),
          )
        }
      } finally {
        setIsStreaming(false)
        streamingRef.current = false
        abortRef.current = null
      }
    },
    [buildHistory, updateConversationMessages, t.errorGeneric, t.errorNetwork],
  )

  // Auto-send an initial message passed via the ?q= param (from landing CTAs).
  const consumedInitial = useRef(false)
  useEffect(() => {
    if (consumedInitial.current) return
    consumedInitial.current = true

    const q = searchParams.get('q')
    const langParam = searchParams.get('lang')
    if (langParam === 'rw' || langParam === 'en') setLang(langParam)

    if (q && q.trim()) {
      const next = new URLSearchParams(searchParams)
      next.delete('q')
      next.delete('lang')
      setSearchParams(next, { replace: true })
      void runSend(q, [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const text = input
    const attached = files
    setInput('')
    setFiles([])
    void runSend(text, attached)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    if (selected.length > 0) {
      setFiles((prev) => [...prev, ...selected].slice(0, 5))
    }
    e.target.value = ''
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleQuickAction = (action: QuickAction) => {
    void runSend(action.q[lang], [])
  }

  const handleSaveAsChecklist = (content: string) => {
    const items = parseChecklistItems(content)
    if (items.length === 0) return
    dispatch(addChecklist({ title: deriveChecklistTitle(content), items }))
    navigate(ROUTE_PATHS.checklist)
  }

  const handleCopy = (message: ChatMessage) => {
    navigator.clipboard?.writeText(message.content).then(
      () => {
        setCopiedId(message.id)
        window.setTimeout(() => setCopiedId((id) => (id === message.id ? null : id)), 1500)
      },
      () => {},
    )
  }

  const handleFeedback = (messageId: string, value: Exclude<Feedback, null>) => {
    updateConversationMessages(activeId, (msgs) =>
      msgs.map((m) =>
        m.id === messageId ? { ...m, feedback: m.feedback === value ? null : value } : m,
      ),
    )
  }

  const handleNewChat = () => {
    // Reuse the active conversation if it's already empty.
    const active = convosRef.current.find((c) => c.id === activeIdRef.current)
    if (active && active.messages.length === 0) return
    const fresh = newConversation('New Chat')
    setConversations((prev) => [fresh, ...prev])
    setActiveId(fresh.id)
  }

  const handleSelectConversation = (id: string) => {
    setActiveId(id)
  }

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => {
      const remaining = prev.filter((c) => c.id !== id)
      const next = remaining.length > 0 ? remaining : [newConversation('New Chat')]
      if (id === activeIdRef.current) {
        setActiveId(next[0].id)
      }
      return next
    })
  }

  const handleClearChat = () => {
    updateConversationMessages(activeId, () => [])
  }

  const summaries: ConversationSummary[] = useMemo(
    () =>
      conversations
        .filter((c) => c.messages.length > 0 || c.id === activeId)
        .map((c) => ({ id: c.id, title: c.title, updatedAt: c.updatedAt })),
    [conversations, activeId],
  )

  const lastMessage = messages[messages.length - 1]
  const headerTitle =
    activeConversation && activeConversation.title !== 'New Chat'
      ? activeConversation.title
      : UI_TEXT[lang].newChatTitle

  return (
    <div className="relative flex h-dvh w-full overflow-hidden bg-white">
      {/* Decorative background accents */}
      <div className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-kwami-green-light/60 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-emerald-100/50 blur-3xl" />

      {/* Sidebar (desktop) */}
      <aside className="z-20 hidden lg:block">
        <ChatSidebar
          conversations={summaries}
          activeId={activeId}
          search={search}
          onSearchChange={setSearch}
          onSelect={handleSelectConversation}
          onNewChat={handleNewChat}
          onDelete={handleDeleteConversation}
          onClose={() => {}}
        />
      </aside>

      {/* Main area */}
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 sm:px-6">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold text-gray-800">{headerTitle}</h1>
            <p className="truncate text-xs text-gray-400">{t.subtitle}</p>
          </div>

          {/* EN / RW toggle */}
          <div className="flex overflow-hidden rounded-full border border-gray-200 bg-white">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-1 text-xs font-semibold ${
                lang === 'en' ? 'bg-kwami-green text-white' : 'text-gray-500'
              }`}
              aria-pressed={lang === 'en'}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('rw')}
              className={`px-3 py-1 text-xs font-semibold ${
                lang === 'rw' ? 'bg-kwami-green text-white' : 'text-gray-500'
              }`}
              aria-pressed={lang === 'rw'}
            >
              RW
            </button>
          </div>

          <button
            type="button"
            onClick={handleClearChat}
            className="hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 sm:inline-flex"
            aria-label={t.clear}
            title={t.clear}
          >
            <Icon path="M6 7h12l-1 13H7L6 7zm3-3h6l1 2H8l1-2z" />
          </button>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(
                messages.map((m) => `${m.role === 'user' ? 'You' : 'Kwami'}: ${m.content}`).join('\n\n'),
              )
            }}
            className="hidden items-center gap-1.5 rounded-full bg-kwami-green px-4 py-2 text-sm font-semibold text-white hover:bg-kwami-green-dark sm:inline-flex"
          >
            <Icon path="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" className="h-4 w-4" />
            {t.share}
          </button>
        </header>

        {/* Messages */}
        <div ref={messagesRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          <div className="mx-auto max-w-3xl">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <KwamiLogo className="mb-4 h-14 w-14 [&>svg]:h-8 [&>svg]:w-8" />
                <h2 className="text-xl font-bold text-gray-800">{t.emptyTitle}</h2>
                <p className="mt-1 max-w-sm text-sm text-gray-500">{t.emptyBody}</p>
              </div>
            )}

            <div className="space-y-6">
              {messages.map((message) => {
                if (message.role === 'user') {
                  return (
                    <div key={message.id} className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-kwami-green px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm">
                        {message.content}
                      </div>
                    </div>
                  )
                }

                const isStreamingThis = isStreaming && message.id === lastMessage?.id
                const isEmptyStreaming = message.content.length === 0 && isStreamingThis
                const canSaveChecklist =
                  !message.isError &&
                  !isStreamingThis &&
                  parseChecklistItems(message.content).length >= 2

                return (
                  <div key={message.id} className="flex gap-3">
                    <span className="mt-0.5 shrink-0">
                      <KwamiLogo className="h-8 w-8 [&>svg]:h-4 [&>svg]:w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`rounded-2xl rounded-tl-md border px-4 py-3 text-sm leading-relaxed shadow-sm ${
                          message.isError
                            ? 'border-red-200 bg-red-50 text-red-700'
                            : 'border-gray-100 bg-white text-gray-800'
                        }`}
                      >
                        {isEmptyStreaming ? (
                          <div className="chat-typing" aria-label="Assistant is typing">
                            <span />
                            <span />
                            <span />
                          </div>
                        ) : (
                          <>
                            <MarkdownMessage content={message.content} />
                            {isStreamingThis && (
                              <span className="chat-cursor" aria-hidden="true" />
                            )}
                          </>
                        )}
                      </div>

                      {!isStreamingThis && !message.isError && message.content.length > 0 && (
                        <div className="mt-2 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleCopy(message)}
                            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                            aria-label="Copy"
                            title="Copy"
                          >
                            {copiedId === message.id ? (
                              <Icon path="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" className="h-4 w-4" />
                            ) : (
                              <Icon path="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFeedback(message.id, 'up')}
                            className={`rounded-lg p-1.5 transition hover:bg-gray-100 ${
                              message.feedback === 'up' ? 'text-kwami-green' : 'text-gray-400 hover:text-gray-600'
                            }`}
                            aria-label="Good response"
                            title="Good response"
                          >
                            <Icon path="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFeedback(message.id, 'down')}
                            className={`rounded-lg p-1.5 transition hover:bg-gray-100 ${
                              message.feedback === 'down' ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
                            }`}
                            aria-label="Bad response"
                            title="Bad response"
                          >
                            <Icon path="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" className="h-4 w-4" />
                          </button>
                          {canSaveChecklist && (
                            <button
                              type="button"
                              onClick={() => handleSaveAsChecklist(message.content)}
                              className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-kwami-green/30 bg-kwami-green-light px-3 py-1 text-xs font-semibold text-kwami-green-dark transition hover:bg-kwami-green hover:text-white"
                            >
                              <Icon path="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" className="h-3.5 w-3.5" />
                              {t.save}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-auto mb-2 w-full max-w-3xl px-4 sm:px-8">
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          </div>
        )}

        {/* Composer */}
        <div className="border-t border-gray-100 px-4 py-3 sm:px-8">
          <div className="mx-auto max-w-3xl">
            {/* Quick actions */}
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label.en}
                  type="button"
                  onClick={() => handleQuickAction(action)}
                  disabled={isStreaming}
                  className="shrink-0 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-600 transition hover:border-kwami-green hover:bg-kwami-green-light hover:text-kwami-green-dark disabled:opacity-50"
                >
                  {action.label[lang]}
                </button>
              ))}
            </div>

            {files.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <span
                    key={`${file.name}-${index}`}
                    className="inline-flex max-w-[180px] items-center gap-2 rounded-full bg-kwami-green-light px-3 py-1 text-xs text-kwami-green-dark"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${file.name}`}
                      onClick={() => removeFile(index)}
                      className="font-bold leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm focus-within:border-kwami-green focus-within:ring-2 focus-within:ring-kwami-green/15"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFilesSelected}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Attach file"
                title="Attach file"
              >
                <Icon path="M16.5 6v11.5a4 4 0 0 1-8 0V5a2.5 2.5 0 0 1 5 0v10.5a1 1 0 0 1-2 0V6H10v9.5a2.5 2.5 0 0 0 5 0V5a4 4 0 0 0-8 0v12.5a5.5 5.5 0 0 0 11 0V6h-1.5z" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 sm:flex"
                aria-label="Add image"
                title="Add image"
              >
                <Icon path="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.placeholder}
                rows={1}
                className="max-h-32 min-h-[2.25rem] flex-1 resize-none border-none bg-transparent px-1 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />

              <span className="hidden shrink-0 items-center gap-1 rounded-full bg-kwami-green-light px-3 py-1.5 text-xs font-semibold text-kwami-green-dark sm:inline-flex">
                <Icon path="M12 2l1.9 5.8L20 9l-4.9 3.6L17 20l-5-3.6L7 20l1.9-7.4L4 9l6.1-1.2L12 2z" className="h-3.5 w-3.5" />
                {t.aiTools}
              </span>

              <button
                type="submit"
                disabled={isStreaming || (input.trim().length === 0 && files.length === 0)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-kwami-green text-white transition hover:bg-kwami-green-dark disabled:opacity-40"
                aria-label="Send message"
              >
                <Icon path="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" className="h-5 w-5" />
              </button>
            </form>

            <p className="mt-2 text-center text-xs text-gray-400">{t.disclaimer}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage

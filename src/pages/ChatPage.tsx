import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import MarkdownMessage from '../components/chat/MarkdownMessage'
import {
  sendChatMessage,
  streamChatMessage,
  uploadChatMessage,
  type ChatHistoryMessage,
  type ChatLanguage,
} from '../api/chat'
import { MAX_HISTORY_MESSAGES } from '../config/api'
import { useAppDispatch } from '../hooks'
import { addChecklist } from '../store/checklistSlice'
import { deriveChecklistTitle, parseChecklistItems } from '../utils/parseChecklist'
import { ROUTE_PATHS } from '../routes/routePaths'
import '../components/chat/chat.css'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  isError?: boolean
}

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const UI_TEXT = {
  en: {
    title: 'Kwami Assistant',
    subtitle: 'Your guide to Rwandan government services',
    emptyTitle: 'How can I help you today?',
    emptyBody: 'Ask about IDs, passports, land, health, business and more.',
    placeholder: 'Type your message...',
    errorGeneric: 'Something went wrong. Please try again.',
    errorNetwork: 'Could not reach the assistant. Check your connection and try again.',
    suggestions: [
      'How do I apply for a passport in Rwanda?',
      'How do I get a birth certificate?',
      'Where is the nearest hospital?',
    ],
  },
  rw: {
    title: 'Umufasha Kwami',
    subtitle: 'Umuyobozi wawe wa serivisi za Leta y\'u Rwanda',
    emptyTitle: 'Nagufasha iki uyu munsi?',
    emptyBody: 'Baza ku ndangamuntu, pasiporo, ubutaka, ubuzima, ubucuruzi n\'ibindi.',
    placeholder: 'Andika ubutumwa bwawe...',
    errorGeneric: 'Habaye ikibazo. Ongera ugerageze.',
    errorNetwork: 'Ntibyashobotse kugera ku mufasha. Reba interineti maze wongere ugerageze.',
    suggestions: [
      'Nsaba nte pasiporo mu Rwanda?',
      'Nabona nte impamyabumenyi y\'amavuko?',
      'Ibitaro biri hafi biri he?',
    ],
  },
} as const

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  )
}

function AttachIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <path d="M16.5 6v11.5a4 4 0 0 1-8 0V5a2.5 2.5 0 0 1 5 0v10.5a1 1 0 0 1-2 0V6H10v9.5a2.5 2.5 0 0 0 5 0V5a4 4 0 0 0-8 0v12.5a5.5 5.5 0 0 0 11 0V6h-1.5z" />
    </svg>
  )
}

function ChatPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialLang: ChatLanguage = searchParams.get('lang') === 'rw' ? 'rw' : 'en'
  const [language, setLanguage] = useState<ChatLanguage>(initialLang)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])

  const messagesRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const languageRef = useRef<ChatLanguage>(language)
  languageRef.current = language

  const t = UI_TEXT[language]

  const scrollToBottom = useCallback(() => {
    const el = messagesRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isStreaming, scrollToBottom])

  const buildHistory = useCallback((msgs: ChatMessage[]): ChatHistoryMessage[] => {
    return msgs
      .filter((m) => !m.isError && m.content.trim().length > 0)
      .slice(-MAX_HISTORY_MESSAGES)
      .map((m) => ({ role: m.role, content: m.content }))
  }, [])

  const runSend = useCallback(
    async (text: string, attachedFiles: File[]) => {
      const trimmed = text.trim()
      if (!trimmed && attachedFiles.length === 0) return
      if (isStreaming) return

      setError(null)
      setIsStreaming(true)

      const controller = new AbortController()
      abortRef.current = controller

      const userMessage: ChatMessage = { id: uid(), role: 'user', content: trimmed }
      const assistantId = uid()

      // History is built from the state BEFORE this new user message.
      let historyForRequest: ChatHistoryMessage[] = []
      setMessages((prev) => {
        historyForRequest = buildHistory(prev)
        return [
          ...prev,
          userMessage,
          { id: assistantId, role: 'assistant', content: '' },
        ]
      })

      const lang = languageRef.current
      const payload = { message: trimmed, language: lang, history: historyForRequest }

      const appendDelta = (chunk: string) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m,
          ),
        )
      }

      const setAssistantContent = (content: string, isError = false) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content, isError } : m)),
        )
      }

      try {
        if (attachedFiles.length > 0) {
          // File attachments use the multipart upload endpoint (non-streaming).
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
              // Stream produced nothing; fall back to non-streaming endpoint.
              const data = await sendChatMessage(payload, controller.signal)
              setAssistantContent(data.reply)
            }
          } catch (streamError) {
            if (controller.signal.aborted) throw streamError
            // Streaming failed — fall back to the non-streaming endpoint.
            const data = await sendChatMessage(payload, controller.signal)
            setAssistantContent(data.reply)
          }
        }
      } catch (err) {
        if (controller.signal.aborted) {
          // User cancelled; leave partial content as-is.
        } else {
          const message =
            err instanceof TypeError
              ? t.errorNetwork
              : err instanceof Error && err.message
                ? err.message
                : t.errorGeneric
          setError(message)
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId && m.content.trim().length === 0
                ? { ...m, content: message, isError: true }
                : m,
            ),
          )
        }
      } finally {
        setIsStreaming(false)
        abortRef.current = null
      }
    },
    [buildHistory, isStreaming, t.errorGeneric, t.errorNetwork],
  )

  // Auto-send an initial message passed via the ?q= query param (from CTAs).
  const consumedInitial = useRef(false)
  useEffect(() => {
    if (consumedInitial.current) return
    const q = searchParams.get('q')
    if (q && q.trim()) {
      consumedInitial.current = true
      // Clear the query params so a refresh doesn't re-send.
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

  const handleSuggestion = (text: string) => {
    void runSend(text, [])
  }

  const handleSaveAsChecklist = (content: string) => {
    const items = parseChecklistItems(content)
    if (items.length === 0) return
    dispatch(addChecklist({ title: deriveChecklistTitle(content), items }))
    navigate(ROUTE_PATHS.checklist)
  }

  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  const lastMessage = messages[messages.length - 1]

  return (
    <div className="chat-page">
      <header className="chat-header">
        <button
          type="button"
          className="chat-header__back"
          aria-label="Go back"
          onClick={() => navigate(-1)}
        >
          <BackIcon />
        </button>
        <div className="chat-header__title">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        <div className="chat-lang" role="group" aria-label="Language">
          <button
            type="button"
            className={`chat-lang__btn${language === 'en' ? ' chat-lang__btn--active' : ''}`}
            aria-pressed={language === 'en'}
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
          <button
            type="button"
            className={`chat-lang__btn${language === 'rw' ? ' chat-lang__btn--active' : ''}`}
            aria-pressed={language === 'rw'}
            onClick={() => setLanguage('rw')}
          >
            RW
          </button>
        </div>
      </header>

      <div className="chat-messages" ref={messagesRef}>
        {messages.length === 0 && (
          <div className="chat-empty">
            <h2>{t.emptyTitle}</h2>
            <p>{t.emptyBody}</p>
            <div className="chat-suggestions">
              {t.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="chat-suggestion"
                  onClick={() => handleSuggestion(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => {
          if (message.role === 'user') {
            return (
              <div key={message.id} className="chat-row chat-row--user">
                <div className="chat-bubble chat-bubble--user">{message.content}</div>
              </div>
            )
          }

          const isEmptyStreaming =
            message.content.length === 0 && message.id === lastMessage?.id && isStreaming

          const isStreamingThis = isStreaming && message.id === lastMessage?.id
          const canSaveChecklist =
            !message.isError &&
            !isStreamingThis &&
            parseChecklistItems(message.content).length >= 2

          return (
            <div key={message.id} className="chat-row chat-row--assistant">
              <div
                className={`chat-bubble chat-bubble--assistant${
                  message.isError ? ' chat-bubble--error' : ''
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
                    {isStreamingThis && <span className="chat-cursor" aria-hidden="true" />}
                    {canSaveChecklist && (
                      <button
                        type="button"
                        className="chat-save-checklist"
                        onClick={() => handleSaveAsChecklist(message.content)}
                      >
                        Save as checklist
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {error && <div className="chat-error-banner">{error}</div>}

      <form className="chat-composer" onSubmit={handleSubmit}>
        {files.length > 0 && (
          <div className="chat-attachments">
            {files.map((file, index) => (
              <span key={`${file.name}-${index}`} className="chat-attachment-pill">
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {file.name}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => removeFile(index)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="chat-composer__row">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            style={{ display: 'none' }}
            onChange={handleFilesSelected}
          />
          <button
            type="button"
            className="chat-composer__attach"
            aria-label="Attach files"
            onClick={() => fileInputRef.current?.click()}
          >
            <AttachIcon />
          </button>
          <textarea
            className="chat-composer__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.placeholder}
            rows={1}
          />
          <button
            type="submit"
            className="chat-composer__send"
            aria-label="Send message"
            disabled={isStreaming || (input.trim().length === 0 && files.length === 0)}
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatPage

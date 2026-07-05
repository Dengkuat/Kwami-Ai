import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import AppHeader from '../components/layout/AppHeader'
import BottomNav from '../components/layout/BottomNav'
import { ChatIcon } from '../components/icons/ServiceIcons'
import { popularServices } from '../data/servicesData'
import { useAppDispatch, useAppSelector } from '../hooks'
import { clearChat, sendMessage } from '../store/chatSlice'

const SUGGESTIONS = [
  'How do I apply for a National ID?',
  'What documents do I need for a passport?',
  'Help me with education equivalence',
]

function buildServicePrompt(serviceName: string, language: 'kinyarwanda' | 'english') {
  if (language === 'kinyarwanda') {
    return `Nifuza gukora serivisi ya "${serviceName}". Nyobora intambwe ku ntambwe kandi umbwire inyandiko nkeneye.`
  }
  return `I want to work with the "${serviceName}" service. Please guide me through the steps and tell me which documents I need.`
}

function SendIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12 20 4l-4 16-4.5-6.5L4 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1">
      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
    </span>
  )
}

function ChatPage() {
  const dispatch = useAppDispatch()
  const { messages, status } = useAppSelector((state) => state.chat)
  const language = useAppSelector((state) => state.language.current)
  const [searchParams, setSearchParams] = useSearchParams()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const startedServiceRef = useRef<string | null>(null)

  const isLoading = status === 'loading'
  const showSuggestions = messages.length <= 1

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    const serviceId = searchParams.get('service')
    if (!serviceId || startedServiceRef.current === serviceId) return

    const service = popularServices.find((item) => item.id === serviceId)
    if (!service) return

    startedServiceRef.current = serviceId
    dispatch(clearChat())
    dispatch(sendMessage(buildServicePrompt(service.name, language)))
    setSearchParams({}, { replace: true })
  }, [searchParams, language, dispatch, setSearchParams])

  const submit = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return
    dispatch(sendMessage(trimmed))
    setInput('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit(input)
  }

  return (
    <div className="bg-gray-50">
      <div className="mx-auto flex h-[100dvh] max-w-md flex-col bg-gray-50 pb-[4.5rem]">
        <div className="shrink-0">
          <AppHeader />
        </div>

        <div className="flex shrink-0 items-center gap-3 border-b border-gray-100 bg-white px-4 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-kwami-green text-white">
            <ChatIcon active />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-gray-900">Kwami Assistant</p>
            <p className="text-xs text-kwami-green">Online</p>
          </div>
        </div>

        <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'rounded-br-md bg-kwami-green text-white'
                    : 'rounded-bl-md border border-gray-100 bg-white text-gray-800 shadow-sm'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md border border-gray-100 bg-white px-4 py-2.5 shadow-sm">
                <TypingDots />
              </div>
            </div>
          )}

          {showSuggestions && (
            <div className="flex flex-wrap gap-2 pt-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => submit(suggestion)}
                  className="rounded-full border border-kwami-green/30 bg-white px-3 py-1.5 text-xs font-medium text-kwami-green-dark hover:bg-kwami-green-light"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="shrink-0 border-t border-gray-100 bg-white px-3 py-3"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your message..."
              className="min-w-0 flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-kwami-green focus:bg-white focus:outline-none focus:ring-2 focus:ring-kwami-green/20"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-kwami-green text-white transition-opacity disabled:opacity-40"
            >
              <SendIcon />
            </button>
          </div>
        </form>

        <BottomNav />
      </div>
    </div>
  )
}

export default ChatPage

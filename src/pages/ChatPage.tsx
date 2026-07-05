import AppShell from '../components/layout/AppShell'
import { ChatIcon } from '../components/icons/ServiceIcons'

// TODO: Build the AI chat assistant screen from the screenshot.
// TODO: Add message bubbles, the text input, send button, and bottom navigation.
// TODO: Wire chat state to Redux after the store slices are created.
function ChatPage() {
  return (
    <AppShell>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-8 text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-kwami-green-light text-kwami-green">
          <ChatIcon active />
        </span>
        <h2 className="mb-2 text-xl font-bold text-kwami-green-dark">AI Chat Assistant</h2>
        <p className="max-w-xs text-sm text-gray-500">
          This screen is coming soon. It will let you chat with the assistant to get help with any
          government service.
        </p>
      </div>
    </AppShell>
  )
}

export default ChatPage

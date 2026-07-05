import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import './chat.css'

const GOOGLE_MAPS_HOSTS = ['google.com/maps', 'maps.google.com', 'goo.gl/maps', 'maps.app.goo.gl']

export function isGoogleMapsUrl(url: string): boolean {
  const lower = url.toLowerCase()
  return GOOGLE_MAPS_HOSTS.some((host) => lower.includes(host))
}

/**
 * Extract unique Google Maps links from raw markdown/text so they can be
 * surfaced as prominent "Open in Google Maps" chips.
 */
export function extractMapLinks(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s)"'<>]+/g
  const matches = text.match(urlRegex) ?? []
  const maps = matches
    .map((url) => url.replace(/[.,;:)\]]+$/, ''))
    .filter(isGoogleMapsUrl)
  return Array.from(new Set(maps))
}

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
  </svg>
)

const markdownComponents: Components = {
  a: ({ href, children, ...props }) => {
    const url = href ?? ''
    if (url && isGoogleMapsUrl(url)) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-map-inline-link"
          {...props}
        >
          <MapPinIcon />
          {children}
        </a>
      )
    }
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  },
}

interface MarkdownMessageProps {
  content: string
}

function MarkdownMessage({ content }: MarkdownMessageProps) {
  const mapLinks = useMemo(() => extractMapLinks(content), [content])

  return (
    <div className="chat-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>

      {mapLinks.length > 0 && (
        <div className="chat-map-chips">
          {mapLinks.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="chat-map-chip"
            >
              <MapPinIcon />
              Open in Google Maps
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default MarkdownMessage

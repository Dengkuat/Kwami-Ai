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

/**
 * Build a keyless, embeddable Google Maps URL from a standard maps link.
 *
 * Google Maps supports an `&output=embed` mode that works inside an <iframe>
 * WITHOUT any API key, as long as we provide a `q` (query) parameter. We try to
 * recover that query from the assistant's `.../maps/search/?api=1&query=...`
 * links (or any link carrying a `query`/`q` param). Returns null when we can't
 * confidently build an embed URL (e.g. short goo.gl links or directions), in
 * which case the caller should fall back to the plain "Open in Maps" link.
 */
export function toEmbedMapUrl(url: string): string | null {
  let query: string | null = null

  try {
    const parsed = new URL(url)
    query = parsed.searchParams.get('query') ?? parsed.searchParams.get('q')
  } catch {
    query = null
  }

  // Fallback: pull the value out manually if URL parsing missed it.
  if (!query) {
    const match = url.match(/[?&](?:query|q)=([^&]+)/i)
    if (match) {
      try {
        query = decodeURIComponent(match[1])
      } catch {
        query = match[1]
      }
    }
  }

  if (!query || !query.trim()) return null

  return `https://www.google.com/maps?q=${encodeURIComponent(query.trim())}&output=embed`
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

      {mapLinks.map((url) => {
        const embedUrl = toEmbedMapUrl(url)
        return (
          <div key={url} className="chat-map">
            {embedUrl && (
              <iframe
                className="chat-map-frame"
                src={embedUrl}
                title="Google Maps location"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
            <div className="chat-map-chips">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="chat-map-chip"
              >
                <MapPinIcon />
                Open in Google Maps
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MarkdownMessage

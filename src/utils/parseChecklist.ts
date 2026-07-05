/**
 * Parse numbered/bulleted steps out of an assistant markdown reply so they can
 * be turned into a checklist. Returns the extracted item texts (cleaned of
 * markdown markers). Returns an empty array when no list-like content is found.
 */
export function parseChecklistItems(markdown: string): string[] {
  const lines = markdown.split(/\r?\n/)
  const items: string[] = []

  for (const rawLine of lines) {
    const line = rawLine.trim()
    // Match "- ", "* ", "+ ", "1. ", "2) " style list markers.
    const match = line.match(/^(?:[-*+]|\d+[.)])\s+(.*)$/)
    if (!match) continue

    const text = cleanMarkdown(match[1])
    if (text) items.push(text)
  }

  return items
}

/** Strip common inline markdown so checklist items read as plain text. */
function cleanMarkdown(input: string): string {
  return input
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links -> label
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // italic
    .replace(/`([^`]*)`/g, '$1') // inline code
    .replace(/\s+/g, ' ')
    .trim()
}

/** Derive a short checklist title from the reply (first heading or fallback). */
export function deriveChecklistTitle(markdown: string): string {
  const headingMatch = markdown.match(/^\s*#{1,6}\s+(.+)$/m)
  if (headingMatch) {
    const title = headingMatch[1].replace(/[#*_`]/g, '').trim()
    if (title) return title.slice(0, 60)
  }
  return 'Saved from chat'
}

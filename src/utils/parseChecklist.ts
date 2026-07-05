/**
 * Parse numbered/bulleted steps out of an assistant markdown reply so they can
 * be turned into a checklist. Returns only actionable items — not intro prose,
 * headers, or concluding sentences.
 */

const LIST_LINE =
  /^(?:[-*+•]|[-–—]|\d+[.)])\s+(.*)$/

const SKIP_LINE_PATTERNS: RegExp[] = [
  /^(here(?:'s| are)|below (?:are|is)|the following|these are|let me|i'll|i will|i can|sure[,.!]?|of course|absolutely|certainly|great question)/i,
  /^(good luck|let me know|feel free|hope this|don't hesitate|thanks for|thank you|you're welcome|please let)/i,
  /^(note|tip|warning|caution|remember|disclaimer|important)\s*:/i,
  /^(dore|rebaho|ibi ni|murakoze|niba ukeneye|ubishobora|neza[,.]|byanze|cyane|murakoze cyane|niba hari)/i,
  /\?\s*$/,
  /^(step\s+\d+\s*[:.]?\s*)?(overview|summary|introduction|conclusion|notes?)\s*$/i,
]

const PROSE_OPENERS =
  /^(this|these|there|it|you can|you will|you may|you should|the|a|an|if|when|while|because|however|also|additionally|furthermore|in rwanda|for example|such as|meaning|that means|biri|ibi|iyo|niba|ubwo|kuri|mu rwanda|urugero)/i

const IMPERATIVE_EN =
  /^(gather|collect|bring|visit|go to|pay|submit|apply|register|complete|download|upload|prepare|obtain|contact|check|ensure|provide|fill|sign|attach|take|find|call|book|schedule|make|get|create|open|print|copy|scan|verify|confirm|wait|receive|carry|present|show|request|send|renew|replace|update|deliver|pick up|fill out|make sure)\b/i

const IMPERATIVE_RW =
  /^(jya|genda|shyira|shyiramo|tangira|fata|tanga|shyikiriza|saba|wishyure|andikisha|zuza|reba|hamagara|bika|koresha|menya|subiza|emera|anza|shaka|kurura|emera|fata|shikiriza)\b/i

const REQUIREMENT_PHRASES =
  /\b(must|need to|required to|should|don't forget to|remember to|ugomba|bisabwa|urakenera|urafite)\b/i

const DOCUMENT_KEYWORDS =
  /\b(id|passport|photo|form|certificate|receipt|proof|copy|document|fee|payment|application|permit|license|birth|marriage|national|indangamuntu|pasiporo|impamyabumenyi|icyemezo|ifoto|ifishi|uruhushya|icyangombwa)\b/i

const GENERIC_HEADINGS =
  /^(steps|requirements|overview|summary|documents|checklist|ntambwe|ibisabwa|fees|where to apply)\s*[:.]?\s*$/i

/** Strip common inline markdown so checklist items read as plain text. */
function cleanMarkdown(input: string): string {
  return input
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeForDedup(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function isNearDuplicate(a: string, b: string): boolean {
  const na = normalizeForDedup(a)
  const nb = normalizeForDedup(b)
  if (!na || !nb) return false
  if (na === nb) return true
  if (na.length >= 12 && nb.length >= 12) {
    if (na.includes(nb) || nb.includes(na)) return true
  }
  return false
}

function dedupeItems(items: string[]): string[] {
  const result: string[] = []
  for (const item of items) {
    if (result.some((existing) => isNearDuplicate(existing, item))) continue
    result.push(item)
  }
  return result
}

function isSkippedLine(text: string): boolean {
  return SKIP_LINE_PATTERNS.some((pattern) => pattern.test(text))
}

function isHeaderOnly(text: string): boolean {
  if (/[:：]\s*$/.test(text) && text.split(/\s+/).length <= 8) return true
  if (
    /^(required documents|documents needed|steps to|requirements|overview|summary|fees|where to apply|important notes?)\s*[:.]?\s*$/i.test(
      text,
    )
  ) {
    return true
  }
  return false
}

function isTooShort(text: string): boolean {
  const words = text.split(/\s+/).filter(Boolean)
  if (text.length < 8) return true
  if (words.length === 1 && text.length < 18) return true
  return false
}

function isExplanatoryProse(text: string): boolean {
  return PROSE_OPENERS.test(text)
}

function looksLikeDocumentRequirement(text: string): boolean {
  const words = text.split(/\s+/).filter(Boolean)
  return words.length >= 2 && DOCUMENT_KEYWORDS.test(text)
}

function hasActionSignal(text: string): boolean {
  if (IMPERATIVE_EN.test(text) || IMPERATIVE_RW.test(text)) return true
  if (REQUIREMENT_PHRASES.test(text)) return true
  if (looksLikeDocumentRequirement(text)) return true

  const words = text.split(/\s+/).filter(Boolean)
  if (words.length >= 3 && !isExplanatoryProse(text)) return true
  return false
}

function isActionableItem(text: string): boolean {
  if (!text) return false
  if (isSkippedLine(text)) return false
  if (isHeaderOnly(text)) return false
  if (isTooShort(text)) return false
  if (isExplanatoryProse(text)) return false
  return hasActionSignal(text)
}

function extractRawListItems(markdown: string): string[] {
  const lines = markdown.split(/\r?\n/)
  const items: string[] = []

  for (const rawLine of lines) {
    const line = rawLine.trim()
    const match = line.match(LIST_LINE)
    if (!match) continue

    const text = cleanMarkdown(match[1])
    if (text) items.push(text)
  }

  return items
}

/**
 * Extract checklist-worthy items from an assistant reply.
 * Returns an empty array when no clear actionable steps are found.
 */
export function parseChecklistItems(markdown: string): string[] {
  const rawItems = extractRawListItems(markdown)
  if (rawItems.length === 0) return []

  const hasStructuredList = rawItems.length >= 2

  const filtered = dedupeItems(
    rawItems.map(cleanMarkdown).filter(isActionableItem),
  )

  const items = hasStructuredList ? filtered : filtered.slice(0, 5)

  return items.length >= 2 ? items : []
}

function isGenericHeading(title: string): boolean {
  return GENERIC_HEADINGS.test(title.trim())
}

function extractTopicFromQuestion(question: string): string {
  let topic = question
    .replace(
      /^(how do i|how can i|what are the|what is the|tell me about|walk me through|where do i|where can i|can you|please|help me with|i need to|i want to)\s+/i,
      '',
    )
    .replace(
      /^(nabigenza nte|nasaba nte|ni ibihe|ni iki|mbwira|nyobora|nabishaka nte|nshobora|ndashaka)\s+/i,
      '',
    )
    .replace(/\?\s*$/, '')
    .trim()

  topic = topic.split(/[?,;]/)[0]?.trim() ?? ''

  if (topic.length > 0) {
    topic = topic.charAt(0).toUpperCase() + topic.slice(1)
  }

  return topic.length >= 5 ? topic : ''
}

/** Derive a short checklist title from the reply and optional user question. */
export function deriveChecklistTitle(markdown: string, userQuestion?: string): string {
  const headingMatch = markdown.match(/^\s*#{1,6}\s+(.+)$/m)
  if (headingMatch) {
    const title = cleanMarkdown(headingMatch[1])
    if (title && !isGenericHeading(title)) return title.slice(0, 60)
  }

  if (userQuestion?.trim()) {
    const topic = extractTopicFromQuestion(userQuestion.trim())
    if (topic) return topic.slice(0, 60)
  }

  const sectionMatch = markdown.match(
    /^\s*(?:#{1,6}\s+)?(.+(?:steps|requirements|documents|checklist|ntambwe|ibisabwa).*)$/im,
  )
  if (sectionMatch) {
    const title = cleanMarkdown(sectionMatch[1]).replace(/[:.]+\s*$/, '')
    if (title.length >= 5 && !isGenericHeading(title)) return title.slice(0, 60)
  }

  return 'Saved from chat'
}

export interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

export type ReplyLanguage = 'kinyarwanda' | 'english'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
const MODEL = (import.meta.env.VITE_GEMINI_MODEL as string | undefined) ?? 'gemini-2.0-flash'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

const SYSTEM_INSTRUCTION = `You are Kwami, the friendly AI assistant for "Kigali Kwima", an app that helps
people in Rwanda understand and complete government services (like National ID, passports, land
transfers, birth certificates, and education-equivalence applications).

Guidelines:
- Be warm, clear, and concise. Prefer short paragraphs and simple bullet points.
- You can answer general questions too, but gently steer toward how you can help with services.
- If you are unsure about an official fee or procedure, say so and suggest checking Irembo.gov.rw.
- Reply in the same language the user writes in (English or Kinyarwanda).`

export function isGeminiConfigured(): boolean {
  return Boolean(API_KEY)
}

export async function sendToGemini(
  history: ChatTurn[],
  language: ReplyLanguage = 'english',
): Promise<string> {
  if (!API_KEY) {
    throw new Error(
      'Missing Gemini API key. Add VITE_GEMINI_API_KEY to a .env.local file and restart the dev server.',
    )
  }

  const languageDirective =
    language === 'kinyarwanda'
      ? '\n\nIMPORTANT: Always reply in Kinyarwanda, regardless of the language of the question.'
      : '\n\nIMPORTANT: Always reply in English, regardless of the language of the question.'

  const contents = history.map((turn) => ({
    role: turn.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: turn.content }],
  }))

  const response = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION + languageDirective }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  })

  if (!response.ok) {
    let detail = ''
    try {
      const errBody = await response.json()
      detail = errBody?.error?.message ?? ''
    } catch {
      detail = response.statusText
    }
    throw new Error(`Gemini request failed (${response.status}). ${detail}`.trim())
  }

  const data = await response.json()
  const text: string | undefined = data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text ?? '')
    .join('')

  if (!text) {
    throw new Error('The assistant returned an empty response. Please try again.')
  }

  return text.trim()
}

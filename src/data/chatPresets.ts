import { ROUTE_PATHS } from '../routes/routePaths'
import type { ChatLanguage } from '../api/chat'

export interface ChatPreset {
  en: string
  rw: string
}

/**
 * Initial user messages auto-sent when a landing/service item is clicked.
 * Keyed by the id/label used across the landing page, services data and menu.
 */
export const chatPresets: Record<string, ChatPreset> = {
  // Landing feature cards
  irembo: {
    en: 'How do I use Irembo to apply for documents like a birth certificate, national ID, or permit in Rwanda?',
    rw: 'Nakoresha nte Irembo gusaba impapuro nk\'impamyabumenyi y\'amavuko, indangamuntu, cyangwa uruhushya mu Rwanda?',
  },
  health: {
    en: 'Tell me about Mutuelle de Santé and how to find nearby clinics and hospitals in Rwanda.',
    rw: 'Mbwira ku Mutuelle de Santé n\'uko nabona amavuriro n\'ibitaro biri hafi mu Rwanda.',
  },
  legal: {
    en: 'I need legal aid. Can you explain my rights and how public laws work in Rwanda?',
    rw: 'Nkeneye ubufasha mu by\'amategeko. Wansobanurira uburenganzira bwanjye n\'uko amategeko ya Leta akora mu Rwanda?',
  },
  // Popular services
  'national-id': {
    en: 'How do I apply for or replace a National ID card in Rwanda? What are the steps, fees and required documents?',
    rw: 'Nasaba nte cyangwa nsimbuze indangamuntu mu Rwanda? Ni izihe ntambwe, amafaranga n\'impapuro bisabwa?',
  },
  'land-title': {
    en: 'How do I transfer a land title in Rwanda? What documents and fees are required?',
    rw: 'Nimurika nte impapuro z\'ubutaka mu Rwanda? Ni izihe mpapuro n\'amafaranga bisabwa?',
  },
  'birth-certificate': {
    en: 'How do I get a birth certificate in Rwanda? What is the process and where do I apply?',
    rw: 'Nabona nte impamyabumenyi y\'amavuko mu Rwanda? Uburyo ni ubuhe kandi nsaba he?',
  },
  'driving-license': {
    en: 'How do I renew my driving license in Rwanda? What are the requirements and fees?',
    rw: 'Nvugurura nte uruhushya rwo gutwara ibinyabiziga mu Rwanda? Ni ibihe bisabwa n\'amafaranga?',
  },
  // Categories
  identity: {
    en: 'What identity services (National ID, passport, NIDA) are available in Rwanda and how do I access them?',
    rw: 'Ni izihe serivisi z\'irangamuntu (indangamuntu, pasiporo, NIDA) ziboneka mu Rwanda kandi nzigeraho nte?',
  },
  business: {
    en: 'How do I register a business in Rwanda? Walk me through the steps and requirements.',
    rw: 'Nandikisha nte ubucuruzi mu Rwanda? Nyobora mu ntambwe n\'ibisabwa.',
  },
  family: {
    en: 'What family-related government services (marriage, birth, civil registration) are available in Rwanda?',
    rw: 'Ni izihe serivisi za Leta zijyanye n\'umuryango (ukwshyingiranwa, amavuko, iyandikwa) ziboneka mu Rwanda?',
  },
  land: {
    en: 'What land services are available in Rwanda, such as land title transfer and registration?',
    rw: 'Ni izihe serivisi z\'ubutaka ziboneka mu Rwanda, nk\'imurikagurisha n\'iyandikisha ry\'ubutaka?',
  },
  transport: {
    en: 'What transport services are available in Rwanda, such as driving licenses and vehicle registration?',
    rw: 'Ni izihe serivisi z\'ubwikorezi ziboneka mu Rwanda, nk\'impushya zo gutwara n\'iyandikisha ry\'ibinyabiziga?',
  },
}

export function getPreset(key: string, language: ChatLanguage): string | undefined {
  const preset = chatPresets[key]
  if (!preset) return undefined
  return language === 'rw' ? preset.rw : preset.en
}

/**
 * Build a link to the chat page, optionally auto-sending an initial message.
 */
export function buildChatLink(options?: { message?: string; language?: ChatLanguage }): string {
  const params = new URLSearchParams()
  if (options?.message) params.set('q', options.message)
  if (options?.language) params.set('lang', options.language)
  const query = params.toString()
  return query ? `${ROUTE_PATHS.chat}?${query}` : ROUTE_PATHS.chat
}

/**
 * Build a chat link for a known preset key. Falls back to a generic message
 * derived from the label if the key is not in the preset table.
 */
export function buildPresetChatLink(
  key: string,
  language: ChatLanguage,
  fallbackLabel?: string,
): string {
  const preset = getPreset(key, language)
  const message =
    preset ??
    (fallbackLabel
      ? language === 'rw'
        ? `Nshaka amakuru kuri "${fallbackLabel}" mu Rwanda.`
        : `I'd like information about "${fallbackLabel}" in Rwanda.`
      : undefined)
  return buildChatLink({ message, language })
}

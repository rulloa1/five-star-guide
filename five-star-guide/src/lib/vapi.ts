const VAPI_BASE_URL = 'https://api.vapi.ai'

// ─── Voice Options ────────────────────────────────────────────────────────────

export const VOICE_OPTIONS = [
  // ElevenLabs
  { provider: '11labs', voiceId: 'pNInz6obpgDQGcFmaJgB', label: 'Adam – Professional Male' },
  { provider: '11labs', voiceId: 'EXAVITQu4vr4xnSDxMaL', label: 'Sarah – Friendly Female' },
  { provider: '11labs', voiceId: 'VR6AewLTigWG4xSOukaG', label: 'Arnold – Deep Male' },
  { provider: '11labs', voiceId: 'ThT5KcBeYPX3keUQqHPh', label: 'Dorothy – Warm Female' },
  { provider: '11labs', voiceId: 'TxGEqnHWrfWFTfGW9XjX', label: 'Josh – Energetic Male' },
  { provider: '11labs', voiceId: 'ErXwobaYiN019PkySvjV', label: 'Antoni – Calm Male' },
  // OpenAI TTS
  { provider: 'openai', voiceId: 'alloy', label: 'Alloy – Neutral (OpenAI)' },
  { provider: 'openai', voiceId: 'nova', label: 'Nova – Bright Female (OpenAI)' },
  { provider: 'openai', voiceId: 'echo', label: 'Echo – Clear Male (OpenAI)' },
  { provider: 'openai', voiceId: 'onyx', label: 'Onyx – Deep Male (OpenAI)' },
  { provider: 'openai', voiceId: 'shimmer', label: 'Shimmer – Soft Female (OpenAI)' },
] as const

export type VoiceOption = (typeof VOICE_OPTIONS)[number]

// ─── Language Options ─────────────────────────────────────────────────────────

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English (US)' },
  { value: 'es', label: 'Spanish (Latin America)' },
  { value: 'en-bilingual', label: 'Bilingual (English & Spanish)' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese (Brazil)' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
    'Content-Type': 'application/json',
  }
}

function buildVoiceConfig(voiceId: string) {
  const found = VOICE_OPTIONS.find((v) => v.voiceId === voiceId)
  const provider = found?.provider ?? '11labs'
  return { provider, voiceId }
}

function buildTranscriberConfig(language: string) {
  // For bilingual, use multi-language model
  if (language === 'en-bilingual') {
    return {
      provider: 'deepgram',
      model: 'nova-2',
      language: 'en',
      keywords: [],
    }
  }
  return {
    provider: 'deepgram',
    model: 'nova-2',
    language,
  }
}

function buildSystemMessages(systemPrompt: string, language: string) {
  const languageInstruction =
    language === 'es'
      ? '\n\nIMPORTANT: Respond exclusively in Spanish.'
      : language === 'en-bilingual'
      ? '\n\nIMPORTANT: Respond in whichever language the caller speaks — English or Spanish.'
      : language === 'fr'
      ? '\n\nIMPORTANT: Respond exclusively in French.'
      : language === 'de'
      ? '\n\nIMPORTANT: Respond exclusively in German.'
      : language === 'pt'
      ? '\n\nIMPORTANT: Respond exclusively in Portuguese (Brazilian).'
      : ''
  return [{ role: 'system', content: systemPrompt + languageInstruction }]
}

// ─── VAPI API Functions ────────────────────────────────────────────────────────

export async function createVapiAssistant(payload: {
  name: string
  systemPrompt: string
  voiceId?: string
  language?: string
  firstMessage?: string
  webhookUrl?: string
}) {
  const voiceId = payload.voiceId || 'pNInz6obpgDQGcFmaJgB'
  const language = payload.language || 'en'

  const body: Record<string, unknown> = {
    name: payload.name,
    model: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      messages: buildSystemMessages(payload.systemPrompt, language),
    },
    voice: buildVoiceConfig(voiceId),
    transcriber: buildTranscriberConfig(language),
    firstMessage:
      payload.firstMessage || "Hi! Thanks for calling. How can I help you today?",
    endCallMessage: "Thanks for calling! Have a great day.",
    recordingEnabled: true,
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 600,
  }

  if (payload.webhookUrl) {
    body.serverUrl = payload.webhookUrl
  }

  const res = await fetch(`${VAPI_BASE_URL}/assistant`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function updateVapiAssistant(
  assistantId: string,
  payload: {
    name?: string
    systemPrompt?: string
    voiceId?: string
    language?: string
    firstMessage?: string
    webhookUrl?: string
  }
) {
  const body: Record<string, unknown> = {}

  if (payload.name) body.name = payload.name

  const language = payload.language || 'en'

  if (payload.systemPrompt) {
    body.model = {
      provider: 'openai',
      model: 'gpt-4o-mini',
      messages: buildSystemMessages(payload.systemPrompt, language),
    }
  }

  if (payload.voiceId) {
    body.voice = buildVoiceConfig(payload.voiceId)
  }

  if (payload.language) {
    body.transcriber = buildTranscriberConfig(payload.language)
  }

  if (payload.firstMessage) {
    body.firstMessage = payload.firstMessage
  }

  if (payload.webhookUrl) {
    body.serverUrl = payload.webhookUrl
  }

  const res = await fetch(`${VAPI_BASE_URL}/assistant/${assistantId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getVapiAssistant(assistantId: string) {
  const res = await fetch(`${VAPI_BASE_URL}/assistant/${assistantId}`, {
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function listVapiPhoneNumbers() {
  const res = await fetch(`${VAPI_BASE_URL}/phone-number`, {
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<Array<{
    id: string
    number: string
    name?: string
    assistantId?: string | null
    createdAt: string
  }>>
}

export async function assignPhoneNumberToAssistant(
  phoneNumberId: string,
  assistantId: string
) {
  const res = await fetch(`${VAPI_BASE_URL}/phone-number/${phoneNumberId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ assistantId }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function deleteVapiAssistant(assistantId: string) {
  const res = await fetch(`${VAPI_BASE_URL}/assistant/${assistantId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

/**
 * Trigger an outbound call via Vapi.
 * Requires a Vapi phone number ID (the "from" number) and an assistant ID.
 */
export async function triggerVapiCall(payload: {
  phoneNumberId: string   // Vapi phone number ID to call from
  assistantId: string     // Vapi assistant to use for the call
  toPhone: string         // E.164 format, e.g. +17135551234
  metadata?: Record<string, string>
}) {
  const body: Record<string, unknown> = {
    phoneNumberId: payload.phoneNumberId,
    assistantId: payload.assistantId,
    customer: { number: payload.toPhone },
  }
  if (payload.metadata) {
    body.assistantOverrides = { metadata: payload.metadata }
  }

  const res = await fetch(`${VAPI_BASE_URL}/call/phone`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<{ id: string; status: string }>
}

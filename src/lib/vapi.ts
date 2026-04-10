const VAPI_BASE_URL = 'https://api.vapi.ai'

export async function createVapiAssistant(payload: {
  name: string
  systemPrompt: string
  voiceId?: string
  firstMessage?: string
}) {
  const res = await fetch(`${VAPI_BASE_URL}/assistant`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: payload.name,
      model: {
        provider: 'openai',
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: payload.systemPrompt }],
      },
      voice: {
        provider: '11labs',
        voiceId: payload.voiceId || 'pNinZfobpgDQGcFMajgB', // ElevenLabs Matthew
      },
      firstMessage:
        payload.firstMessage ||
        "Hi! Thanks for calling. How can I help you today?",
    }),
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
  }
) {
  const body: Record<string, unknown> = {}
  if (payload.name) body.name = payload.name
  if (payload.systemPrompt) {
    body.model = {
      provider: 'openai',
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: payload.systemPrompt }],
    }
  }
  if (payload.voiceId) {
    body.voice = { provider: '11labs', voiceId: payload.voiceId }
  }

  const res = await fetch(`${VAPI_BASE_URL}/assistant/${assistantId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function triggerVapiCall(payload: {
  phoneNumberId: string
  assistantId: string
  toPhone: string
  metadata?: Record<string, unknown>
}) {
  const res = await fetch(`${VAPI_BASE_URL}/call`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phoneNumberId: payload.phoneNumberId,
      assistantId: payload.assistantId,
      to: payload.toPhone,
      metadata: payload.metadata || {},
    }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
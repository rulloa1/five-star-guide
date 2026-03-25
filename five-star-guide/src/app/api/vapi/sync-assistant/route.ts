import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createVapiAssistant, updateVapiAssistant } from '@/lib/vapi'

export async function POST(req: NextRequest) {
  const { clientId } = await req.json()

  if (!clientId) {
    return NextResponse.json({ error: 'clientId is required' }, { status: 400 })
  }

  if (!process.env.VAPI_API_KEY) {
    return NextResponse.json({ error: 'VAPI_API_KEY is not configured' }, { status: 500 })
  }

  const client = await prisma.clientAccount.findUnique({
    where: { id: clientId },
    include: { voiceAgents: true },
  })

  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  const agent = client.voiceAgents[0]

  const systemPrompt =
    agent?.systemPrompt ||
    client.prompt ||
    `You are a helpful receptionist for ${client.name}. Your goal is to qualify the lead and book an appointment.`

  const voiceId = agent?.voiceId || 'pNInz6obpgDQGcFmaJgB'
  const language = agent?.language || 'en'
  const firstMessage =
    agent?.firstMessage || `Hi, thanks for calling ${client.name}! How can I help you today?`

  // Webhook URL from env or auto-detect
  const webhookUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/vapi/webhook`
    : undefined

  try {
    if (agent?.vapiAssistantId) {
      // Update existing VAPI assistant
      await updateVapiAssistant(agent.vapiAssistantId, {
        name: agent.name,
        systemPrompt,
        voiceId,
        language,
        firstMessage,
        webhookUrl,
      })
      await prisma.voiceAgent.update({
        where: { id: agent.id },
        data: { systemPrompt, status: 'active' },
      })
      return NextResponse.json({
        success: true,
        action: 'updated',
        vapiAssistantId: agent.vapiAssistantId,
      })
    } else {
      // Create new VAPI assistant
      const vapiAssistant = await createVapiAssistant({
        name: agent?.name || `${client.name} Agent`,
        systemPrompt,
        voiceId,
        language,
        firstMessage,
        webhookUrl,
      })

      if (agent) {
        await prisma.voiceAgent.update({
          where: { id: agent.id },
          data: {
            vapiAssistantId: vapiAssistant.id,
            systemPrompt,
            status: 'active',
          },
        })
      } else {
        await prisma.voiceAgent.create({
          data: {
            clientId,
            name: `${client.name} Agent`,
            vapiAssistantId: vapiAssistant.id,
            systemPrompt,
            voiceId,
            language,
            firstMessage,
            status: 'active',
          },
        })
      }

      return NextResponse.json({
        success: true,
        action: 'created',
        vapiAssistantId: vapiAssistant.id,
      })
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

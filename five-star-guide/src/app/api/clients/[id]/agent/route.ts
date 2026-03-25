import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateVapiAssistant } from '@/lib/vapi'

type Params = { params: Promise<{ id: string }> }

// PATCH /api/clients/[id]/agent — update agent config + optionally sync to Vapi
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id: clientId } = await params
  const body = await req.json()
  const { systemPrompt, voiceId, language, firstMessage, syncToVapi } = body

  const agent = await prisma.voiceAgent.findFirst({ where: { clientId } })

  const updateData: Record<string, unknown> = {}
  if (systemPrompt !== undefined) updateData.systemPrompt = systemPrompt
  if (voiceId !== undefined) updateData.voiceId = voiceId
  if (language !== undefined) updateData.language = language
  if (firstMessage !== undefined) updateData.firstMessage = firstMessage

  let updatedAgent

  if (agent) {
    updatedAgent = await prisma.voiceAgent.update({
      where: { id: agent.id },
      data: updateData,
    })
  } else {
    // Create a voice agent record if one doesn't exist yet
    const client = await prisma.clientAccount.findUnique({ where: { id: clientId } })
    updatedAgent = await prisma.voiceAgent.create({
      data: {
        clientId,
        name: `${client?.name || 'Client'} Agent`,
        systemPrompt: systemPrompt || null,
        voiceId: voiceId || 'pNInz6obpgDQGcFmaJgB',
        language: language || 'en',
        firstMessage: firstMessage || null,
        status: 'inactive',
      },
    })
  }

  // Optionally push changes to Vapi immediately
  if (syncToVapi && updatedAgent.vapiAssistantId && process.env.VAPI_API_KEY) {
    try {
      const webhookUrl = process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/vapi/webhook`
        : undefined

      await updateVapiAssistant(updatedAgent.vapiAssistantId, {
        systemPrompt: updatedAgent.systemPrompt || undefined,
        voiceId: updatedAgent.voiceId || undefined,
        language: updatedAgent.language || undefined,
        firstMessage: updatedAgent.firstMessage || undefined,
        webhookUrl,
      })
      await prisma.voiceAgent.update({
        where: { id: updatedAgent.id },
        data: { status: 'active' },
      })
    } catch {
      // Don't fail the whole request if Vapi sync fails
    }
  }

  return NextResponse.json({ success: true, agent: updatedAgent })
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// VAPI sends various event types; we handle the most important ones
export async function POST(req: NextRequest) {
  const body = await req.json()

  // Only process end-of-call reports
  if (body.type !== 'end-of-call-report') {
    return NextResponse.json({ received: true })
  }

  const { call, transcript, recordingUrl, summary, durationSeconds } = body
  const assistantId: string | undefined = call?.assistantId
  const callerPhone: string | undefined = call?.customer?.number

  if (!assistantId) {
    return NextResponse.json({ error: 'No assistantId in payload' }, { status: 400 })
  }

  // Find the VoiceAgent and their client by VAPI assistant ID
  const voiceAgent = await prisma.voiceAgent.findFirst({
    where: { vapiAssistantId: assistantId },
    include: { client: true },
  })

  if (!voiceAgent) {
    console.error(`VoiceAgent not found for vapiAssistantId: ${assistantId}`)
    return NextResponse.json({ error: 'VoiceAgent not found' }, { status: 404 })
  }

  const clientId = voiceAgent.clientId

  // Find or create Lead from caller's phone number
  let lead = callerPhone
    ? await prisma.lead.findFirst({ where: { clientId, phone: callerPhone } })
    : null

  if (!lead) {
    lead = await prisma.lead.create({
      data: {
        clientId,
        name: callerPhone || 'Unknown Caller',
        phone: callerPhone ?? null,
        status: 'New',
        notes: summary || null,
      },
    })
  } else {
    // Infer status from transcript keywords
    const lower = (transcript ?? '').toLowerCase()
    const isBooked =
      lower.includes('appointment') ||
      lower.includes('booked') ||
      lower.includes('scheduled')
    const needsCallback =
      lower.includes('call me back') ||
      lower.includes('callback') ||
      lower.includes('call back') ||
      lower.includes('try again later') ||
      lower.includes('not a good time')
    const newStatus = isBooked
      ? 'Booked'
      : needsCallback
      ? 'Callback Needed'
      : lead.status === 'New'
      ? 'Qualified'
      : lead.status
    if (newStatus !== lead.status || summary) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          status: newStatus,
          notes: summary || lead.notes,
        },
      })
    }
  }

  // Create CallLog
  await prisma.callLog.create({
    data: {
      leadId: lead.id,
      transcript: transcript ?? null,
      recordingUrl: recordingUrl ?? null,
      durationSeconds: typeof durationSeconds === 'number' ? durationSeconds : null,
      status: 'completed',
    },
  })

  return NextResponse.json({ success: true, leadId: lead.id })
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { triggerVapiCall } from '@/lib/vapi'

/**
 * POST /api/leads/[id]/callback
 *
 * Triggers an immediate outbound callback to a lead from the dashboard.
 * Uses VAPI_CALLBACK_PHONE_NUMBER_ID and VAPI_CALLBACK_ASSISTANT_ID env vars.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth()
  if (auth instanceof NextResponse) return auth

  const { id } = await params
  const lead = await prisma.lead.findFirst({
    where: { id, client: { agencyId: auth.agencyId } },
    include: { client: true },
  })

  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }

  if (!lead.phone) {
    return NextResponse.json({ error: 'Lead has no phone number' }, { status: 400 })
  }

  const phoneNumberId = process.env.VAPI_CALLBACK_PHONE_NUMBER_ID
  const assistantId = process.env.VAPI_CALLBACK_ASSISTANT_ID

  if (!phoneNumberId || !assistantId) {
    return NextResponse.json(
      { error: 'VAPI_CALLBACK_PHONE_NUMBER_ID and VAPI_CALLBACK_ASSISTANT_ID must be set' },
      { status: 500 }
    )
  }

  // Prefer the client's active agent if available
  const agent = await prisma.voiceAgent.findFirst({
    where: { clientId: lead.clientId, status: 'active' },
    select: { vapiAssistantId: true },
  })
  const resolvedAssistantId = agent?.vapiAssistantId ?? assistantId

  const call = await triggerVapiCall({
    phoneNumberId,
    assistantId: resolvedAssistantId,
    toPhone: lead.phone,
    metadata: {
      firstName: lead.name.split(' ')[0],
      company: lead.client.name,
      leadId: id,
      callType: 'callback',
    },
  })

  // Mark lead as callback in progress
  await prisma.lead.update({
    where: { id: lead.id },
    data: { status: 'Callback Needed' },
  })

  return NextResponse.json({ success: true, callId: call.id, status: call.status })
}

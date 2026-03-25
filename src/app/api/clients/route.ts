import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  const auth = await requireAuth()
  if (auth instanceof NextResponse) return auth

  const clients = await prisma.clientAccount.findMany({
    where: { agencyId: auth.agencyId },
    include: {
      voiceAgents: { select: { id: true, status: true } },
      _count: { select: { leads: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Get call counts per client
  const callCounts = await prisma.callLog.groupBy({
    by: ['leadId'],
    where: {
      lead: { client: { agencyId: auth.agencyId } },
    },
    _count: { id: true },
  })

  // Map lead → client for call counts
  const leadsWithClients = await prisma.lead.findMany({
    where: { client: { agencyId: auth.agencyId } },
    select: { id: true, clientId: true },
  })

  const callsByClient: Record<string, number> = {}
  for (const { _count, leadId } of callCounts) {
    const lead = leadsWithClients.find((l) => l.id === leadId)
    if (lead) {
      callsByClient[lead.clientId] = (callsByClient[lead.clientId] ?? 0) + _count.id
    }
  }

  const enriched = clients.map((c) => ({
    id: c.id,
    name: c.name,
    industry: c.industry,
    phone: c.phone,
    city: c.city,
    createdAt: c.createdAt,
    status: c.voiceAgents.some((a) => a.status === 'active') ? 'Active' : 'Onboarding',
    agents: c.voiceAgents.length,
    calls: callsByClient[c.id] ?? 0,
    leadCount: c._count.leads,
  }))

  return NextResponse.json(enriched)
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (auth instanceof NextResponse) return auth

  const body = await req.json()
  const { name, industry, phone, city } = body

  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  const client = await prisma.clientAccount.create({
    data: {
      agencyId: auth.agencyId,
      name,
      industry: industry ?? null,
      phone: phone ?? null,
      city: city ?? null,
    },
  })

  return NextResponse.json(client, { status: 201 })
}

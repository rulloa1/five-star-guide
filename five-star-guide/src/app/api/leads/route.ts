import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = await requireAuth()
  if (auth instanceof NextResponse) return auth

  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId')
  const status = searchParams.get('status')

  const leads = await prisma.lead.findMany({
    where: {
      client: { agencyId: auth.agencyId },
      ...(clientId ? { clientId } : {}),
      ...(status ? { status } : {}),
    },
    include: {
      client: { select: { id: true, name: true } },
      callLogs: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { createdAt: true, durationSeconds: true, status: true },
      },
      appointments: {
        orderBy: { startTime: 'desc' },
        take: 1,
        select: { id: true, startTime: true, status: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

  return NextResponse.json(leads)
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth()
  if (auth instanceof NextResponse) return auth

  const body = await req.json()
  const { id, status, notes } = body

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  // Verify lead belongs to this agency
  const lead = await prisma.lead.findFirst({
    where: { id, client: { agencyId: auth.agencyId } },
  })
  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }

  const updated = await prisma.lead.update({
    where: { id },
    data: {
      ...(status !== undefined ? { status } : {}),
      ...(notes !== undefined ? { notes } : {}),
    },
  })

  return NextResponse.json(updated)
}

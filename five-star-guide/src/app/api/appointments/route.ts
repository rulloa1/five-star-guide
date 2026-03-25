import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = await requireAuth()
  if (auth instanceof NextResponse) return auth

  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('clientId')
  const status = searchParams.get('status')

  const appointments = await prisma.appointment.findMany({
    where: {
      client: { agencyId: auth.agencyId },
      ...(clientId ? { clientId } : {}),
      ...(status ? { status } : {}),
    },
    include: {
      client: { select: { id: true, name: true } },
      lead: { select: { id: true, name: true, phone: true } },
    },
    orderBy: { startTime: 'desc' },
    take: 100,
  })

  return NextResponse.json(appointments)
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth()
  if (auth instanceof NextResponse) return auth

  const body = await req.json()
  const { id, status, notes, startTime, endTime } = body

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 })
  }

  const appt = await prisma.appointment.findFirst({
    where: { id, client: { agencyId: auth.agencyId } },
  })
  if (!appt) {
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data: {
      ...(status !== undefined ? { status } : {}),
      ...(notes !== undefined ? { notes } : {}),
      ...(startTime !== undefined ? { startTime: new Date(startTime) } : {}),
      ...(endTime !== undefined ? { endTime: new Date(endTime) } : {}),
    },
    include: {
      client: { select: { id: true, name: true } },
      lead: { select: { id: true, name: true, phone: true } },
    },
  })

  return NextResponse.json(updated)
}

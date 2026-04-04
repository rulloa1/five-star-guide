import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = await prisma.clientAccount.findUnique({
    where: { id },
    include: {
      voiceAgents: true,
      phoneNumbers: true,
      leads: {
        include: {
          callLogs: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
    },
  })

  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  return NextResponse.json(client)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json()

  const client = await prisma.clientAccount.update({
    where: { id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.industry !== undefined && { industry: body.industry }),
      ...(body.emergencyToggle !== undefined && { emergencyToggle: body.emergencyToggle }),
      ...(body.prompt !== undefined && { prompt: body.prompt }),
    },
  })

  return NextResponse.json(client)
}

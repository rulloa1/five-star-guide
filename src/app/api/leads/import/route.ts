
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import Papa from 'papaparse'

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (auth instanceof NextResponse) return auth

  const formData = await req.formData()
  const file = formData.get('file') as File
  const clientId = formData.get('clientId') as string | null

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }
  if (!clientId) {
    return NextResponse.json({ error: 'clientId is required' }, { status: 400 })
  }

  // Verify the client belongs to this agency
  const client = await prisma.clientAccount.findFirst({
    where: { id: clientId, agencyId: auth.agencyId },
  })
  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  const fileContent = await file.text()

  try {
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    })

    const leads = parsed.data as { name: string; phone: string; email?: string }[]

    const createdLeads = await prisma.lead.createMany({
      data: leads.map((lead) => ({
        clientId,
        name: lead.name,
        phone: lead.phone ?? null,
        email: lead.email ?? null,
        status: 'New',
      })),
      skipDuplicates: true,
    })

    return NextResponse.json({ success: true, count: createdLeads.count })
  } catch (error) {
    console.error('Error parsing or creating leads:', error)
    return NextResponse.json({ error: 'Failed to process CSV file' }, { status: 500 })
  }
}

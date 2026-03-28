
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Papa from 'papaparse'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const fileContent = await file.text()

  try {
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    })

    const leads = parsed.data as { name: string; phone: string; email?: string }[]
    
    // In a real app, you'd get this from the user's session
    const clientId = "clyb3u23b0000c29m9a3k5j8h";

    const createdLeads = await prisma.lead.createMany({
      data: leads.map((lead) => ({
        clientId: clientId,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        status: 'Not Contacted',
      })),
      skipDuplicates: true,
    })

    return NextResponse.json({ success: true, count: createdLeads.count })
  } catch (error) {
    console.error("Error parsing or creating leads:", error)
    return NextResponse.json({ error: 'Failed to process CSV file' }, { status: 500 })
  }
}

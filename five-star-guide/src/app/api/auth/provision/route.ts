import { NextResponse } from 'next/server'
import { getSupabaseUser } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'

/**
 * Called after a successful Supabase login to ensure the user
 * has an Agency and User record in the database.
 * Safe to call multiple times — idempotent.
 */
export async function POST() {
  const user = await getSupabaseUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Check if user already provisioned
  const existing = await prisma.user.findUnique({ where: { id: user.id } })
  if (existing) {
    return NextResponse.json({ agencyId: existing.agencyId, provisioned: false })
  }

  // Create Agency and User in a transaction
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const email = user.email ?? 'unknown@agency.com'
    const agencyName =
      user.user_metadata?.agency_name ||
      (email.includes('@') ? `${email.split('@')[0]}'s Agency` : 'My Agency')

    const agency = await tx.agency.create({
      data: { name: agencyName },
    })

    const dbUser = await tx.user.create({
      data: {
        id: user.id, // Use Supabase UUID as DB primary key
        email,
        name: user.user_metadata?.full_name ?? null,
        agencyId: agency.id,
      },
    })

    return { agency, dbUser }
  })

  return NextResponse.json({
    agencyId: result.agency.id,
    provisioned: true,
  })
}
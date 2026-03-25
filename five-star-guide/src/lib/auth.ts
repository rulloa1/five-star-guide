import { getSupabaseUser } from './supabase-server'
import { prisma } from './prisma'
import { NextResponse } from 'next/server'

/**
 * Gets the agencyId for the currently authenticated Supabase user.
 * Returns null if the user is not authenticated or has no DB record.
 */
export async function getAgencyId(): Promise<string | null> {
  const user = await getSupabaseUser()
  if (!user) return null

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  return dbUser?.agencyId ?? null
}

/**
 * Helper for API route handlers: returns agencyId or a 401 NextResponse.
 * Usage:
 *   const result = await requireAuth()
 *   if (result instanceof NextResponse) return result
 *   const { agencyId } = result
 */
export async function requireAuth(): Promise<{ agencyId: string; userId: string } | NextResponse> {
  const user = await getSupabaseUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser) {
    return NextResponse.json(
      { error: 'User not provisioned. Please log in again.' },
      { status: 401 }
    )
  }

  return { agencyId: dbUser.agencyId, userId: dbUser.id }
}

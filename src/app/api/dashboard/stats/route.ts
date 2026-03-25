import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  const auth = await requireAuth()
  if (auth instanceof NextResponse) return auth

  const { agencyId } = auth

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

  const [
    totalClients,
    lastMonthClients,
    activeAgents,
    lastMonthAgents,
    minutesThisMonth,
    minutesLastMonth,
    appointmentsThisMonth,
    appointmentsLastMonth,
    recentClients,
  ] = await Promise.all([
    prisma.clientAccount.count({ where: { agencyId } }),
    prisma.clientAccount.count({
      where: { agencyId, createdAt: { lt: startOfMonth } },
    }),
    prisma.voiceAgent.count({
      where: { client: { agencyId }, status: 'active' },
    }),
    prisma.voiceAgent.count({
      where: {
        client: { agencyId },
        status: 'active',
        updatedAt: { lt: startOfMonth },
      },
    }),
    prisma.callLog.aggregate({
      where: {
        lead: { client: { agencyId } },
        createdAt: { gte: startOfMonth },
      },
      _sum: { durationSeconds: true },
    }),
    prisma.callLog.aggregate({
      where: {
        lead: { client: { agencyId } },
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
      _sum: { durationSeconds: true },
    }),
    prisma.appointment.count({
      where: {
        client: { agencyId },
        createdAt: { gte: startOfMonth },
      },
    }),
    prisma.appointment.count({
      where: {
        client: { agencyId },
        createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
    }),
    prisma.clientAccount.findMany({
      where: { agencyId },
      include: {
        voiceAgents: { select: { id: true, status: true } },
        _count: { select: { leads: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  const pct = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%'
    const diff = ((current - previous) / previous) * 100
    return `${diff >= 0 ? '+' : ''}${Math.round(diff)}%`
  }

  const thisMonthMinutes = Math.round((minutesThisMonth._sum.durationSeconds ?? 0) / 60)
  const lastMonthMinutes = Math.round((minutesLastMonth._sum.durationSeconds ?? 0) / 60)

  return NextResponse.json({
    stats: {
      totalClients: { value: totalClients, change: pct(totalClients, lastMonthClients) },
      activeAgents: { value: activeAgents, change: pct(activeAgents, lastMonthAgents) },
      minutesThisMonth: {
        value: thisMonthMinutes.toLocaleString(),
        change: pct(thisMonthMinutes, lastMonthMinutes),
      },
      appointmentsThisMonth: {
        value: appointmentsThisMonth,
        change: pct(appointmentsThisMonth, appointmentsLastMonth),
      },
    },
    recentClients: recentClients.map((c) => ({
      id: c.id,
      name: c.name,
      industry: c.industry,
      status: c.voiceAgents.some((a) => a.status === 'active') ? 'Active' : 'Onboarding',
      agents: c.voiceAgents.length,
      leadCount: c._count.leads,
    })),
  })
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Users, Bot, PhoneCall, CalendarCheck, Zap, TrendingUp } from 'lucide-react'

interface StatItem {
  value: string | number
  change: string
}

interface DashboardStats {
  stats: {
    totalClients: StatItem
    activeAgents: StatItem
    minutesThisMonth: StatItem
    appointmentsThisMonth: StatItem
  }
  recentClients: {
    id: string
    name: string
    industry: string | null
    status: string
    agents: number
    leadCount: number
  }[]
}

function StatCard({
  name,
  stat,
  change,
  icon: Icon,
}: {
  name: string
  stat: string | number
  change: string
  icon: React.ElementType
}) {
  const isPositive = change.startsWith('+') || change === '0%'
  return (
    <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition-all">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150" />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="w-12 h-12 bg-zinc-800/50 rounded-xl flex items-center justify-center border border-zinc-700/50">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
        <span
          className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium ${
            isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          }`}
        >
          {change}
        </span>
      </div>
      <div className="relative z-10">
        <p className="text-3xl font-bold text-white mb-1">{stat}</p>
        <p className="text-zinc-400 text-sm font-medium">{name}</p>
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <tr>
      <td className="px-6 py-4">
        <div className="h-4 bg-zinc-800 rounded animate-pulse w-32 mb-1" />
        <div className="h-3 bg-zinc-800/60 rounded animate-pulse w-20" />
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-zinc-800 rounded-full animate-pulse w-20" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-zinc-800 rounded animate-pulse w-8" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-zinc-800 rounded animate-pulse w-12" />
      </td>
    </tr>
  )
}

export default function DashboardHome() {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const statCards = data
    ? [
        {
          name: 'Total Clients',
          stat: data.stats.totalClients.value,
          change: data.stats.totalClients.change,
          icon: Users,
        },
        {
          name: 'Active Voice Agents',
          stat: data.stats.activeAgents.value,
          change: data.stats.activeAgents.change,
          icon: Bot,
        },
        {
          name: 'Minutes Used (This Month)',
          stat: data.stats.minutesThisMonth.value,
          change: data.stats.minutesThisMonth.change,
          icon: PhoneCall,
        },
        {
          name: 'Booked Appointments',
          stat: data.stats.appointmentsThisMonth.value,
          change: data.stats.appointmentsThisMonth.change,
          icon: CalendarCheck,
        },
      ]
    : []

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold pb-2 tracking-tight text-white mb-2">
          Welcome back
        </h1>
        <p className="text-zinc-400">Here&apos;s what&apos;s happening across your agency today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading
          ? [0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass-dark p-6 rounded-2xl border border-zinc-800/60 animate-pulse"
              >
                <div className="h-12 w-12 bg-zinc-800 rounded-xl mb-4" />
                <div className="h-8 bg-zinc-800 rounded w-16 mb-2" />
                <div className="h-4 bg-zinc-800/60 rounded w-24" />
              </div>
            ))
          : statCards.map((item) => <StatCard key={item.name} {...item} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Clients */}
        <div className="lg:col-span-2 glass-dark rounded-2xl border border-zinc-800/60 shadow-lg overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-800/50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Recent Clients</h2>
              <p className="text-zinc-400 text-sm mt-1">
                Most recently added accounts
              </p>
            </div>
            <Link
              href="/dashboard/clients"
              className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center transition-colors"
            >
              View all <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/50 text-zinc-400 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium border-b border-zinc-800">Company</th>
                  <th className="px-6 py-4 font-medium border-b border-zinc-800">Status</th>
                  <th className="px-6 py-4 font-medium border-b border-zinc-800">Agents</th>
                  <th className="px-6 py-4 font-medium border-b border-zinc-800">Leads</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {loading ? (
                  [0, 1, 2, 3].map((i) => <SkeletonRow key={i} />)
                ) : data?.recentClients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                      No clients yet.{' '}
                      <Link href="/dashboard/clients" className="text-blue-400 hover:underline">
                        Add your first client →
                      </Link>
                    </td>
                  </tr>
                ) : (
                  data?.recentClients.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-zinc-800/20 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/clients/${client.id}`} className="flex flex-col">
                          <span className="text-white font-medium hover:text-blue-400 transition-colors">
                            {client.name}
                          </span>
                          <span className="text-zinc-500 text-xs mt-0.5">{client.industry}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            client.status === 'Active'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          }`}
                        >
                          {client.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-300">{client.agents}</td>
                      <td className="px-6 py-4 text-zinc-300">{client.leadCount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Status */}
        <div className="flex flex-col gap-6">
          <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <h2 className="text-lg font-bold text-white mb-4 relative z-10">Quick Actions</h2>
            <div className="space-y-3 relative z-10">
              <Link
                href="/dashboard/clients"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all text-sm font-medium text-white group"
              >
                <span className="flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <Users className="w-4 h-4" />
                  </span>
                  Add New Client
                </span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </Link>
              <Link
                href="/dashboard/leads"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all text-sm font-medium text-white group"
              >
                <span className="flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  View CRM Pipeline
                </span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </Link>
              <Link
                href="/dashboard/templates"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all text-sm font-medium text-white group"
              >
                <span className="flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <Bot className="w-4 h-4" />
                  </span>
                  Clone Agent Template
                </span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>

          <div className="glass-dark p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <div className="flex items-center mb-4 relative z-10">
              <Zap className="w-5 h-5 text-blue-400 mr-2 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
              <h2 className="text-lg font-bold text-white">System Status</h2>
            </div>
            <p className="text-sm text-zinc-300 mb-4 relative z-10">
              All systems operational. Vapi webhook processing time is under 150ms.
            </p>
            <div className="w-full bg-zinc-900 rounded-full h-2 border border-zinc-800">
              <div className="bg-blue-500 h-2 rounded-full w-full drop-shadow-[0_0_5px_rgba(59,130,246,0.6)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

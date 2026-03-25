import Link from 'next/link'
import { ArrowUpRight, Users, Bot, PhoneCall, CalendarCheck, Zap } from 'lucide-react'

// Mock Data
const stats = [
  { name: 'Total Clients', stat: '24', icon: Users, change: '12%', changeType: 'increase' },
  { name: 'Active Voice Agents', stat: '18', icon: Bot, change: '18%', changeType: 'increase' },
  { name: 'Minutes Used (This Month)', stat: '4,231', icon: PhoneCall, change: '5%', changeType: 'increase' },
  { name: 'Booked Appointments', stat: '142', icon: CalendarCheck, change: '34%', changeType: 'increase' },
]

const recentClients = [
  { id: '1', name: 'Apex Plumbing', industry: 'Plumbing', status: 'Active', agents: 2, calls: 145 },
  { id: '2', name: 'CoolBreeze HVAC', industry: 'HVAC', status: 'Active', agents: 1, calls: 89 },
  { id: '3', name: 'Summit Roofing', industry: 'Roofing', status: 'Onboarding', agents: 0, calls: 0 },
  { id: '4', name: 'City Garage Doors', industry: 'Garage Door Repair', status: 'Active', agents: 1, calls: 42 },
]

export default function DashboardHome() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold pb-2 tracking-tight text-white mb-2">Welcome back, Admin</h1>
        <p className="text-zinc-400">Here's what's happening across your agency today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item) => (
          <div key={item.name} className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 bg-zinc-800/50 rounded-xl flex items-center justify-center border border-zinc-700/50">
                <item.icon className="w-6 h-6 text-blue-400" />
              </div>
              <span className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm w-fit font-medium md:mt-2 lg:mt-0 ${
                item.changeType === 'increase' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {item.changeType === 'increase' ? '+' : '-'}{item.change}
              </span>
            </div>
            <div className="relative z-10">
              <p className="text-3xl font-bold text-white mb-1">{item.stat}</p>
              <p className="text-zinc-400 text-sm font-medium">{item.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Clients List */}
        <div className="lg:col-span-2 glass-dark rounded-2xl border border-zinc-800/60 shadow-lg overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-800/50 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Recent Clients</h2>
              <p className="text-zinc-400 text-sm mt-1">Manage and view your most recently added accounts</p>
            </div>
            <Link href="/dashboard/clients" className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center transition-colors">
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
                  <th className="px-6 py-4 font-medium border-b border-zinc-800">Calls (30d)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {recentClients.map((client) => (
                  <tr key={client.id} className="hover:bg-zinc-800/20 transition-colors cursor-pointer" title="View details">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{client.name}</span>
                        <span className="text-zinc-500 text-xs mt-0.5">{client.industry}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        client.status === 'Active' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">{client.agents}</td>
                    <td className="px-6 py-4 text-zinc-300">{client.calls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Usage Alert */}
        <div className="flex flex-col gap-6">
          <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <h2 className="text-lg font-bold text-white mb-4 relative z-10">Quick Actions</h2>
            <div className="space-y-3 relative z-10">
              <Link href="/dashboard/clients" className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all text-sm font-medium text-white group">
                <span className="flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <Users className="w-4 h-4" />
                  </span>
                  Add New Client
                </span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </Link>
              <Link href="/dashboard/templates" className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all text-sm font-medium text-white group">
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
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <div className="flex items-center mb-4 relative z-10">
              <Zap className="w-5 h-5 text-blue-400 mr-2 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
              <h2 className="text-lg font-bold text-white">System Status</h2>
            </div>
            <p className="text-sm text-zinc-300 mb-4 relative z-10">
              All systems operational. Vapi webhook generation processing time is under 150ms.
            </p>
            <div className="w-full bg-zinc-900 rounded-full h-2 border border-zinc-800">
              <div className="bg-blue-500 h-2 rounded-full w-[100%] drop-shadow-[0_0_5px_rgba(59,130,246,0.6)]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

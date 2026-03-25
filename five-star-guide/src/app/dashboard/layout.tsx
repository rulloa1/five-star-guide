'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Menu, 
  X, 
  Bot,
  MessageSquare,
  CalendarDays,
  Megaphone,
  Bell,
  LogOut
} from 'lucide-react'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/dashboard/clients', icon: Users },
  { name: 'Templates', href: '/dashboard/templates', icon: Bot },
  { name: 'Leads', href: '/dashboard/leads', icon: MessageSquare },
  { name: 'Appointments', href: '/dashboard/appointments', icon: CalendarDays },
  { name: 'Outreach', href: '/dashboard/outreach', icon: Megaphone },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-blue-500/30 flex dark">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-zinc-900 border-r border-zinc-800 shadow-xl flex flex-col pt-5 pb-4">
          <div className="flex items-center flex-shrink-0 px-4 justify-between">
            <div className="flex items-center">
              <Bot className="w-8 h-8 text-blue-500 mr-2" />
              <span className="font-bold text-xl tracking-tight text-white">ServiceBot</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-8 flex-1 h-0 overflow-y-auto px-2">
            <nav className="space-y-1 block">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/') && item.href !== '/dashboard'
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-600/10 text-blue-500'
                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive ? 'text-blue-500' : 'text-zinc-500 group-hover:text-zinc-300'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-zinc-950 border-r border-zinc-800/50">
            <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-6 mb-8">
                <Bot className="w-8 h-8 text-blue-500 mr-2 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <span className="font-bold text-xl tracking-tight text-white">ServiceBot OS</span>
              </div>
              <nav className="mt-2 flex-1 px-4 space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/') && item.href !== '/dashboard'
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all ${
                        isActive
                          ? 'bg-blue-600/10 text-blue-400 shadow-inner'
                          : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                          isActive ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-zinc-800/50 p-4">
              <Link href="/login" className="flex-shrink-0 w-full group block">
                <div className="flex items-center text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">
                  <LogOut className="mr-3 h-5 w-5 text-zinc-500 group-hover:text-zinc-300" />
                  Sign Out
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden relative">
        {/* Glow Effects hidden on small screens */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        {/* Top Header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 lg:border-none lg:bg-transparent">
          <button
            type="button"
            className="px-4 border-r border-zinc-800 text-zinc-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-end">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <button className="p-2 relative rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors focus:outline-none">
                <span className="sr-only">View notifications</span>
                <Bell className="h-5 w-5" aria-hidden="true" />
                <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-zinc-950" />
              </button>
              
              {/* Profile dropdown stub */}
              <div className="relative">
                <div className="flex items-center space-x-2 cursor-pointer p-1.5 rounded-full hover:bg-zinc-800/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-zinc-800 shadow-sm">
                    AG
                  </div>
                  <span className="hidden md:block text-sm font-medium text-zinc-300 mr-2">Admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content scrollable area */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

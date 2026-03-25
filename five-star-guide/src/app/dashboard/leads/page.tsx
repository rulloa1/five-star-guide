'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, PhoneForwarded, MoreHorizontal, Loader2, Users } from 'lucide-react'

type LeadStatus = 'New' | 'Qualified' | 'Booked' | 'Callback Needed' | 'No Answer' | 'Won' | 'Lost'

interface Lead {
  id: string
  name: string
  phone: string | null
  email: string | null
  status: LeadStatus
  notes: string | null
  createdAt: string
  client: { id: string; name: string }
  callLogs: { createdAt: string; durationSeconds: number | null; status: string }[]
  appointments: { id: string; startTime: string; status: string }[]
}

const STATUS_CONFIG: Record<LeadStatus, { color: string; bg: string; border: string }> = {
  New: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  Qualified: { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  Booked: { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  'Callback Needed': { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  'No Answer': { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  Won: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  Lost: { color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20' },
}

const KANBAN_COLUMNS: { key: LeadStatus; name: string }[] = [
  { key: 'New', name: 'New Leads' },
  { key: 'Qualified', name: 'Qualified' },
  { key: 'Booked', name: 'Booked' },
  { key: 'Callback Needed', name: 'Needs Callback' },
  { key: 'Lost', name: 'Lost / No Show' },
]

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban')
  const [searchQuery, setSearchQuery] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/leads')
      if (res.ok) setLeads(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const updateStatus = async (leadId: string, status: LeadStatus) => {
    setUpdatingId(leadId)
    try {
      await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status }),
      })
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status } : l)))
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.phone ?? '').includes(searchQuery) ||
      l.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const byStatus = (status: LeadStatus) => filtered.filter((l) => l.status === status)

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col pb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold pb-2 tracking-tight text-white mb-1">CRM Pipeline</h1>
          <p className="text-zinc-400 text-sm">
            Track all incoming AI interactions and lead statuses across clients.
          </p>
        </div>
        <div className="flex space-x-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'kanban' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              List
            </button>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white text-sm font-medium rounded-xl transition-all">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6 flex-shrink-0">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-zinc-800 rounded-xl leading-5 bg-zinc-900/50 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search leads by name, phone, or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <span className="text-sm text-zinc-500">
          {loading ? '...' : `${filtered.length} lead${filtered.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      ) : leads.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
          <Users className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-lg font-medium">No leads yet</p>
          <p className="text-sm mt-1">Leads will appear here once your voice agents start taking calls.</p>
        </div>
      ) : viewMode === 'kanban' ? (
        <div className="flex-1 overflow-x-auto flex space-x-6 pb-4">
          {KANBAN_COLUMNS.map((col) => {
            const colLeads = byStatus(col.key)
            const cfg = STATUS_CONFIG[col.key]
            return (
              <div key={col.key} className="flex-shrink-0 w-80 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${cfg.bg} border ${cfg.border}`} />
                    <h3 className={`font-bold ${cfg.color}`}>{col.name}</h3>
                  </div>
                  <span className="text-zinc-500 text-sm font-medium bg-zinc-900 px-2 py-0.5 rounded-full">
                    {colLeads.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {colLeads.length === 0 ? (
                    <div className={`p-4 rounded-xl border ${cfg.border} ${cfg.bg} opacity-40 text-center text-sm ${cfg.color}`}>
                      Empty
                    </div>
                  ) : (
                    colLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="glass-dark p-4 rounded-xl border border-zinc-800/60 hover:border-zinc-600 transition-colors shadow-sm cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-bold">{lead.name}</h4>
                          <div className="relative">
                            <button
                              className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                const next = KANBAN_COLUMNS.find((c) => c.key !== lead.status)
                                if (next) updateStatus(lead.id, next.key)
                              }}
                            >
                              {updatingId === lead.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        {lead.phone && <div className="text-sm text-zinc-400 mb-2">{lead.phone}</div>}
                        {lead.notes && (
                          <div className="inline-flex px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 mb-3 font-medium max-w-full truncate">
                            {lead.notes}
                          </div>
                        )}
                        <div className="flex justify-between items-center text-xs text-zinc-500 border-t border-zinc-800/50 pt-3">
                          <span>{lead.client.name}</span>
                          <span>{timeAgo(lead.createdAt)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead className="bg-zinc-900/80">
                <tr>
                  {['Lead', 'Client', 'Status', 'Notes', 'Date'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 bg-transparent">
                {filtered.map((lead) => {
                  const cfg = STATUS_CONFIG[lead.status] ?? STATUS_CONFIG.New
                  return (
                    <tr key={lead.id} className="hover:bg-zinc-800/30 cursor-pointer transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-white">{lead.name}</div>
                        <div className="text-sm text-zinc-500">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                        {lead.client.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={lead.status}
                          onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                          className={`px-2.5 py-1 text-xs leading-5 font-semibold rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border} bg-transparent cursor-pointer focus:outline-none`}
                        >
                          {Object.keys(STATUS_CONFIG).map((s) => (
                            <option key={s} value={s} className="bg-zinc-900 text-white">
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300 max-w-xs truncate">
                        {lead.notes ?? '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                        {timeAgo(lead.createdAt)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

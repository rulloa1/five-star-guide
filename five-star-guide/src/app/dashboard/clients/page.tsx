'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, MoreVertical, Building2, Phone, MapPin, X, ArrowRight, Loader2 } from 'lucide-react'

interface Client {
  id: string
  name: string
  industry: string | null
  phone: string | null
  city: string | null
  status: string
  agents: number
  calls: number
  leadCount: number
}

const INDUSTRIES = [
  'Plumbing', 'HVAC', 'Roofing', 'Electrical', 'Garage Door Repair',
  'Pest Control', 'Landscaping', 'Painting', 'Flooring', 'Security Services', 'Other',
]

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newClient, setNewClient] = useState({ name: '', industry: 'Plumbing', phone: '', city: '' })
  const [error, setError] = useState<string | null>(null)

  const fetchClients = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/clients')
      if (res.ok) {
        const data = await res.json()
        setClients(data)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchClients() }, [fetchClients])

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.industry ?? '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Failed to create client')
        return
      }
      setIsModalOpen(false)
      setNewClient({ name: '', industry: 'Plumbing', phone: '', city: '' })
      await fetchClients()
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold pb-2 tracking-tight text-white mb-1">Clients</h1>
          <p className="text-zinc-400 text-sm">Manage your agency&apos;s clients and their voice agents.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-zinc-800 rounded-xl leading-5 bg-zinc-900/50 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Clients Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="glass-dark rounded-2xl border border-zinc-800/60 p-6 animate-pulse">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 mr-4" />
                <div className="flex-1">
                  <div className="h-5 bg-zinc-800 rounded w-32 mb-2" />
                  <div className="h-3 bg-zinc-800/60 rounded w-20" />
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="h-4 bg-zinc-800/60 rounded w-40" />
                <div className="h-4 bg-zinc-800/60 rounded w-32" />
              </div>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800">
                <div className="h-12 bg-zinc-800/60 rounded-xl" />
                <div className="h-12 bg-zinc-800/60 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
          <Building2 className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-lg font-medium mb-2">
            {searchQuery ? 'No clients match your search' : 'No clients yet'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add your first client
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Link href={`/dashboard/clients/${client.id}`} key={client.id} className="block group">
              <div className="glass-dark rounded-2xl border border-zinc-800/60 p-6 hover:border-blue-500/30 hover:bg-zinc-800/40 transition-all relative overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 right-0 p-4">
                  <button
                    className="text-zinc-500 hover:text-white transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mr-4 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
                    <span className="text-lg font-bold text-zinc-300 group-hover:text-blue-400">
                      {client.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {client.name}
                    </h3>
                    <p className="text-sm text-zinc-400">{client.industry ?? 'Unknown Industry'}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6 flex-1">
                  {client.phone && (
                    <div className="flex items-center text-sm text-zinc-400">
                      <Phone className="w-4 h-4 mr-2 text-zinc-600" />
                      {client.phone}
                    </div>
                  )}
                  {client.city && (
                    <div className="flex items-center text-sm text-zinc-400">
                      <MapPin className="w-4 h-4 mr-2 text-zinc-600" />
                      {client.city}
                    </div>
                  )}
                  <div className="flex items-center mt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        client.status === 'Active'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}
                    >
                      {client.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-800/50">
                  <div className="bg-zinc-900/60 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-white">{client.agents}</p>
                    <p className="text-zinc-500 text-xs">Agents</p>
                  </div>
                  <div className="bg-zinc-900/60 rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-white">{client.leadCount}</p>
                    <p className="text-zinc-500 text-xs">Leads</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{client.calls} total calls</span>
                  <span className="text-blue-400 group-hover:text-blue-300 text-xs font-medium flex items-center transition-colors">
                    Manage <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add New Client</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4">
              {error && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Company Name *</label>
                <input
                  type="text"
                  required
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="e.g. Apex Plumbing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Industry</label>
                <select
                  value={newClient.industry}
                  onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">City</label>
                <input
                  type="text"
                  value={newClient.city}
                  onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  placeholder="Austin, TX"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Creating...' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

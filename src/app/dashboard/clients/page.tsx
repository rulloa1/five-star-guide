'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, MoreVertical, Building2, Phone, MapPin, X, ArrowRight } from 'lucide-react'

const initialClients = [
  { id: '1', name: 'Apex Plumbing', industry: 'Plumbing', phone: '(555) 123-4567', city: 'Austin, TX', status: 'Active', agents: 2, calls: 145, lastActive: '2 hours ago' },
  { id: '2', name: 'CoolBreeze HVAC', industry: 'HVAC', phone: '(555) 987-6543', city: 'Dallas, TX', status: 'Active', agents: 1, calls: 89, lastActive: '1 day ago' },
  { id: '3', name: 'Summit Roofing', industry: 'Roofing', phone: '(555) 456-7890', city: 'Denver, CO', status: 'Onboarding', agents: 0, calls: 0, lastActive: '3 days ago' },
  { id: '4', name: 'City Garage Doors', industry: 'Garage Door Repair', phone: '(555) 222-3333', city: 'Chicago, IL', status: 'Active', agents: 1, calls: 42, lastActive: '5 hours ago' },
]

export default function ClientsPage() {
  const [clients, setClients] = useState(initialClients)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newClient, setNewClient] = useState({ name: '', industry: 'Plumbing', phone: '', city: '' })

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.industry.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault()
    const added = {
      id: Math.random().toString(),
      name: newClient.name,
      industry: newClient.industry,
      phone: newClient.phone,
      city: newClient.city,
      status: 'Onboarding',
      agents: 0,
      calls: 0,
      lastActive: 'Just now'
    }
    setClients([added, ...clients])
    setIsModalOpen(false)
    setNewClient({ name: '', industry: 'Plumbing', phone: '', city: '' })
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold pb-2 tracking-tight text-white mb-1">Clients</h1>
          <p className="text-zinc-400 text-sm">Manage your agency's clients and their voice agents.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </button>
      </div>

      {/* Search and Filter */}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Link href={`/dashboard/clients/${client.id}`} key={client.id} className="block group">
            <div className="glass-dark rounded-2xl border border-zinc-800/60 p-6 hover:border-blue-500/30 hover:bg-zinc-800/40 transition-all relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 p-4">
                <button className="text-zinc-500 hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mr-4 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
                  <span className="text-lg font-bold text-zinc-300 group-hover:text-blue-400">{client.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{client.name}</h3>
                  <p className="text-sm text-zinc-400">{client.industry}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-6 flex-1">
                <div className="flex items-center text-sm text-zinc-400">
                  <MapPin className="w-4 h-4 mr-2 text-zinc-500" /> {client.city}
                </div>
                <div className="flex items-center text-sm text-zinc-400">
                  <Phone className="w-4 h-4 mr-2 text-zinc-500" /> {client.phone}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/50 flex justify-between items-center mt-auto">
                <div className="flex space-x-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-500">Agents</span>
                    <span className="text-sm font-medium text-zinc-300">{client.agents}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-zinc-500">Calls</span>
                    <span className="text-sm font-medium text-zinc-300">{client.calls}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  client.status === 'Active' ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {client.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
        
        {/* Empty State */}
        {filteredClients.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
            <Building2 className="mx-auto h-12 w-12 text-zinc-500 mb-4" />
            <h3 className="text-lg font-medium text-white mb-1">No clients found</h3>
            <p className="text-zinc-400">We couldn't find any clients matching your search.</p>
          </div>
        )}
      </div>

      {/* Create Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white">Add New Client</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateClient} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Company Name</label>
                <input 
                  type="text" required value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                  placeholder="e.g. Apex Plumbing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">Industry Template</label>
                <select 
                  value={newClient.industry} onChange={e => setNewClient({...newClient, industry: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none"
                >
                  <option>Plumbing</option>
                  <option>HVAC</option>
                  <option>Roofing</option>
                  <option>Garage Door Repair</option>
                  <option>Landscaping</option>
                  <option>Cleaning</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">Phone Number</label>
                  <input 
                    type="tel" required value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                    placeholder="(555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">City</label>
                  <input 
                    type="text" required value={newClient.city} onChange={e => setNewClient({...newClient, city: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                    placeholder="Austin, TX"
                  />
                </div>
              </div>
              
              <div className="pt-4 mt-2 border-t border-zinc-800 flex justify-end space-x-3">
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
                >
                  Create Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

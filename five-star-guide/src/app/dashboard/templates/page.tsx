'use client'

import { useState } from 'react'
import { Plus, Copy, Search, Droplets, Wrench, Snowflake, Home, ShieldCheck } from 'lucide-react'

const initialTemplates = [
  { id: '1', name: 'Plumbing - Emergency First', industry: 'Plumbing', isPremium: false, uses: 12, icon: Droplets, color: 'text-blue-400' },
  { id: '2', name: 'HVAC - Service & Quotes', industry: 'HVAC', isPremium: false, uses: 8, icon: Snowflake, color: 'text-cyan-400' },
  { id: '3', name: 'Roofing - Inspection Setter', industry: 'Roofing', isPremium: true, uses: 4, icon: Home, color: 'text-orange-400' },
  { id: '4', name: 'Garage Door - Quick Fix', industry: 'Garage Door Repair', isPremium: false, uses: 7, icon: Wrench, color: 'text-zinc-400' },
  { id: '5', name: 'Security - System Install', industry: 'Security Services', isPremium: true, uses: 2, icon: ShieldCheck, color: 'text-red-400' },
]

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const filteredTemplates = initialTemplates.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.industry.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold pb-2 tracking-tight text-white mb-1">Industry Templates</h1>
          <p className="text-zinc-400 text-sm">Deploy pre-configured voice agents and workflows in one click.</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white text-sm font-medium rounded-xl transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Create Custom Template
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-zinc-800 rounded-xl leading-5 bg-zinc-900/50 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-inner"
            placeholder="Search templates by industry or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="glass-dark rounded-2xl border border-zinc-800/60 p-6 flex flex-col hover:border-blue-500/30 hover:bg-zinc-800/40 transition-all group relative overflow-hidden">
            {template.isPremium && (
              <div className="absolute top-0 right-0 mt-4 mr-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-lg">
                Premium
              </div>
            )}
            
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <template.icon className={`w-6 h-6 ${template.color}`} />
              </div>
              <div className="pr-12">
                <h3 className="text-lg font-bold text-white leading-tight">{template.name}</h3>
                <p className="text-sm text-zinc-400">{template.industry}</p>
              </div>
            </div>
            
            <div className="flex-1 mt-2">
              <div className="text-xs text-zinc-500 mb-4 bg-zinc-900/50 p-2.5 rounded-lg border border-zinc-800/60 font-mono">
                "You are an AI receptionist for a {template.industry.toLowerCase()} company..."
              </div>
              
              <ul className="space-y-2 mb-6 text-sm text-zinc-400">
                <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" /> Pre-configured urgencies</li>
                <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" /> Qualifying questions</li>
                <li className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2" /> Missed call SMS flow</li>
              </ul>
            </div>
            
            <div className="pt-4 border-t border-zinc-800/50 flex justify-between items-center">
              <span className="text-xs font-medium text-zinc-500">{template.uses} Active Agents</span>
              <button className="text-blue-400 hover:text-blue-300 font-medium text-sm flex items-center transition-colors">
                <Copy className="w-4 h-4 mr-1.5" /> Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

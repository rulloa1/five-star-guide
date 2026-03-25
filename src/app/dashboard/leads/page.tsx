'use client'

import { useState } from 'react'
import { Search, Filter, PhoneForwarded, CheckCircle2, Clock, XCircle, MoreHorizontal } from 'lucide-react'

// Dummy kanban data
const initialColumns = {
  new: { name: 'New Leads', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', items: [
    { id: '1', name: 'John Doe', phone: '(555) 123-4567', intent: 'Leaking pipe quote', client: 'Apex Plumbing', time: '10 mins ago' },
    { id: '2', name: 'Sarah Mike', phone: '(555) 987-6543', intent: 'Water heater repair', client: 'Apex Plumbing', time: '1 hour ago' },
  ]},
  qualified: { name: 'Qualified / Booked', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', items: [
    { id: '3', name: 'James Smith', phone: '(555) 555-5555', intent: 'Emergency AC Repair', client: 'CoolBreeze HVAC', time: 'Yesterday' },
  ]},
  callback: { name: 'Needs Callback', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', items: [
    { id: '4', name: 'Emily Clark', phone: '(555) 333-2222', intent: 'Left voicemail', client: 'City Garage Doors', time: '2 days ago' },
  ]},
  lost: { name: 'Lost / No Setup', color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20', items: [
    { id: '5', name: 'Mike Johnson', phone: '(555) 111-9999', intent: 'Too expensive', client: 'Apex Plumbing', time: 'Last week' },
  ]}
}

export default function LeadsPage() {
  const [columns] = useState(initialColumns)
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban')

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col pb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold pb-2 tracking-tight text-white mb-1">CRM Pipeline</h1>
          <p className="text-zinc-400 text-sm">Track all incoming AI interactions and lead statuses across clients.</p>
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
            placeholder="Search leads..."
          />
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="flex-1 overflow-x-auto flex space-x-6 pb-4 cursor-grab">
          {Object.entries(columns).map(([colId, col]) => (
            <div key={colId} className="flex-shrink-0 w-80 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${col.bg} border ${col.border}`}></div>
                  <h3 className={`font-bold ${col.color}`}>{col.name}</h3>
                </div>
                <span className="text-zinc-500 text-sm font-medium bg-zinc-900 px-2 py-0.5 rounded-full">{col.items.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {col.items.map((item) => (
                  <div key={item.id} className="glass-dark p-4 rounded-xl border border-zinc-800/60 hover:border-zinc-600 transition-colors shadow-sm cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-bold">{item.name}</h4>
                      <button className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-sm text-zinc-400 mb-3">{item.phone}</div>
                    <div className="inline-flex px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 mb-4 font-medium">
                      {item.intent}
                    </div>
                    <div className="flex justify-between items-center text-xs text-zinc-500 border-t border-zinc-800/50 pt-3">
                      <span>{item.client}</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800">
              <thead className="bg-zinc-900/80">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Lead</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Client</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Intent</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 bg-transparent">
                  {Object.values(columns).flatMap(col => col.items.map(item => (
                    <tr key={item.id} className="hover:bg-zinc-800/30 cursor-pointer transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-white">{item.name}</div>
                        <div className="text-sm text-zinc-500">{item.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{item.client}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-zinc-800 text-zinc-300">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">{item.intent}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{item.time}</td>
                    </tr>
                  )))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

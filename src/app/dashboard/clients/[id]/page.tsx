'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, Building2, Phone, MapPin, Settings, Bot, Calendar, 
  MessageSquare, Users, Edit3, Power, ExternalLink, Save
} from 'lucide-react'

// Tabs for the workspace
const TABS = [
  { id: 'overview', name: 'Overview', icon: Building2 },
  { id: 'agent', name: 'Voice Agent', icon: Bot },
  { id: 'leads', name: 'Leads & Inbox', icon: MessageSquare },
  { id: 'calendar', name: 'Calendar Sync', icon: Calendar },
  { id: 'settings', name: 'Settings', icon: Settings },
]

export default function ClientWorkspace() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [isSaving, setIsSaving] = useState(false)
  const [emergencyToggle, setEmergencyToggle] = useState(true)
  const [systemPrompt, setSystemPrompt] = useState(`You are a helpful receptionist for Apex Plumbing. 
Your goal is to qualify the lead, ask if it's an emergency, and book an appointment.
If it's an emergency, offer immediate dispatch. Otherwise, find a time tomorrow.`)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1000)
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-6">
        <Link href="/dashboard/clients" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Clients
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mr-5 shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)]">
              <span className="text-2xl font-bold text-blue-400">A</span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center">
                Apex Plumbing
                <span className="ml-3 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider">Active</span>
              </h1>
              <div className="flex items-center mt-1 text-sm text-zinc-400 space-x-4">
                <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1" /> (555) 123-4567</span>
                <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" /> Austin, TX</span>
                <span className="flex items-center text-zinc-500">• ID: {params?.id || '1'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white text-sm font-medium rounded-xl transition-all">
              <ExternalLink className="w-4 h-4 mr-2 text-zinc-400" />
              View Billing
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)] disabled:opacity-70"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-zinc-800 mb-8">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto pb-px">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap flex items-center py-4 px-3 sm:px-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? 'text-blue-500' : 'text-zinc-500'}`} />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Business Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Company Name</label>
                    <input type="text" defaultValue="Apex Plumbing" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Industry</label>
                    <input type="text" defaultValue="Plumbing" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Service Areas</label>
                    <input type="text" defaultValue="Austin, Round Rock, Cedar Park" className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Urgency & Off-Hours Routing</h2>
                <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 mb-4">
                  <div>
                    <p className="font-medium text-white mb-0.5">24/7 Emergency Services Toggle</p>
                    <p className="text-sm text-zinc-400">If enabled, the agent will offer immediate dispatch for urgent jobs.</p>
                  </div>
                  <button 
                    onClick={() => setEmergencyToggle(!emergencyToggle)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${emergencyToggle ? 'bg-blue-600' : 'bg-zinc-700'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emergencyToggle ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-dark p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                <h3 className="text-lg font-bold text-white mb-2 relative z-10">Agent Status</h3>
                <div className="flex items-center mb-6 relative z-10">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></div>
                  <span className="text-zinc-300 font-medium">Online & Receiving Calls</span>
                </div>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Phone</span>
                    <span className="font-mono text-white text-right">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Calls Today</span>
                    <span className="font-medium text-white text-right">14</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Appointments</span>
                    <span className="font-medium text-green-400 text-right">+4</span>
                  </div>
                </div>

                <button className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all relative z-10">
                  Test Call Agent
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agent' && (
          <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">System Prompt Configuration</h2>
                <p className="text-sm text-zinc-400 mt-1">Fine-tune the behavior, personality, and logic of the voice agent.</p>
              </div>
              <button className="flex items-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium border border-zinc-700 rounded-xl transition-colors">
                <Bot className="w-4 h-4 mr-2" />
                Sync to Vapi
              </button>
            </div>
            
            <textarea 
              className="w-full h-96 p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-medium text-zinc-400 mb-2">Voice Model</label>
                 <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none">
                   <option>ElevenLabs - Matthew (Professional)</option>
                   <option>ElevenLabs - Sarah (Friendly)</option>
                   <option>OpenAI - Alloy</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-zinc-400 mb-2">Language</label>
                 <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none">
                   <option>English (US)</option>
                   <option>Spanish (Latin America)</option>
                   <option>Dual-Language (Eng/Spa)</option>
                 </select>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Client Inbox</h2>
              <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">Export CSV</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/50 text-zinc-400 text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium border-b border-zinc-800">Date</th>
                    <th className="px-6 py-4 font-medium border-b border-zinc-800">Lead Info</th>
                    <th className="px-6 py-4 font-medium border-b border-zinc-800">Intent</th>
                    <th className="px-6 py-4 font-medium border-b border-zinc-800">Status</th>
                    <th className="px-6 py-4 font-medium border-b border-zinc-800">Recording</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {/* Mock Lead row */}
                  <tr className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 text-zinc-300 whitespace-nowrap text-sm">Today, 10:45 AM</td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">John Doe</div>
                      <div className="text-zinc-500 text-xs">555-987-6543</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">Leaking Pipe (Urgent)</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">Booked</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">Play Audio</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-6 py-4 text-zinc-300 whitespace-nowrap text-sm">Yesterday, 4:20 PM</td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">Jane Smith</div>
                      <div className="text-zinc-500 text-xs">555-321-0987</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-300">Water heater quote</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500">Qualified</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">Play Audio</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg animate-in fade-in duration-300">
             <div className="flex flex-col items-center justify-center p-12 text-center">
               <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                 <Calendar className="w-10 h-10 text-blue-400" />
               </div>
               <h2 className="text-2xl font-bold text-white mb-2">Google Calendar Integration</h2>
               <p className="text-zinc-400 max-w-lg mb-8">
                 Connect the client's Google Calendar to allow the AI voice agent to book appointments directly into available time slots.
               </p>
               <button className="px-6 py-3 bg-white text-zinc-950 font-bold rounded-xl hover:bg-zinc-200 transition-colors">
                 Connect Google Calendar
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}

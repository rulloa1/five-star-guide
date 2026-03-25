'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft, Building2, Phone, MapPin, Settings, Bot, Calendar,
  MessageSquare, Save, ExternalLink, RefreshCw,
} from 'lucide-react'

const TABS = [
  { id: 'overview', name: 'Overview', icon: Building2 },
  { id: 'agent', name: 'Voice Agent', icon: Bot },
  { id: 'leads', name: 'Leads & Inbox', icon: MessageSquare },
  { id: 'calendar', name: 'Calendar Sync', icon: Calendar },
  { id: 'settings', name: 'Settings', icon: Settings },
]

type CallLog = {
  id: string
  transcript: string | null
  recordingUrl: string | null
  createdAt: string
}

type Lead = {
  id: string
  name: string
  phone: string | null
  status: string
  notes: string | null
  createdAt: string
  callLogs: CallLog[]
}

type VoiceAgent = {
  id: string
  name: string
  vapiAssistantId: string | null
  systemPrompt: string | null
  status: string
}

type PhoneNumber = {
  id: string
  phoneNumber: string
}

type ClientData = {
  id: string
  name: string
  industry: string | null
  phone: string | null
  city: string | null
  emergencyToggle: boolean
  prompt: string | null
  leads: Lead[]
  voiceAgents: VoiceAgent[]
  phoneNumbers: PhoneNumber[]
}

const STATUS_COLORS: Record<string, string> = {
  Booked: 'bg-green-500/10 text-green-400',
  Qualified: 'bg-yellow-500/10 text-yellow-500',
  New: 'bg-blue-500/10 text-blue-400',
  'Callback Needed': 'bg-orange-500/10 text-orange-400',
  'No Answer': 'bg-zinc-500/10 text-zinc-400',
  Won: 'bg-emerald-500/10 text-emerald-400',
  Lost: 'bg-red-500/10 text-red-400',
}

export default function ClientWorkspace() {
  const params = useParams()
  const clientId = params?.id as string

  const [client, setClient] = useState<ClientData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  // Form state
  const [isSaving, setIsSaving] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [emergencyToggle, setEmergencyToggle] = useState(false)
  const [systemPrompt, setSystemPrompt] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientIndustry, setClientIndustry] = useState('')

  const fetchClient = () => {
    if (!clientId) return
    fetch(`/api/clients/${clientId}`)
      .then((r) => r.json())
      .then((data: ClientData) => {
        setClient(data)
        setEmergencyToggle(data.emergencyToggle)
        setSystemPrompt(data.prompt || data.voiceAgents?.[0]?.systemPrompt || '')
        setClientName(data.name)
        setClientIndustry(data.industry || '')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchClient()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId])

  const handleSave = async () => {
    setIsSaving(true)
    await fetch(`/api/clients/${clientId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: clientName,
        industry: clientIndustry,
        emergencyToggle,
        prompt: systemPrompt,
      }),
    })
    setIsSaving(false)
  }

  const handleSyncToVapi = async () => {
    setIsSyncing(true)
    setSyncStatus('idle')
    try {
      const res = await fetch('/api/vapi/sync-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
      })
      if (res.ok) {
        setSyncStatus('success')
        fetchClient()
      } else {
        setSyncStatus('error')
      }
    } catch {
      setSyncStatus('error')
    } finally {
      setIsSyncing(false)
      setTimeout(() => setSyncStatus('idle'), 3000)
    }
  }

  const displayPhone =
    client?.phoneNumbers?.[0]?.phoneNumber || client?.phone || '—'
  const displayCity = client?.city || '—'
  const leads = client?.leads || []
  const agent = client?.voiceAgents?.[0]

  const today = new Date().toDateString()
  const callsToday = leads.filter(
    (l) => new Date(l.createdAt).toDateString() === today
  ).length
  const appointmentsBooked = leads.filter((l) => l.status === 'Booked').length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">Loading client workspace...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/clients"
          className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Clients
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mr-5 shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)]">
              <span className="text-2xl font-bold text-blue-400">
                {clientName?.[0]?.toUpperCase() || '?'}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center">
                {clientName || 'Client'}
                <span className="ml-3 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold uppercase tracking-wider">
                  Active
                </span>
              </h1>
              <div className="flex items-center mt-1 text-sm text-zinc-400 space-x-4">
                <span className="flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1" /> {displayPhone}
                </span>
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1" /> {displayCity}
                </span>
                <span className="flex items-center text-zinc-500">• ID: {clientId}</span>
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
              <tab.icon
                className={`w-4 h-4 mr-2 ${
                  activeTab === tab.id ? 'text-blue-500' : 'text-zinc-500'
                }`}
              />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Business Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Industry
                    </label>
                    <input
                      type="text"
                      value={clientIndustry}
                      onChange={(e) => setClientIndustry(e.target.value)}
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      City / Service Area
                    </label>
                    <input
                      type="text"
                      defaultValue={client?.city || ''}
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">
                  Urgency & Off-Hours Routing
                </h2>
                <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                  <div>
                    <p className="font-medium text-white mb-0.5">
                      24/7 Emergency Services Toggle
                    </p>
                    <p className="text-sm text-zinc-400">
                      If enabled, the agent will offer immediate dispatch for urgent jobs.
                    </p>
                  </div>
                  <button
                    onClick={() => setEmergencyToggle(!emergencyToggle)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      emergencyToggle ? 'bg-blue-600' : 'bg-zinc-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        emergencyToggle ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Agent Status Card */}
            <div className="space-y-6">
              <div className="glass-dark p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                <h3 className="text-lg font-bold text-white mb-2 relative z-10">
                  Agent Status
                </h3>
                <div className="flex items-center mb-6 relative z-10">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      agent?.status === 'active'
                        ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse'
                        : 'bg-zinc-500'
                    }`}
                  />
                  <span className="text-zinc-300 font-medium">
                    {agent?.status === 'active'
                      ? 'Online & Receiving Calls'
                      : 'Not Synced to VAPI'}
                  </span>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Phone</span>
                    <span className="font-mono text-white text-right">{displayPhone}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Calls Today</span>
                    <span className="font-medium text-white text-right">{callsToday}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Appointments Booked</span>
                    <span className="font-medium text-green-400 text-right">
                      +{appointmentsBooked}
                    </span>
                  </div>
                </div>

                <button className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all relative z-10">
                  Test Call Agent
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VOICE AGENT TAB */}
        {activeTab === 'agent' && (
          <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  System Prompt Configuration
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Fine-tune the behavior, personality, and logic of the voice agent.
                </p>
              </div>
              <button
                onClick={handleSyncToVapi}
                disabled={isSyncing}
                className={`flex items-center px-4 py-2 text-white text-sm font-medium border rounded-xl transition-colors disabled:opacity-70 ${
                  syncStatus === 'success'
                    ? 'bg-green-700 border-green-600'
                    : syncStatus === 'error'
                    ? 'bg-red-700 border-red-600'
                    : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700'
                }`}
              >
                {isSyncing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Bot className="w-4 h-4 mr-2" />
                )}
                {isSyncing
                  ? 'Syncing...'
                  : syncStatus === 'success'
                  ? '✓ Synced!'
                  : syncStatus === 'error'
                  ? 'Sync Failed'
                  : 'Sync to Vapi'}
              </button>
            </div>

            <textarea
              className="w-full h-96 p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Voice Model
                </label>
                <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none">
                  <option>ElevenLabs - Matthew (Professional)</option>
                  <option>ElevenLabs - Sarah (Friendly)</option>
                  <option>OpenAI - Alloy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Language
                </label>
                <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none">
                  <option>English (US)</option>
                  <option>Spanish (Latin America)</option>
                  <option>Dual-Language (Eng/Spa)</option>
                </select>
              </div>
            </div>

            {agent?.vapiAssistantId && (
              <div className="mt-4 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
                <p className="text-xs text-zinc-400">
                  VAPI Assistant ID:{' '}
                  <span className="font-mono text-zinc-300">{agent.vapiAssistantId}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === 'leads' && (
          <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Client Inbox</h2>
              <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/50 text-zinc-400 text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium border-b border-zinc-800">Date</th>
                    <th className="px-6 py-4 font-medium border-b border-zinc-800">Lead Info</th>
                    <th className="px-6 py-4 font-medium border-b border-zinc-800">Notes</th>
                    <th className="px-6 py-4 font-medium border-b border-zinc-800">Status</th>
                    <th className="px-6 py-4 font-medium border-b border-zinc-800">Recording</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {leads.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-zinc-500"
                      >
                        No leads yet. Calls will appear here after VAPI syncs and receives calls.
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => {
                      const latestCall = lead.callLogs?.[0]
                      const date = new Date(lead.createdAt)
                      const isToday = date.toDateString() === today
                      const dateLabel = isToday
                        ? `Today, ${date.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}`
                        : `${date.toLocaleDateString()}, ${date.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}`
                      return (
                        <tr
                          key={lead.id}
                          className="hover:bg-zinc-800/20 transition-colors"
                        >
                          <td className="px-6 py-4 text-zinc-300 whitespace-nowrap text-sm">
                            {dateLabel}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-white font-medium">{lead.name}</div>
                            <div className="text-zinc-500 text-xs">{lead.phone || '—'}</div>
                          </td>
                          <td className="px-6 py-4 text-zinc-300 text-sm max-w-xs truncate">
                            {lead.notes || '—'}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                STATUS_COLORS[lead.status] ||
                                'bg-zinc-500/10 text-zinc-400'
                              }`}
                            >
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {latestCall?.recordingUrl ? (
                              <a
                                href={latestCall.recordingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                              >
                                Play Audio
                              </a>
                            ) : (
                              <span className="text-zinc-600 text-sm">—</span>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg animate-in fade-in duration-300">
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Google Calendar Integration
              </h2>
              <p className="text-zinc-400 max-w-lg mb-8">
                Connect the client&apos;s Google Calendar to allow the AI voice agent to book
                appointments directly into available time slots.
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

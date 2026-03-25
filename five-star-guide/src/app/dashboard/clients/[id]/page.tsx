'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft, Building2, Phone, MapPin, Settings, Bot, Calendar,
  MessageSquare, Save, ExternalLink, RefreshCw, Copy, Check,
  Mic, Globe, X, ChevronDown, Sparkles, Zap, PhoneCall,
} from 'lucide-react'
import { VOICE_OPTIONS, LANGUAGE_OPTIONS } from '@/lib/vapi'
import { INDUSTRY_TEMPLATES, applyTemplate } from '@/lib/prompt-templates'

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
  durationSeconds: number | null
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
  voiceId: string | null
  language: string | null
  firstMessage: string | null
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

  // Overview form state
  const [isSaving, setIsSaving] = useState(false)
  const [emergencyToggle, setEmergencyToggle] = useState(false)
  const [clientName, setClientName] = useState('')
  const [clientIndustry, setClientIndustry] = useState('')

  // Agent config state
  const [systemPrompt, setSystemPrompt] = useState('')
  const [firstMessage, setFirstMessage] = useState('')
  const [voiceId, setVoiceId] = useState('pNInz6obpgDQGcFmaJgB')
  const [language, setLanguage] = useState('en')
  const [isSavingAgent, setIsSavingAgent] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [agentSaveStatus, setAgentSaveStatus] = useState<'idle' | 'saved'>('idle')

  // Template selector
  const [showTemplates, setShowTemplates] = useState(false)

  // Webhook copy
  const [webhookCopied, setWebhookCopied] = useState(false)

  // Transcript modal
  const [transcriptLead, setTranscriptLead] = useState<Lead | null>(null)

  const webhookUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/vapi/webhook`
      : '/api/vapi/webhook'

  const fetchClient = () => {
    if (!clientId) return
    fetch(`/api/clients/${clientId}`)
      .then((r) => r.json())
      .then((data: ClientData) => {
        setClient(data)
        setEmergencyToggle(data.emergencyToggle)
        setClientName(data.name)
        setClientIndustry(data.industry || '')
        const agent = data.voiceAgents?.[0]
        setSystemPrompt(agent?.systemPrompt || data.prompt || '')
        setFirstMessage(agent?.firstMessage || `Hi, thanks for calling ${data.name}! How can I help you today?`)
        setVoiceId(agent?.voiceId || 'pNInz6obpgDQGcFmaJgB')
        setLanguage(agent?.language || 'en')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchClient()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId])

  const handleSaveOverview = async () => {
    setIsSaving(true)
    await fetch(`/api/clients/${clientId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: clientName,
        industry: clientIndustry,
        emergencyToggle,
      }),
    })
    setIsSaving(false)
  }

  const handleSaveAgentConfig = async () => {
    setIsSavingAgent(true)
    await fetch(`/api/clients/${clientId}/agent`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt, voiceId, language, firstMessage }),
    })
    setIsSavingAgent(false)
    setAgentSaveStatus('saved')
    setTimeout(() => setAgentSaveStatus('idle'), 2500)
  }

  const handleSyncToVapi = async () => {
    // First save current config, then sync
    await fetch(`/api/clients/${clientId}/agent`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPrompt, voiceId, language, firstMessage }),
    })
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
      setTimeout(() => setSyncStatus('idle'), 4000)
    }
  }

  const handleApplyTemplate = (templateId: string) => {
    const template = INDUSTRY_TEMPLATES.find((t) => t.id === templateId)
    if (!template) return
    const vars = {
      businessName: clientName,
      city: client?.city || '',
      hours: 'Monday–Friday 8am–6pm',
    }
    const { systemPrompt: sp, firstMessage: fm } = applyTemplate(template, vars)
    setSystemPrompt(sp)
    setFirstMessage(fm)
    setShowTemplates(false)
  }

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl)
    setWebhookCopied(true)
    setTimeout(() => setWebhookCopied(false), 2000)
  }

  const displayPhone = client?.phoneNumbers?.[0]?.phoneNumber || client?.phone || '—'
  const displayCity = client?.city || '—'
  const leads = client?.leads || []
  const agent = client?.voiceAgents?.[0]

  const today = new Date().toDateString()
  const callsToday = leads.filter((l) => new Date(l.createdAt).toDateString() === today).length
  const appointmentsBooked = leads.filter((l) => l.status === 'Booked').length

  const selectedVoiceLabel = VOICE_OPTIONS.find((v) => v.voiceId === voiceId)?.label || 'Select voice'
  const selectedLanguageLabel = LANGUAGE_OPTIONS.find((l) => l.value === language)?.label || 'Select language'

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
                  {agent?.status === 'active' ? 'Active' : 'Setup Needed'}
                </span>
              </h1>
              <div className="flex items-center mt-1 text-sm text-zinc-400 space-x-4">
                <span className="flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1" /> {displayPhone}
                </span>
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1" /> {displayCity}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white text-sm font-medium rounded-xl transition-all">
              <ExternalLink className="w-4 h-4 mr-2 text-zinc-400" />
              View Billing
            </button>
            <button
              onClick={handleSaveOverview}
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
                className={`w-4 h-4 mr-2 ${activeTab === tab.id ? 'text-blue-500' : 'text-zinc-500'}`}
              />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {/* ── OVERVIEW TAB ─────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Business Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Industry</label>
                    <input
                      type="text"
                      value={clientIndustry}
                      onChange={(e) => setClientIndustry(e.target.value)}
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-zinc-400 mb-1">City / Service Area</label>
                    <input
                      type="text"
                      defaultValue={client?.city || ''}
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Urgency & Off-Hours Routing</h2>
                <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                  <div>
                    <p className="font-medium text-white mb-0.5">24/7 Emergency Services Toggle</p>
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
                <h3 className="text-lg font-bold text-white mb-2 relative z-10">Agent Status</h3>
                <div className="flex items-center mb-6 relative z-10">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      agent?.status === 'active'
                        ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse'
                        : 'bg-zinc-500'
                    }`}
                  />
                  <span className="text-zinc-300 font-medium">
                    {agent?.status === 'active' ? 'Online & Receiving Calls' : 'Not Synced to Vapi'}
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
                    <span className="font-medium text-green-400 text-right">+{appointmentsBooked}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Voice</span>
                    <span className="text-white text-right text-xs">
                      {VOICE_OPTIONS.find((v) => v.voiceId === (agent?.voiceId || voiceId))?.label?.split(' – ')[0] || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Language</span>
                    <span className="text-white text-right text-xs">
                      {LANGUAGE_OPTIONS.find((l) => l.value === (agent?.language || language))?.label || '—'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('agent')}
                  className="w-full mt-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all relative z-10"
                >
                  Configure Agent →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── VOICE AGENT TAB ───────────────────────────────────────── */}
        {activeTab === 'agent' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Voice Agent Configuration</h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Configure your AI receptionist for {clientName}.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveAgentConfig}
                  disabled={isSavingAgent}
                  className="flex items-center px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-70"
                >
                  {agentSaveStatus === 'saved' ? (
                    <><Check className="w-4 h-4 mr-2 text-green-400" /> Saved</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> {isSavingAgent ? 'Saving...' : 'Save Draft'}</>
                  )}
                </button>
                <button
                  onClick={handleSyncToVapi}
                  disabled={isSyncing}
                  className={`flex items-center px-4 py-2 text-white text-sm font-bold border rounded-xl transition-colors disabled:opacity-70 ${
                    syncStatus === 'success'
                      ? 'bg-green-700 border-green-600'
                      : syncStatus === 'error'
                      ? 'bg-red-700 border-red-600'
                      : 'bg-blue-600 hover:bg-blue-700 border-blue-500'
                  }`}
                >
                  {isSyncing ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : syncStatus === 'success' ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Zap className="w-4 h-4 mr-2" />
                  )}
                  {isSyncing ? 'Syncing...' : syncStatus === 'success' ? 'Synced to Vapi!' : syncStatus === 'error' ? 'Sync Failed' : 'Save & Deploy to Vapi'}
                </button>
              </div>
            </div>

            {/* Status banner */}
            {agent?.vapiAssistantId ? (
              <div className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-400 text-sm font-medium">Agent deployed</span>
                <span className="text-zinc-500 text-sm">·</span>
                <span className="text-zinc-400 text-xs font-mono">{agent.vapiAssistantId}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-yellow-400 text-sm font-medium">Not yet deployed</span>
                <span className="text-zinc-400 text-sm">— click &quot;Save &amp; Deploy to Vapi&quot; to go live</span>
              </div>
            )}

            {/* ── STEP 1: Industry Template ── */}
            <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">1</div>
                <h3 className="text-lg font-bold text-white">Industry Template</h3>
                <span className="text-xs text-zinc-500 ml-1">— optional starting point</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {INDUSTRY_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleApplyTemplate(t.id)}
                    className="flex flex-col items-center p-3 rounded-xl border border-zinc-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group text-center"
                  >
                    <span className="text-2xl mb-1">{t.icon}</span>
                    <span className="text-xs text-zinc-400 group-hover:text-white font-medium leading-tight">{t.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-3">
                <Sparkles className="w-3 h-3 inline mr-1" />
                Clicking a template fills in the system prompt and greeting below — you can edit freely after.
              </p>
            </div>

            {/* ── STEP 2: First Message ── */}
            <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">2</div>
                <h3 className="text-lg font-bold text-white">Opening Greeting</h3>
              </div>
              <p className="text-sm text-zinc-400 mb-3">
                The first thing your agent says when someone calls. Keep it under 15 words.
              </p>
              <div className="relative">
                <PhoneCall className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={firstMessage}
                  onChange={(e) => setFirstMessage(e.target.value)}
                  placeholder={`Hi, thanks for calling ${clientName}! How can I help you?`}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* ── STEP 3: System Prompt ── */}
            <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">3</div>
                  <h3 className="text-lg font-bold text-white">System Prompt</h3>
                </div>
                <span className="text-xs text-zinc-500">{systemPrompt.length} chars</span>
              </div>
              <p className="text-sm text-zinc-400 mb-3">
                Instructions that define how your agent thinks, qualifies leads, and handles calls.
              </p>
              <textarea
                className="w-full h-80 p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Describe how the agent should behave, what questions to ask, and how to handle different situations..."
              />
            </div>

            {/* ── STEP 4: Voice & Language ── */}
            <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">4</div>
                <h3 className="text-lg font-bold text-white">Voice & Language</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-zinc-400 mb-2">
                    <Mic className="w-4 h-4 mr-1.5" /> Voice Model
                  </label>
                  <div className="relative">
                    <select
                      value={voiceId}
                      onChange={(e) => setVoiceId(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none pr-10"
                    >
                      <optgroup label="ElevenLabs">
                        {VOICE_OPTIONS.filter((v) => v.provider === '11labs').map((v) => (
                          <option key={v.voiceId} value={v.voiceId}>{v.label}</option>
                        ))}
                      </optgroup>
                      <optgroup label="OpenAI TTS">
                        {VOICE_OPTIONS.filter((v) => v.provider === 'openai').map((v) => (
                          <option key={v.voiceId} value={v.voiceId}>{v.label}</option>
                        ))}
                      </optgroup>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-zinc-500 pointer-events-none" />
                  </div>
                  <p className="text-xs text-zinc-600 mt-1.5">
                    Selected: <span className="text-zinc-400">{selectedVoiceLabel}</span>
                  </p>
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-zinc-400 mb-2">
                    <Globe className="w-4 h-4 mr-1.5" /> Language
                  </label>
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none pr-10"
                    >
                      {LANGUAGE_OPTIONS.map((l) => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-zinc-500 pointer-events-none" />
                  </div>
                  <p className="text-xs text-zinc-600 mt-1.5">
                    Selected: <span className="text-zinc-400">{selectedLanguageLabel}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* ── STEP 5: Webhook URL ── */}
            <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">5</div>
                <h3 className="text-lg font-bold text-white">Webhook URL</h3>
                <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">Auto-configured on sync</span>
              </div>
              <p className="text-sm text-zinc-400 mb-3">
                When you deploy to Vapi, this URL is automatically set on the assistant. If you need to configure it manually in the Vapi dashboard:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-300 text-sm font-mono truncate">
                  {webhookUrl}
                </code>
                <button
                  onClick={copyWebhook}
                  className="flex items-center px-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-sm rounded-xl transition-colors shrink-0"
                >
                  {webhookCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── LEADS TAB ────────────────────────────────────────────── */}
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
                    <th className="px-6 py-4 font-medium border-b border-zinc-800">Transcript</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                        No leads yet. Calls will appear here after Vapi is deployed and receives calls.
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => {
                      const latestCall = lead.callLogs?.[0]
                      const date = new Date(lead.createdAt)
                      const isToday = date.toDateString() === today
                      const dateLabel = isToday
                        ? `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : `${date.toLocaleDateString()}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      return (
                        <tr key={lead.id} className="hover:bg-zinc-800/20 transition-colors">
                          <td className="px-6 py-4 text-zinc-300 whitespace-nowrap text-sm">{dateLabel}</td>
                          <td className="px-6 py-4">
                            <div className="text-white font-medium">{lead.name}</div>
                            <div className="text-zinc-500 text-xs">{lead.phone || '—'}</div>
                          </td>
                          <td className="px-6 py-4 text-zinc-300 text-sm max-w-xs truncate">
                            {lead.notes || '—'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status] || 'bg-zinc-500/10 text-zinc-400'}`}>
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
                                ▶ Play
                              </a>
                            ) : (
                              <span className="text-zinc-600 text-sm">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {latestCall?.transcript ? (
                              <button
                                onClick={() => setTranscriptLead(lead)}
                                className="text-zinc-400 hover:text-white text-sm font-medium underline underline-offset-2"
                              >
                                View
                              </button>
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

        {/* ── CALENDAR TAB ─────────────────────────────────────────── */}
        {activeTab === 'calendar' && (
          <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg animate-in fade-in duration-300">
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Google Calendar Integration</h2>
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

        {/* ── SETTINGS TAB ─────────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="glass-dark p-6 rounded-2xl border border-zinc-800/60 shadow-lg animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-white mb-6">Client Settings</h2>
            <div className="space-y-4">
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                <p className="font-medium text-red-400 mb-1">Danger Zone</p>
                <p className="text-sm text-zinc-400 mb-3">Deleting this client will remove all leads, call logs, and voice agent data permanently.</p>
                <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-medium border border-red-500/30 rounded-lg transition-colors">
                  Delete Client
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── TRANSCRIPT MODAL ─────────────────────────────────────── */}
      {transcriptLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <div>
                <h3 className="text-lg font-bold text-white">Call Transcript</h3>
                <p className="text-sm text-zinc-400 mt-0.5">
                  {transcriptLead.name}
                  {transcriptLead.phone && ` · ${transcriptLead.phone}`}
                  {' · '}
                  {new Date(transcriptLead.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setTranscriptLead(null)}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            {/* Duration */}
            {transcriptLead.callLogs?.[0]?.durationSeconds && (
              <div className="px-5 py-3 bg-zinc-950/50 border-b border-zinc-800 flex items-center gap-4 text-sm">
                <span className="text-zinc-400">Duration:</span>
                <span className="text-white font-medium">
                  {Math.floor(transcriptLead.callLogs[0].durationSeconds / 60)}m{' '}
                  {transcriptLead.callLogs[0].durationSeconds % 60}s
                </span>
                {transcriptLead.callLogs[0].recordingUrl && (
                  <a
                    href={transcriptLead.callLogs[0].recordingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    ▶ Play Recording
                  </a>
                )}
              </div>
            )}

            {/* Transcript body */}
            <div className="flex-1 overflow-y-auto p-5">
              {transcriptLead.callLogs?.[0]?.transcript ? (
                <div className="space-y-3">
                  {transcriptLead.callLogs[0].transcript
                    .split('\n')
                    .filter((line) => line.trim())
                    .map((line, i) => {
                      const isAgent =
                        line.toLowerCase().startsWith('assistant:') ||
                        line.toLowerCase().startsWith('agent:') ||
                        line.toLowerCase().startsWith('ai:')
                      const isCaller =
                        line.toLowerCase().startsWith('user:') ||
                        line.toLowerCase().startsWith('caller:') ||
                        line.toLowerCase().startsWith('customer:')
                      const text = line.replace(/^(assistant|agent|ai|user|caller|customer):\s*/i, '')
                      return (
                        <div
                          key={i}
                          className={`flex ${isAgent ? 'justify-start' : isCaller ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                              isAgent
                                ? 'bg-blue-500/10 text-blue-100 border border-blue-500/20 rounded-tl-sm'
                                : isCaller
                                ? 'bg-zinc-800 text-white rounded-tr-sm'
                                : 'bg-zinc-900 text-zinc-300 border border-zinc-800 text-xs italic'
                            }`}
                          >
                            {isAgent && (
                              <div className="text-xs text-blue-400 font-semibold mb-0.5">AI Agent</div>
                            )}
                            {isCaller && (
                              <div className="text-xs text-zinc-400 font-semibold mb-0.5">Caller</div>
                            )}
                            {text || line}
                          </div>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <div className="text-center text-zinc-500 py-8">No transcript available for this call.</div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 flex justify-between items-center">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[transcriptLead.status] || 'bg-zinc-500/10 text-zinc-400'}`}>
                {transcriptLead.status}
              </span>
              <button
                onClick={() => setTranscriptLead(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

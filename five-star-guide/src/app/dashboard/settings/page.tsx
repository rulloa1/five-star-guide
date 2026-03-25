'use client'

import { useState } from 'react'
import { Settings, Building2, Key, Bell, CreditCard, Shield, ChevronRight, Check } from 'lucide-react'

const SECTIONS = [
  { key: 'agency', label: 'Agency Profile', icon: Building2 },
  { key: 'integrations', label: 'Integrations & API Keys', icon: Key },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'billing', label: 'Billing & Plan', icon: CreditCard },
  { key: 'security', label: 'Security', icon: Shield },
]

function AgencySettings() {
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ name: '', website: '', timezone: 'America/Chicago' })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Agency Profile</h3>
        <p className="text-sm text-zinc-400">Basic information about your agency.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Agency Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="My Agency LLC"
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Website</label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            placeholder="https://myagency.com"
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Timezone</label>
          <select
            value={form.timezone}
            onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          >
            <option value="America/New_York">Eastern (ET)</option>
            <option value="America/Chicago">Central (CT)</option>
            <option value="America/Denver">Mountain (MT)</option>
            <option value="America/Los_Angeles">Pacific (PT)</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
      >
        {saved ? <Check className="w-4 h-4" /> : null}
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </form>
  )
}

function IntegrationsSettings() {
  const integrations = [
    { name: 'Vapi.ai', description: 'Voice AI infrastructure for all agent calls', envKey: 'VAPI_API_KEY', status: 'connected' },
    { name: 'Supabase', description: 'Authentication and database backend', envKey: 'NEXT_PUBLIC_SUPABASE_URL', status: 'connected' },
    { name: 'Stripe', description: 'Subscription billing and payments', envKey: 'STRIPE_SECRET_KEY', status: 'pending' },
    { name: 'Twilio', description: 'Phone number provisioning and SMS', envKey: 'TWILIO_AUTH_TOKEN', status: 'pending' },
    { name: 'Google Calendar', description: 'Auto-sync booked appointments', envKey: 'GOOGLE_CALENDAR_CLIENT_ID', status: 'coming_soon' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">Integrations & API Keys</h3>
        <p className="text-sm text-zinc-400">Manage your connected services. Configure via environment variables.</p>
      </div>
      <div className="space-y-3">
        {integrations.map((intg) => (
          <div
            key={intg.name}
            className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <Key className="w-4 h-4 text-zinc-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{intg.name}</p>
                <p className="text-xs text-zinc-500">{intg.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                  intg.status === 'connected'
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : intg.status === 'pending'
                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                }`}
              >
                {intg.status === 'connected' ? 'Connected' : intg.status === 'pending' ? 'Needs Key' : 'Coming Soon'}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-500">
        Set API keys in your <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">.env.local</code> file.
      </p>
    </div>
  )
}

function ComingSoonSection({ label }: { label: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white mb-1">{label}</h3>
        <p className="text-sm text-zinc-400">This section is coming soon.</p>
      </div>
      <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
        <Settings className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-sm">Under construction 🚧</p>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('agency')

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold pb-2 tracking-tight text-white mb-1">Settings</h1>
        <p className="text-zinc-400 text-sm">Manage your agency configuration and integrations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <nav className="lg:col-span-1 space-y-1">
          {SECTIONS.map((section) => {
            const isActive = activeSection === section.key
            return (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent'
                }`}
              >
                <span className="flex items-center gap-3">
                  <section.icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-zinc-500'}`} />
                  {section.label}
                </span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90 text-blue-400' : 'text-zinc-600'}`} />
              </button>
            )
          })}
        </nav>

        {/* Content */}
        <div className="lg:col-span-3 glass-dark rounded-2xl border border-zinc-800/60 p-6">
          {activeSection === 'agency' && <AgencySettings />}
          {activeSection === 'integrations' && <IntegrationsSettings />}
          {activeSection === 'notifications' && <ComingSoonSection label="Notifications" />}
          {activeSection === 'billing' && <ComingSoonSection label="Billing & Plan" />}
          {activeSection === 'security' && <ComingSoonSection label="Security" />}
        </div>
      </div>
    </div>
  )
}

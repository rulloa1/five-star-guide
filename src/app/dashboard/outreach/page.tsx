'use client'

import { useState } from 'react'
import { Megaphone, Mail, Phone, MessageSquare, Voicemail, Sparkles, Copy, Check } from 'lucide-react'

const ASSET_TYPES = [
  {
    key: 'cold_email',
    label: 'Cold Email',
    icon: Mail,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    placeholder: 'Write a cold email script for a plumbing company targeting homeowners...',
  },
  {
    key: 'cold_call',
    label: 'Cold Call Script',
    icon: Phone,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    placeholder: 'Write a cold call opening for an HVAC agency prospect...',
  },
  {
    key: 'sms',
    label: 'SMS Follow-Up',
    icon: MessageSquare,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    placeholder: 'Write an SMS follow-up for a missed call lead...',
  },
  {
    key: 'voicemail',
    label: 'Voicemail Drop',
    icon: Voicemail,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    placeholder: 'Write a voicemail script for a roofing company prospecting after a storm...',
  },
]

const EXAMPLE_ASSETS: Record<string, string> = {
  cold_email: `Subject: 24/7 AI Receptionist for Your Plumbing Business

Hi [First Name],

Most plumbing businesses lose 30-40% of new leads because calls go unanswered after hours.

We've built a 24/7 AI receptionist specifically for home service companies like yours — it answers every call, qualifies the lead, and books the appointment directly into your calendar.

No more missed calls. No more lost revenue.

Would you be open to a 15-minute call this week to see it in action?

Best,
[Your Name]`,
  cold_call: `Hi, is this [Name]?

Great — I'll be quick. My name is [Your Name] and I work with home service companies in [City].

We've been helping plumbing, HVAC, and roofing businesses capture every single inbound call with an AI receptionist that qualifies leads and books appointments automatically.

I'm not sure if it's a fit for you, but would you be open to a 10-minute demo this week?`,
  sms: `Hi [Name], this is [Business] — we missed your call earlier! Our team is ready to help. Reply back or call us at [phone] and we'll get you taken care of ASAP. 🔧`,
  voicemail: `Hey [Name], this is [Your Name] calling from ServiceBot. I was reaching out because we help [industry] companies never miss another call with our AI receptionist.

Give me a call back at [number] — I'd love to show you how it works. Talk soon!`,
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export default function OutreachPage() {
  const [activeTab, setActiveTab] = useState('cold_email')

  const activeType = ASSET_TYPES.find((t) => t.key === activeTab)!
  const example = EXAMPLE_ASSETS[activeTab]

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold pb-2 tracking-tight text-white mb-1">Outreach Assets</h1>
          <p className="text-zinc-400 text-sm">
            Agency prospecting scripts, emails, and SMS templates — ready to use.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl text-sm text-purple-300 font-medium">
          <Sparkles className="w-4 h-4" />
          AI-Generated Templates
        </div>
      </div>

      {/* Type Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        {ASSET_TYPES.map((type) => {
          const isActive = activeTab === type.key
          return (
            <button
              key={type.key}
              onClick={() => setActiveTab(type.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                isActive
                  ? `${type.bg} ${type.color} ${type.border}`
                  : 'bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
              }`}
            >
              <type.icon className={`w-4 h-4 ${isActive ? type.color : 'text-zinc-500'}`} />
              {type.label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Template Viewer */}
        <div className="glass-dark rounded-2xl border border-zinc-800/60 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
            <div className="flex items-center gap-2">
              <activeType.icon className={`w-4 h-4 ${activeType.color}`} />
              <span className="text-sm font-medium text-white">{activeType.label} — Example</span>
            </div>
            <CopyButton text={example} />
          </div>
          <pre className="p-6 text-sm text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
            {example}
          </pre>
        </div>

        {/* Customizer */}
        <div className="glass-dark rounded-2xl border border-zinc-800/60 p-6">
          <h2 className="text-lg font-bold text-white mb-2">Customize for a Client</h2>
          <p className="text-sm text-zinc-400 mb-6">
            Describe the client and their target audience — AI generation coming soon.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Client Industry</label>
              <select className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm">
                <option>Plumbing</option>
                <option>HVAC</option>
                <option>Roofing</option>
                <option>Electrical</option>
                <option>Garage Door Repair</option>
                <option>Pest Control</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Target Audience</label>
              <input
                type="text"
                placeholder="e.g. Homeowners in Austin who recently searched for plumbers"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Tone</label>
              <div className="flex gap-2">
                {['Professional', 'Friendly', 'Urgent'].map((t) => (
                  <button
                    key={t}
                    className="flex-1 px-3 py-2 text-xs font-medium bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white rounded-xl transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button
              disabled
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 opacity-60 text-white text-sm font-medium rounded-xl cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              Generate with AI (Coming Soon)
            </button>
          </div>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="mt-8 p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
          <Megaphone className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <p className="text-white font-medium">Outreach Sequences Coming Soon</p>
          <p className="text-sm text-zinc-400 mt-0.5">
            Multi-step email + SMS drip campaigns, auto-sent from your agency to client prospects.
          </p>
        </div>
      </div>
    </div>
  )
}

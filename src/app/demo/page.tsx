'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Sparkles, Building2, Phone, MapPin, Wrench } from 'lucide-react'

export default function DemoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    companyName: '',
    industry: 'plumbing',
    phone: '',
    city: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Mocking the generation of a demo client
    // In actual implementation, this will call the seed script / API endpoint to generate fake leads
    setTimeout(() => {
      setLoading(false)
      // Redirect to dashboard viewing this fake client wrapper
      router.push('/dashboard')
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>

      <div className="w-full max-w-md absolute top-8 left-8">
        <Link href="/" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6">
            <Sparkles className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Generate Demo Client</h1>
          <p className="text-zinc-400 text-lg">See the magic in seconds. We'll generate a fake client profile with dummy leads and prompts.</p>
        </div>

        <div className="glass-dark p-8 rounded-3xl border border-zinc-800/60 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2 flex items-center">
                <Building2 className="w-4 h-4 mr-2" /> Company Name
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-zinc-500 transition-all"
                placeholder="Apex Plumbing"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2 flex items-center">
                <Wrench className="w-4 h-4 mr-2" /> Industry Template
              </label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white appearance-none transition-all"
              >
                <option value="plumbing">Plumbing</option>
                <option value="hvac">HVAC</option>
                <option value="roofing">Roofing</option>
                <option value="garage">Garage Door Repair</option>
                <option value="landscaping">Landscaping</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2 flex items-center">
                <Phone className="w-4 h-4 mr-2" /> Phone Number (Fake)
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-zinc-500 transition-all"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2" /> City
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-zinc-500 transition-all"
                placeholder="Austin, TX"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-8 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center group"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3" />
                  Generating AI Agent...
                </div>
              ) : (
                <span className="flex items-center">
                  Generate Demo
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

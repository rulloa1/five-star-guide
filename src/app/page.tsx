import Link from 'next/link'
import { ArrowRight, Bot, CalendarCheck, PhoneOutgoing, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-md fixed w-full z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <Bot className="w-8 h-8 text-blue-500 mr-2" />
              <span className="font-bold text-xl tracking-tight text-white">ServiceBot OS</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-zinc-300 hover:text-white transition-colors">Features</Link>
              <Link href="/pricing" className="text-zinc-300 hover:text-white transition-colors">Pricing</Link>
              <Link href="/demo" className="text-zinc-300 hover:text-white transition-colors">Demo</Link>
              <Link href="/login" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all">
                Agency Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] -z-10"></div>
        
        <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-300 backdrop-blur-sm mb-8 animate-fade-in-up">
          <span className="flex w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
          Next-Gen AI for Home Service Agencies
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight max-w-4xl text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-zinc-400">
          Turn missed calls into <br className="hidden md:block"/> booked jobs.
        </h1>
        
        <p className="text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed">
          Clone, deploy, and manage 24/7 AI voice agents for your local service clients. Automate booking flows, qualify leads, and scale your agency.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/demo" className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-zinc-900 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]">
            Create Demo Account
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/pricing" className="px-8 py-4 text-base font-bold text-zinc-300 transition-all duration-200 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-600">
            View Pricing
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-zinc-950/50 relative border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Everything an agency needs</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Manage hundreds of clients from a single dashboard with industry-specific templates and workflows.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-dark p-8 rounded-3xl border border-zinc-800/60 hover:border-blue-500/30 transition-colors group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Voice Agent Templates</h3>
              <p className="text-zinc-400 leading-relaxed">Deploy pre-trained prompts for plumbing, HVAC, roofing, and more with just one click.</p>
            </div>

            {/* Feature 2 */}
            <div className="glass-dark p-8 rounded-3xl border border-zinc-800/60 hover:border-purple-500/30 transition-colors group">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Smart Booking Flows</h3>
              <p className="text-zinc-400 leading-relaxed">Qualifies emergency vs standard jobs, syncs with Google Calendar, and texts confirmation.</p>
            </div>

            {/* Feature 3 */}
            <div className="glass-dark p-8 rounded-3xl border border-zinc-800/60 hover:border-pink-500/30 transition-colors group">
              <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <PhoneOutgoing className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Missed Call Recovery</h3>
              <p className="text-zinc-400 leading-relaxed">Instant SMS follow-up and outbound callbacks when the business misses an urgent customer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass p-12 md:p-16 rounded-[2.5rem] text-center border border-zinc-700/50 bg-gradient-to-b from-zinc-800/40 to-black/40 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/30 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/30 rounded-full blur-[80px]"></div>
            
            <Zap className="w-12 h-12 text-blue-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">Ready to scale your AI agency?</h2>
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">Start onboarding clients today with our premium white-label infrastructure.</p>
            <Link href="/demo" className="inline-flex items-center px-8 py-4 font-bold text-white bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all backdrop-blur-md">
              Try the Demo Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-12 text-center text-zinc-500">
        <p>© 2026 ServiceBot OS. Build for AI Agencies.</p>
      </footer>
    </div>
  )
}

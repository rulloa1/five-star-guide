import Link from 'next/link'
import { CheckCircle2, ChevronLeft } from 'lucide-react'

const Tiers = [
  {
    name: "Starter",
    price: "$99",
    description: "Perfect for new agencies getting started with voice AI.",
    features: ["Up to 5 clients", "Basic prompt templates", "Email support", "500 voice minutes included"],
    highlighted: false,
    cta: "Start Starter Plan"
  },
  {
    name: "Growth",
    price: "$299",
    description: "Scale your operations with advanced CRM and booking flows.",
    features: ["Up to 25 clients", "All industry templates", "Priority support", "2,000 voice minutes included", "White-label dashboard", "Custom SMS templates"],
    highlighted: true,
    cta: "Start Growth Plan"
  },
  {
    name: "Pro",
    price: "$799",
    description: "For established agencies dominating the local market.",
    features: ["Unlimited clients", "Custom voice cloning", "Dedicated account manager", "10,000 voice minutes included", "API Webhooks access", "Custom domains"],
    highlighted: false,
    cta: "Contact Sales"
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-md fixed w-full z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-zinc-400 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-24 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute top-32 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Simple, transparent pricing</h1>
          <p className="text-xl text-zinc-400 mb-16 max-w-2xl mx-auto">No hidden fees, no surprise charges. Pay as you grow your agency.</p>

          <div className="grid md:grid-cols-3 gap-8">
            {Tiers.map((tier) => (
              <div key={tier.name} className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${tier.highlighted ? 'border-blue-500 bg-zinc-900/80 shadow-[0_0_50px_-12px_rgba(37,99,235,0.4)] scale-105 z-10' : 'border-zinc-800/60 bg-zinc-900/40 hover:border-zinc-700'}`}>
                {tier.highlighted && (
                  <div className="absolute top-0 inset-x-0 -mt-4 flex justify-center">
                    <span className="bg-blue-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-zinc-400 h-12">{tier.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold">{tier.price}</span>
                  <span className="text-zinc-400">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1 text-left">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className={`w-5 h-5 mr-3 shrink-0 ${tier.highlighted ? 'text-blue-400' : 'text-zinc-500'}`} />
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-xl font-bold transition-colors ${tier.highlighted ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' : 'bg-zinc-800 hover:bg-zinc-700 text-white'}`}>
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

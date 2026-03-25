'use client'

import { useState } from 'react'
import { Calendar as CalIcon, Clock, CheckCircle, XCircle, User, Phone, MapPin } from 'lucide-react'

const dummyAppointments = [
  { id: '1', client: 'Apex Plumbing', leadName: 'John Doe', phone: '(555) 123-4567', date: 'Tomorrow, 10:00 AM', status: 'Scheduled', type: 'Emergency Repair', location: '123 Main St, Austin' },
  { id: '2', client: 'CoolBreeze HVAC', leadName: 'Sarah Mike', phone: '(555) 987-6543', date: 'Today, 2:30 PM', status: 'Completed', type: 'A/C Service', location: '456 Oak Dr, Dallas' },
  { id: '3', client: 'Apex Plumbing', leadName: 'Mike Johnson', phone: '(555) 111-9999', date: 'Oct 12, 9:00 AM', status: 'Canceled', type: 'Leak detection', location: '789 Pine Ln, Austin' }
]

export default function AppointmentsPage() {
  const [appointments] = useState(dummyAppointments)

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold pb-2 tracking-tight text-white mb-1">Appointments</h1>
        <p className="text-zinc-400 text-sm">View and manage voice-booked appointments across all clients.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((appt) => (
          <div key={appt.id} className="glass-dark rounded-2xl border border-zinc-800/60 p-6 flex flex-col relative overflow-hidden group hover:border-blue-500/30 transition-all">
            {/* Background Glow based on status */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 opacity-20 transition-transform group-hover:scale-150 ${
                appt.status === 'Scheduled' ? 'bg-blue-500' :
                appt.status === 'Completed' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mb-3 ${
                  appt.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                  appt.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {appt.status === 'Scheduled' && <Clock className="w-3 h-3 mr-1" />}
                  {appt.status === 'Completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {appt.status === 'Canceled' && <XCircle className="w-3 h-3 mr-1" />}
                  {appt.status}
                </span>
                <h3 className="text-xl font-bold text-white">{appt.type}</h3>
                <p className="text-sm text-zinc-400">{appt.client}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-sm font-medium text-white bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
                  <CalIcon className="w-4 h-4 mr-2 text-blue-400" />
                  {appt.date.split(',')[0]}
                </div>
                <div className="text-xs text-zinc-500 mt-1 mr-1">{appt.date.split(',')[1]}</div>
              </div>
            </div>

            <div className="space-y-3 flex-1 relative z-10">
              <div className="flex items-center text-sm text-zinc-300">
                <User className="w-4 h-4 mr-3 text-zinc-500" />
                {appt.leadName}
              </div>
              <div className="flex items-center text-sm text-zinc-300">
                <Phone className="w-4 h-4 mr-3 text-zinc-500" />
                {appt.phone}
              </div>
              <div className="flex items-center text-sm text-zinc-300">
                <MapPin className="w-4 h-4 mr-3 text-zinc-500" />
                {appt.location}
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-zinc-800/50 flex space-x-3 relative z-10">
              <button className="flex-1 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-sm font-medium rounded-xl transition-colors">
                Reschedule
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/20">
                View CRM Info
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

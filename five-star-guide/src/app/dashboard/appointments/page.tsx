'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar as CalIcon, Clock, CheckCircle, XCircle, User, Phone, MapPin, Loader2, CalendarX } from 'lucide-react'

interface Appointment {
  id: string
  startTime: string
  endTime: string
  status: string
  notes: string | null
  client: { id: string; name: string }
  lead: { id: string; name: string; phone: string | null }
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  if (isSameDay(d, now)) return { day: 'Today', time: timeStr }
  if (isSameDay(d, tomorrow)) return { day: 'Tomorrow', time: timeStr }
  return {
    day: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    time: timeStr,
  }
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/appointments')
      if (res.ok) setAppointments(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAppointments() }, [fetchAppointments])

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        const updated = await res.json()
        setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)))
      }
    } finally {
      setUpdating(null)
    }
  }

  const grouped = {
    scheduled: appointments.filter((a) => a.status === 'scheduled'),
    completed: appointments.filter((a) => a.status === 'completed'),
    canceled: appointments.filter((a) => a.status === 'canceled'),
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold pb-2 tracking-tight text-white mb-1">Appointments</h1>
          <p className="text-zinc-400 text-sm">
            View and manage voice-booked appointments across all clients.
          </p>
        </div>
        <div className="flex gap-3">
          {Object.entries(grouped).map(([key, items]) => (
            <div key={key} className="glass-dark px-4 py-2 rounded-xl border border-zinc-800/60 text-center">
              <p className="text-xl font-bold text-white">{items.length}</p>
              <p className="text-xs text-zinc-400 capitalize">{key}</p>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
          <CalendarX className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-lg font-medium">No appointments yet</p>
          <p className="text-sm mt-1">
            Appointments will appear here once your voice agents start booking them.
          </p>
        </div>
      ) : (
        <>
          {/* Scheduled */}
          {grouped.scheduled.length > 0 && (
            <section className="mb-10">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Scheduled
                <span className="text-sm font-normal text-zinc-500">({grouped.scheduled.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped.scheduled.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    appt={appt}
                    updating={updating === appt.id}
                    onStatusChange={(s) => updateStatus(appt.id, s)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Completed */}
          {grouped.completed.length > 0 && (
            <section className="mb-10">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Completed
                <span className="text-sm font-normal text-zinc-500">({grouped.completed.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped.completed.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    appt={appt}
                    updating={updating === appt.id}
                    onStatusChange={(s) => updateStatus(appt.id, s)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Canceled */}
          {grouped.canceled.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                Canceled
                <span className="text-sm font-normal text-zinc-500">({grouped.canceled.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grouped.canceled.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    appt={appt}
                    updating={updating === appt.id}
                    onStatusChange={(s) => updateStatus(appt.id, s)}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

function AppointmentCard({
  appt,
  updating,
  onStatusChange,
}: {
  appt: Appointment
  updating: boolean
  onStatusChange: (status: string) => void
}) {
  const dt = formatDateTime(appt.startTime)

  const statusStyles: Record<string, string> = {
    scheduled: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    completed: 'bg-green-500/10 text-green-400 border-green-500/20',
    canceled: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  const glowColors: Record<string, string> = {
    scheduled: 'bg-blue-500',
    completed: 'bg-green-500',
    canceled: 'bg-red-500',
  }

  return (
    <div className="glass-dark rounded-2xl border border-zinc-800/60 p-6 flex flex-col relative overflow-hidden group hover:border-blue-500/30 transition-all">
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl -mr-10 -mt-10 opacity-20 transition-transform group-hover:scale-150 ${glowColors[appt.status] ?? 'bg-zinc-500'}`}
      />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold mb-3 border ${statusStyles[appt.status] ?? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}
          >
            {appt.status === 'scheduled' && <Clock className="w-3 h-3 mr-1" />}
            {appt.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
            {appt.status === 'canceled' && <XCircle className="w-3 h-3 mr-1" />}
            {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
          </span>
          <h3 className="text-xl font-bold text-white">
            {appt.notes ?? 'Service Appointment'}
          </h3>
          <p className="text-sm text-zinc-400">{appt.client.name}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center text-sm font-medium text-white bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800">
            <CalIcon className="w-4 h-4 mr-2 text-blue-400" />
            {dt.day}
          </div>
          <div className="text-xs text-zinc-500 mt-1 mr-1">{dt.time}</div>
        </div>
      </div>

      <div className="space-y-3 flex-1 relative z-10">
        <div className="flex items-center text-sm text-zinc-300">
          <User className="w-4 h-4 mr-3 text-zinc-500" />
          {appt.lead.name}
        </div>
        {appt.lead.phone && (
          <div className="flex items-center text-sm text-zinc-300">
            <Phone className="w-4 h-4 mr-3 text-zinc-500" />
            {appt.lead.phone}
          </div>
        )}
      </div>

      <div className="pt-6 mt-4 border-t border-zinc-800/50 flex space-x-3 relative z-10">
        {appt.status === 'scheduled' && (
          <>
            <button
              onClick={() => onStatusChange('canceled')}
              disabled={updating}
              className="flex-1 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {updating && <Loader2 className="w-3 h-3 animate-spin" />}
              Cancel
            </button>
            <button
              onClick={() => onStatusChange('completed')}
              disabled={updating}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {updating && <Loader2 className="w-3 h-3 animate-spin" />}
              Mark Complete
            </button>
          </>
        )}
        {appt.status === 'completed' && (
          <button
            onClick={() => onStatusChange('scheduled')}
            disabled={updating}
            className="flex-1 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            Reopen
          </button>
        )}
        {appt.status === 'canceled' && (
          <button
            onClick={() => onStatusChange('scheduled')}
            disabled={updating}
            className="flex-1 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            Reschedule
          </button>
        )}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { supabase, Inquiry } from '@/lib/supabase'

export default function AdminMessagesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState<'all' | 'new' | 'seen'>('all')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false })
    setInquiries((data as Inquiry[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const markSeen = async (id: string) => {
    await supabase.from('inquiries').update({ seen: true }).eq('id', id)
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, seen: true } : i))
  }

  const markUnseen = async (id: string) => {
    await supabase.from('inquiries').update({ seen: false }).eq('id', id)
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, seen: false } : i))
  }

  const deleteInquiry = async (id: string) => {
    if (!confirm('Delete this inquiry?')) return
    await supabase.from('inquiries').delete().eq('id', id)
    setInquiries(prev => prev.filter(i => i.id !== id))
  }

  const filtered = inquiries.filter(i => {
    if (filter === 'new')  return !i.seen
    if (filter === 'seen') return i.seen
    return true
  })

  const newCount = inquiries.filter(i => !i.seen).length

  const fmt = (ts: string) =>
    new Date(ts).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' })

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-outfit font-bold text-xl text-white">Customer Messages</h1>
          <p className="text-slate-500 text-sm mt-0.5">Contact form submissions</p>
        </div>
        <div className="flex items-center gap-3">
          {newCount > 0 && (
            <span className="bg-bc-blue text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {newCount} new
            </span>
          )}
          <button onClick={load} className="p-2 rounded-xl border border-bc-border text-slate-400 hover:text-white hover:border-bc-blue/40 transition-all text-sm">
            ↺ Refresh
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {(['all', 'new', 'seen'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-xs font-medium border transition-all capitalize ${
              filter === f
                ? 'bg-bc-blue border-bc-blue text-white'
                : 'bg-bc-card border-bc-border text-slate-400 hover:text-white'
            }`}>
            {f === 'all' ? `All (${inquiries.length})` : f === 'new' ? `New (${newCount})` : `Seen (${inquiries.length - newCount})`}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="shimmer h-20 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <div className="text-4xl mb-3">📭</div>
          <p>No messages found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(inq => (
            <div key={inq.id}
              className={`bg-bc-card border rounded-xl p-4 transition-all ${
                !inq.seen ? 'border-bc-blue/30 bg-bc-blue/5' : 'border-bc-border'
              }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-white text-sm">{inq.name}</span>
                    {!inq.seen && (
                      <span className="text-[10px] font-bold bg-bc-blue/20 text-bc-blue px-2 py-0.5 rounded-full border border-bc-blue/30">
                        NEW
                      </span>
                    )}
                    <span className="text-slate-600 text-xs">{fmt(inq.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <a href={`tel:${inq.phone}`} className="text-bc-cyan text-sm font-medium hover:text-white transition-colors">
                      📞 {inq.phone}
                    </a>
                    {inq.category && (
                      <span className="bengali text-xs text-slate-400 bg-bc-surface border border-bc-border rounded-full px-2.5 py-0.5">
                        {inq.category}
                      </span>
                    )}
                  </div>
                  {inq.message && (
                    <p className="bengali text-slate-400 text-xs mt-2 leading-relaxed bg-bc-surface/60 rounded-lg p-2 border border-bc-border/50 whitespace-pre-wrap">
                      {inq.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <a href={`https://wa.me/88${inq.phone.replace(/[^0-9]/g,'')}?text=${encodeURIComponent('আপনার ইনকোয়ারির জন্য ধন্যবাদ!')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-bc-wa/10 border border-bc-wa/25 text-bc-wa hover:bg-bc-wa/20 transition-all text-xs" title="WhatsApp">
                    💬
                  </a>
                  <button
                    onClick={() => inq.seen ? markUnseen(inq.id) : markSeen(inq.id)}
                    className={`p-2 rounded-lg border text-xs transition-all ${
                      inq.seen
                        ? 'bg-bc-surface border-bc-border text-slate-500 hover:text-white'
                        : 'bg-bc-blue/10 border-bc-blue/25 text-bc-blue hover:bg-bc-blue/20'
                    }`}
                    title={inq.seen ? 'Mark as new' : 'Mark as seen'}
                  >
                    {inq.seen ? '↺' : '✓'}
                  </button>
                  <button onClick={() => deleteInquiry(inq.id)}
                    className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-xs" title="Delete">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

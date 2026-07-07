'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/lib/supabase'

const TABS = [
  { v: 'all',         l: 'সব',            en: 'All' },
  { v: 'new',         l: 'নতুন ল্যাপটপ',  en: 'New Laptop' },
  { v: 'used',        l: 'পুরনো ল্যাপটপ', en: 'Used Laptop' },
  { v: 'accessories', l: 'আনুষাঙ্গিক',    en: 'Accessories' },
  { v: 'services',    l: 'সার্ভিস',        en: 'Services' },
]

type PriorityMap = Record<string, number | ''>  // product_id -> priority number

export default function AdminPriorityPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [products, setProducts]   = useState<Product[]>([])
  const [priorities, setPriorities] = useState<PriorityMap>({})
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)

  // Load products + existing priorities for this tab
  const load = useCallback(async (tab: string) => {
    setLoading(true)
    setSaved(false)

    // Fetch products (filter by category if not 'all')
    const query = supabase.from('products').select('*').order('created_at', { ascending: false })
    const { data: prods } = tab === 'all'
      ? await query
      : await query.eq('category', tab)

    // Fetch saved priorities for this tab
    const { data: prios } = await supabase
      .from('product_priority')
      .select('product_id, priority')
      .eq('category', tab)

    const map: PriorityMap = {}
    if (prios) {
      prios.forEach(p => { map[p.product_id] = p.priority })
    }

    setProducts((prods as Product[]) ?? [])
    setPriorities(map)
    setLoading(false)
  }, [])

  useEffect(() => { load(activeTab) }, [activeTab, load])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setPriorities({})
  }

  const handlePriorityChange = (productId: string, val: string) => {
    const num = val === '' ? '' : parseInt(val)
    if (typeof num === 'number' && isNaN(num)) return
    setPriorities(prev => ({ ...prev, [productId]: num }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)

    // Build upsert rows — only products with a valid number
    const rows = Object.entries(priorities)
      .filter(([, v]) => v !== '' && typeof v === 'number')
      .map(([product_id, priority]) => ({
        category: activeTab,
        product_id,
        priority: priority as number,
      }))

    // Delete all existing priorities for this tab first
    await supabase.from('product_priority').delete().eq('category', activeTab)

    // Insert new ones
    if (rows.length > 0) {
      await supabase.from('product_priority').insert(rows)
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleClear = (productId: string) => {
    setPriorities(prev => {
      const next = { ...prev }
      delete next[productId]
      return next
    })
  }

  // Sort: prioritized first (ascending), unprioritized after
  const sorted = [...products].sort((a, b) => {
    const pa = priorities[a.id]
    const pb = priorities[b.id]
    const na = typeof pa === 'number' ? pa : Infinity
    const nb = typeof pb === 'number' ? pb : Infinity
    return na - nb
  })

  const prioritizedCount = Object.values(priorities).filter(v => v !== '' && typeof v === 'number').length

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white font-bold text-xl">Product Priority</h1>
          <p className="bengali text-slate-500 text-sm mt-0.5">
            প্রোডাক্ট পেজে কোন প্রোডাক্ট কত নম্বরে দেখাবে সেট করুন
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-bc-blue hover:bg-bc-blue/80 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
        >
          {saving ? (
            <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> সেভ হচ্ছে...</>
          ) : saved ? (
            <>✅ সেভ হয়েছে</>
          ) : (
            <>💾 সেভ করুন</>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(t => (
          <button
            key={t.v}
            onClick={() => handleTabChange(t.v)}
            className={`bengali px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              activeTab === t.v
                ? 'bg-bc-blue/15 text-bc-blue border-bc-blue/30'
                : 'bg-bc-surface text-slate-400 border-bc-border hover:text-white hover:border-slate-500'
            }`}
          >
            {t.l}
          </button>
        ))}
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="bengali text-slate-500 text-xs">
          {loading ? '...' : `${products.length}টি প্রোডাক্ট`}
          {prioritizedCount > 0 && ` · ${prioritizedCount}টিতে priority সেট`}
        </p>
        <p className="bengali text-slate-600 text-xs">
          নম্বর না দিলে পুরনো নিয়মে থাকবে
        </p>
      </div>

      {/* Product list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-16 bg-bc-card border border-bc-border rounded-xl shimmer" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-bc-card border border-bc-border rounded-xl p-8 text-center">
          <p className="bengali text-slate-500">এই ক্যাটাগরিতে কোনো প্রোডাক্ট নেই</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((p, idx) => {
            const val = priorities[p.id]
            const hasPriority = typeof val === 'number'
            const isFirst = hasPriority && idx === 0
            return (
              <div
                key={p.id}
                className={`flex items-center gap-3 bg-bc-card border rounded-xl px-4 py-3 transition-all ${
                  hasPriority
                    ? 'border-bc-blue/30 bg-bc-blue/5'
                    : 'border-bc-border'
                }`}
              >
                {/* Rank badge */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  hasPriority ? 'bg-bc-blue/20 text-bc-blue' : 'bg-bc-surface text-slate-600'
                }`}>
                  {hasPriority ? val : '—'}
                </div>

                {/* Product image */}
                {p.image_url ? (
                  <img src={p.image_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 bg-bc-surface" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-bc-surface shrink-0 flex items-center justify-center text-lg">💻</div>
                )}

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      p.category === 'new' ? 'badge-new' :
                      p.category === 'used' ? 'badge-used' :
                      p.category === 'accessories' ? 'badge-accessories' : 'badge-services'
                    }`}>{p.category}</span>
                    {p.price && <span className="text-slate-500 text-xs">{p.price}</span>}
                    {isFirst && <span className="text-xs text-bc-cyan">★ শীর্ষে</span>}
                  </div>
                </div>

                {/* Priority input */}
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min={1}
                    placeholder="—"
                    value={val === '' || val === undefined ? '' : val}
                    onChange={e => handlePriorityChange(p.id, e.target.value)}
                    className="w-16 bg-bc-surface border border-bc-border focus:border-bc-blue/60 rounded-lg px-2 py-1.5 text-white text-sm text-center focus:outline-none transition-colors"
                  />
                  {hasPriority && (
                    <button
                      onClick={() => handleClear(p.id)}
                      className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all flex items-center justify-center text-xs"
                      title="Priority সরান"
                    >✕</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Bottom save */}
      {products.length > 5 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-bc-blue hover:bg-bc-blue/80 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
          >
            {saving ? '⏳ সেভ হচ্ছে...' : saved ? '✅ সেভ হয়েছে' : '💾 সেভ করুন'}
          </button>
        </div>
      )}
    </div>
  )
}

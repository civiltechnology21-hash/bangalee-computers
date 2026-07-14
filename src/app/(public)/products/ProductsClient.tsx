'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase, Product } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import PolicyNotice from '@/components/PolicyNotice'

const TABS = [
  { key: 'all',         label: 'All',           en: 'All' },
  { key: 'new',         label: 'New Laptop',  en: 'New Laptop' },
  { key: 'used',        label: 'Used Laptop', en: 'Used Laptop' },
  { key: 'accessories', label: 'Accessories',    en: 'Accessories' },
  { key: 'services',    label: 'Services',        en: 'Services' },
]

export default function ProductsClient() {
  const searchParams = useSearchParams()
  const initCat = searchParams.get('cat') ?? 'all'

  const [products, setProducts]       = useState<Product[]>([])
  const [priorityMap, setPriorityMap] = useState<Record<string, number>>({})
  const [loading, setLoading]         = useState(true)
  const [search,  setSearch]          = useState('')
  const [tab,     setTab]             = useState(initCat)

  // Price filter — draft values (what's typed) vs applied values (what's active)
  const [minPriceInput, setMinPriceInput] = useState('')
  const [maxPriceInput, setMaxPriceInput] = useState('')
  const [appliedMin, setAppliedMin]       = useState<number | null>(null)
  const [appliedMax, setAppliedMax]       = useState<number | null>(null)
  const priceFilterActive = appliedMin !== null || appliedMax !== null

  // Extract a numeric value from a price string like "৳42,000" or "42000"
  function parsePrice(price: string | null | undefined): number | null {
    if (!price) return null
    const digits = price.replace(/[^0-9.]/g, '')
    if (!digits) return null
    const n = parseFloat(digits)
    return isNaN(n) ? null : n
  }

  const applyPriceFilter = () => {
    const min = minPriceInput.trim() === '' ? null : parseFloat(minPriceInput)
    const max = maxPriceInput.trim() === '' ? null : parseFloat(maxPriceInput)
    setAppliedMin(min !== null && !isNaN(min) ? min : null)
    setAppliedMax(max !== null && !isNaN(max) ? max : null)
  }

  const clearPriceFilter = () => {
    setMinPriceInput('')
    setMaxPriceInput('')
    setAppliedMin(null)
    setAppliedMax(null)
  }

  // Load products AND priority for current tab together — no race condition
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [prodRes, prioRes] = await Promise.all([
          supabase.from('products').select('*').order('created_at', { ascending: false }),
          supabase.from('product_priority').select('product_id, priority').eq('category', tab),
        ])

        const map: Record<string, number> = {}
        if (prioRes.data) {
          prioRes.data.forEach((r: { product_id: string; priority: number }) => {
            map[r.product_id] = r.priority
          })
        }

        setProducts((prodRes.data as Product[]) ?? [])
        setPriorityMap(map)
      } catch {
        setProducts([])
        setPriorityMap({})
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tab])

  // Sync tab from URL
  useEffect(() => {
    const c = searchParams.get('cat')
    if (c) setTab(c)
  }, [searchParams])

  const filtered = products
    .filter(p => {
      const matchCat = tab === 'all' || p.category === tab

      // Combine all searchable text into one haystack
      const haystack = [p.name, p.specs ?? '', p.name_bn ?? '']
        .join(' ')
        .toLowerCase()

      // Split query into words — every word must appear somewhere in the
      // combined fields (order-independent), so "lenovo i5" matches even
      // when "lenovo" is in the name and "i5" is only in specs.
      const words = search.toLowerCase().trim().split(/\s+/).filter(Boolean)
      const matchSearch = words.length === 0 ||
        words.every(w => haystack.includes(w))

      // Price filter — products with no parseable price are excluded
      // whenever a price filter is active.
      let matchPrice = true
      if (priceFilterActive) {
        const priceNum = parsePrice(p.price)
        if (priceNum === null) {
          matchPrice = false
        } else {
          if (appliedMin !== null && priceNum < appliedMin) matchPrice = false
          if (appliedMax !== null && priceNum > appliedMax) matchPrice = false
        }
      }

      return matchCat && matchSearch && matchPrice
    })
    .sort((a, b) => {
      const pa = priorityMap[a.id] ?? Infinity
      const pb = priorityMap[b.id] ?? Infinity
      return pa - pb
    })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-outfit font-bold text-3xl sm:text-4xl text-white mb-2">Product Catalog</h1>
        <p className="bengali text-slate-400">আমাদের সব Product's এখানে দেখুন</p>
      </div>

      <div className="mb-8">
        <PolicyNotice />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-bc-card border border-bc-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-bc-blue/50 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">✕</button>
          )}
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`bengali text-sm font-medium px-4 py-2 rounded-xl border transition-all ${
                tab === t.key
                  ? 'bg-bc-blue border-bc-blue text-white'
                  : 'bg-bc-card border-bc-border text-slate-400 hover:border-bc-blue/40 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── PRICE RANGE FILTER ─────────────────── */}
      <div className="bg-bc-card border border-bc-border rounded-2xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-sm shrink-0 mb-1 sm:mb-0">
            <svg className="w-4 h-4 text-bc-blue" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2m0-10a4.535 4.535 0 013 0" />
            </svg>
            <span className="bengali font-medium">প্রাইস রেঞ্জ</span>
          </div>

          <div className="flex items-center gap-2 flex-1">
            <div className="flex-1 max-w-[140px]">
              <input
                type="number"
                min={0}
                placeholder="সর্বনিম্ন ৳"
                value={minPriceInput}
                onChange={e => setMinPriceInput(e.target.value)}
                className="w-full bg-bc-surface border border-bc-border rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-bc-blue/50 transition-colors"
              />
            </div>
            <span className="text-slate-600">—</span>
            <div className="flex-1 max-w-[140px]">
              <input
                type="number"
                min={0}
                placeholder="সর্বোচ্চ ৳"
                value={maxPriceInput}
                onChange={e => setMaxPriceInput(e.target.value)}
                className="w-full bg-bc-surface border border-bc-border rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-bc-blue/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={applyPriceFilter}
              className="bg-gradient-to-r from-bc-blue to-bc-cyan text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all hover:scale-105"
            >
              ফিল্টার প্রয়োগ করুন
            </button>
            {priceFilterActive && (
              <button
                onClick={clearPriceFilter}
                className="text-slate-500 hover:text-white text-sm px-2 transition-colors"
                title="Clear price filter"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {priceFilterActive && (
          <p className="bengali text-slate-500 text-xs mt-3">
            সক্রিয় ফিল্টার:{' '}
            {appliedMin !== null ? `৳${appliedMin.toLocaleString()}` : 'যেকোনো'}
            {' — '}
            {appliedMax !== null ? `৳${appliedMax.toLocaleString()}` : 'যেকোনো'}
            {tab !== 'all' && ` (শুধু ${TABS.find(t => t.key === tab)?.label} ক্যাটাগরিতে)`}
          </p>
        )}
      </div>

      <p className="text-slate-500 text-sm mb-5">{filtered.length} Products Found</p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-bc-card border border-bc-border rounded-2xl overflow-hidden">
              <div className="shimmer h-44" />
              <div className="p-4 space-y-3">
                <div className="shimmer h-4 rounded w-3/4" />
                <div className="shimmer h-3 rounded w-full" />
                <div className="shimmer h-3 rounded w-2/3" />
                <div className="shimmer h-9 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="bengali text-slate-400">No products found.</p>
          <button onClick={() => { setSearch(''); setTab('all') }} className="mt-4 text-bc-blue text-sm hover:underline">View all products</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}

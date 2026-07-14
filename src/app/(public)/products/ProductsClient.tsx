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

      return matchCat && matchSearch
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

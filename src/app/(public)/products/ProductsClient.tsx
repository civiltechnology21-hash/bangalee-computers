'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase, Product } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import PolicyNotice from '@/components/PolicyNotice'

const TABS = [
  { key: 'all',         label: 'সব',           en: 'All' },
  { key: 'new',         label: 'নতুন ল্যাপটপ',  en: 'New Laptop' },
  { key: 'used',        label: 'পুরনো ল্যাপটপ', en: 'Used Laptop' },
  { key: 'accessories', label: 'আনুষাঙ্গিক',    en: 'Accessories' },
]

const FALLBACK: Product[] = [
  { id:'1', name:'Lenovo IdeaPad 3',     category:'new',         specs:'Core i5 12th Gen | 8GB RAM | 512GB SSD | 15.6" FHD', price:'৳42,000', in_stock:true, featured:true,  created_at:'', image_url:'' },
  { id:'2', name:'Asus VivoBook 15',    category:'new',         specs:'Core i3 12th Gen | 8GB RAM | 256GB SSD | 15.6" FHD', price:'৳38,500', in_stock:true, featured:true,  created_at:'', image_url:'' },
  { id:'3', name:'HP 15s',              category:'new',         specs:'AMD Ryzen 5 | 8GB RAM | 512GB SSD | 15.6" FHD',      price:'৳45,000', in_stock:true, featured:true,  created_at:'', image_url:'' },
  { id:'4', name:'Dell Latitude E7470', category:'used',        specs:'Core i5 6th Gen | 8GB RAM | 256GB SSD | 14" FHD',    price:'৳22,000', in_stock:true, featured:true,  created_at:'', image_url:'' },
  { id:'5', name:'HP EliteBook 840 G3', category:'used',        specs:'Core i5 6th Gen | 8GB RAM | 256GB SSD | 14" FHD',    price:'৳20,000', in_stock:true, featured:true,  created_at:'', image_url:'' },
  { id:'6', name:'Lenovo ThinkPad T460',category:'used',        specs:'Core i5 6th Gen | 8GB RAM | 256GB SSD | 14" HD',     price:'৳18,500', in_stock:true, featured:true,  created_at:'', image_url:'' },
  { id:'7', name:'Mechanical Keyboard', category:'accessories', specs:'RGB Backlit | TKL Layout | Blue Switch',              price:'৳1,500',  in_stock:true, featured:false, created_at:'', image_url:'' },
  { id:'8', name:'Wireless Mouse',      category:'accessories', specs:'2.4GHz Wireless | Ergonomic | DPI Adjustable',       price:'৳800',    in_stock:true, featured:false, created_at:'', image_url:'' },
]

export default function ProductsClient() {
  const searchParams = useSearchParams()
  const initCat = searchParams.get('cat') ?? 'all'

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [search,  setSearch]    = useState('')
  const [tab,     setTab]       = useState(initCat)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
        setProducts((data as Product[]) ?? FALLBACK)
      } catch {
        setProducts(FALLBACK)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const c = searchParams.get('cat')
    if (c) setTab(c)
  }, [searchParams])

  const filtered = products.filter(p => {
    const matchCat = tab === 'all' || p.category === tab
    const q = search.toLowerCase()
    const matchSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      (p.specs ?? '').toLowerCase().includes(q) ||
      (p.name_bn ?? '').includes(q)
    return matchCat && matchSearch
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-outfit font-bold text-3xl sm:text-4xl text-white mb-2">Product Catalog</h1>
        <p className="bengali text-slate-400">আমাদের সব পণ্য এখানে দেখুন</p>
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

      <p className="text-slate-500 text-sm mb-5">{filtered.length} টি পণ্য পাওয়া গেছে</p>

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
          <p className="bengali text-slate-400">কোনো পণ্য পাওয়া যায়নি</p>
          <button onClick={() => { setSearch(''); setTab('all') }} className="mt-4 text-bc-blue text-sm hover:underline">সব দেখুন</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}

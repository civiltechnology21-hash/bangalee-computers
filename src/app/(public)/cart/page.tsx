'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, Product } from '@/lib/supabase'
import { getCartIds, removeFromCart, CART_EVENT } from '@/lib/cart'

const CATS = [
  { v: 'new',         l: 'New Laptop' },
  { v: 'used',        l: 'Used Laptop' },
  { v: 'accessories', l: 'Accessories' },
  { v: 'services',    l: 'Services' },
]

const BADGE: Record<string, string> = {
  new: 'badge-new', used: 'badge-used', accessories: 'badge-accessories', services: 'badge-services'
}

export default function CartPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [catFilter, setCatFilter] = useState('all')

  const load = async () => {
    setLoading(true)
    const ids = getCartIds()
    if (ids.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }
    const { data } = await supabase.from('products').select('*').in('id', ids)
    // Preserve saved order (most-recently-added last, matches localStorage order)
    const byId = new Map((data as Product[] ?? []).map(p => [p.id, p]))
    const ordered = ids.map(id => byId.get(id)).filter(Boolean) as Product[]
    setProducts(ordered)
    setLoading(false)
  }

  useEffect(() => {
    load()
    function onCartUpdate() { load() }
    window.addEventListener(CART_EVENT, onCartUpdate)
    return () => window.removeEventListener(CART_EVENT, onCartUpdate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const del = (id: string) => {
    removeFromCart(id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const filtered = catFilter === 'all' ? products : products.filter(p => p.category === catFilter)

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-outfit font-bold text-xl text-white">My Cart</h1>
        <p className="text-slate-500 text-sm mt-0.5">{products.length} total products</p>
      </div>

      {products.length === 0 && !loading ? (
        <div className="text-center py-20 text-slate-500">
          <div className="text-4xl mb-3">🛒</div>
          <p className="mb-5">No products in the cart.</p>
          <Link href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-bc-blue to-bc-cyan text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all hover:scale-105">
            Return To Shop
          </Link>
        </div>
      ) : (
        <>
          {/* Filter tabs */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {['all', ...CATS.map(c => c.v)].map(c => {
              const count = c === 'all' ? products.length : products.filter(p => p.category === c).length
              return (
                <button key={c} onClick={() => setCatFilter(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all capitalize ${
                    catFilter === c
                      ? 'bg-bc-blue border-bc-blue text-white'
                      : 'bg-bc-card border-bc-border text-slate-400 hover:text-white'
                  }`}>
                  {c === 'all' ? `All (${count})` : `${CATS.find(x => x.v === c)?.l ?? c} (${count})`}
                </button>
              )
            })}
          </div>

          {/* Table — desktop/tablet (≥768px) */}
          {loading ? (
            <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="shimmer h-14 rounded-xl" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <div className="text-4xl mb-3">📦</div>
              <p>No products found in this category</p>
            </div>
          ) : (
            <>
              <div className="hidden md:block bg-bc-card border border-bc-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm table-fixed">
                    <colgroup>
                      <col style={{ width: '58%' }} />
                      <col style={{ width: '18%' }} />
                      <col style={{ width: '14%' }} />
                      <col style={{ width: '10%' }} />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-bc-border">
                        {['Product', 'Category', 'Price', 'Actions'].map(h => (
                          <th key={h} className="text-left text-xs text-slate-500 font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-bc-border/50">
                      {filtered.map(p => (
                        <tr key={p.id} className="hover:bg-bc-border/20 transition-colors">
                          <td className="px-4 py-3 min-w-0">
                            <div className="font-medium text-white text-sm break-words">{p.name}</div>
                            {p.name_bn && (
                              <div className="text-slate-400 text-xs mt-0.5 break-words line-clamp-2">{p.name_bn}</div>
                            )}
                            {p.specs && (
                              <div className="text-slate-500 text-xs mt-0.5 truncate">{p.specs}</div>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE[p.category]}`}>
                              {CATS.find(c => c.v === p.category)?.l ?? p.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-bc-cyan whitespace-nowrap">{p.price ?? '—'}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <button onClick={() => del(p.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-xs">
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Card list — mobile (<768px) */}
              <div className="md:hidden space-y-3">
                {filtered.map(p => (
                  <div key={p.id} className="bg-bc-card border border-bc-border rounded-2xl p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-white text-sm break-words">{p.name}</div>
                        {p.name_bn && (
                          <div className="text-slate-400 text-xs mt-0.5 break-words line-clamp-2">{p.name_bn}</div>
                        )}
                        {p.specs && (
                          <div className="text-slate-500 text-xs mt-0.5 truncate">{p.specs}</div>
                        )}
                      </div>
                      <button onClick={() => del(p.id)}
                        className="shrink-0 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-xs">
                        🗑️
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-bc-border/50">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE[p.category]}`}>
                        {CATS.find(c => c.v === p.category)?.l ?? p.category}
                      </span>
                      <span className="font-semibold text-bc-cyan text-sm">{p.price ?? '—'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

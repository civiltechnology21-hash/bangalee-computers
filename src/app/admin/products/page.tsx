'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase, Product } from '@/lib/supabase'

const EMPTY: Omit<Product, 'id' | 'created_at'> = {
  name: '', name_bn: '', category: 'new', specs: '', price: '',
  image_url: '', in_stock: true, featured: false,
}

const CATS = [
  { v: 'new',         l: 'New Laptop' },
  { v: 'used',        l: 'Used Laptop' },
  { v: 'accessories', l: 'Accessories' },
  { v: 'services',    l: 'Services' },
]

const BADGE: Record<string, string> = {
  new: 'badge-new', used: 'badge-used', accessories: 'badge-accessories', services: 'badge-services'
}

// Auto-expanding textarea hook
function useAutoResize(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 240) + 'px'
  }, [value])
  return ref
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState<'add' | 'edit' | null>(null)
  const [form, setForm]         = useState<Omit<Product, 'id' | 'created_at'>>(EMPTY)
  const [editId, setEditId]     = useState<string | null>(null)
  const [saving, setSaving]     = useState(false)
  const [err, setErr]           = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [quickView, setQuickView] = useState<Product | null>(null)

  const descRef = useAutoResize(form.name_bn ?? '')

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts((data as Product[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(EMPTY); setEditId(null); setErr(''); setModal('add') }
  const openEdit = (p: Product) => {
    setForm({
      name: p.name, name_bn: p.name_bn ?? '', category: p.category,
      specs: p.specs ?? '', price: p.price ?? '', image_url: p.image_url ?? '',
      in_stock: p.in_stock, featured: p.featured,
    })
    setEditId(p.id); setErr(''); setModal('edit')
  }

  const save = async () => {
    if (!form.name.trim()) { setErr('Product name is required.'); return }
    setSaving(true); setErr('')
    try {
      const payload = {
        name: form.name.trim(), name_bn: form.name_bn || null,
        category: form.category, specs: form.specs || null,
        price: form.price || null, image_url: form.image_url || null,
        in_stock: form.in_stock, featured: form.featured,
      }
      if (modal === 'edit' && editId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error
      }
      setModal(null)
      await load()
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const toggleStock = async (id: string, val: boolean) => {
    await supabase.from('products').update({ in_stock: val }).eq('id', id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, in_stock: val } : p))
  }

  const toggleFeatured = async (id: string, val: boolean) => {
    await supabase.from('products').update({ featured: val }).eq('id', id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, featured: val } : p))
  }

  const del = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const filtered = catFilter === 'all' ? products : products.filter(p => p.category === catFilter)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-outfit font-bold text-xl text-white">Products</h1>
          <p className="text-slate-500 text-sm mt-0.5">{products.length} total products</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-bc-blue to-bc-cyan text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all hover:scale-105">
          + Add Product
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['all', ...CATS.map(c => c.v)].map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all capitalize ${
              catFilter === c
                ? 'bg-bc-blue border-bc-blue text-white'
                : 'bg-bc-card border-bc-border text-slate-400 hover:text-white'
            }`}>
            {c === 'all' ? `All (${products.length})` : CATS.find(x => x.v === c)?.l ?? c}
          </button>
        ))}
      </div>

      {/* Table — desktop/tablet (≥768px) */}
      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="shimmer h-14 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <div className="text-4xl mb-3">📦</div>
          <p>No products found</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-bc-card border border-bc-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm table-fixed">
                <colgroup>
                  <col style={{ width: '42%' }} />
                  <col style={{ width: '13%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '11%' }} />
                  <col style={{ width: '11%' }} />
                  <col style={{ width: '11%' }} />
                </colgroup>
                <thead>
                  <tr className="border-b border-bc-border">
                    {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs text-slate-500 font-medium px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-bc-border/50">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-bc-border/20 transition-colors">
                      {/* Product column — fixed max width, text wraps/truncates */}
                      <td className="px-4 py-3 min-w-0">
                        <div className="font-medium text-white text-sm break-words">{p.name}</div>
                        {p.name_bn && (
                          <div className="text-slate-400 text-xs mt-0.5 break-words line-clamp-2">{p.name_bn}</div>
                        )}
                        {p.specs && (
                          <div className="text-slate-500 text-xs mt-0.5 truncate">{p.specs}</div>
                        )}
                      </td>
                      {/* Category column — fixed, never wraps */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE[p.category]}`}>
                          {CATS.find(c => c.v === p.category)?.l ?? p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-bc-cyan whitespace-nowrap">{p.price ?? '—'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button onClick={() => toggleStock(p.id, !p.in_stock)}
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-all ${
                            p.in_stock ? 'bg-green-500/15 text-green-400 border-green-500/30' : 'bg-red-500/15 text-red-400 border-red-500/30'
                          }`}>
                          {p.in_stock ? '✓ In Stock' : '✗ Out'}
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button onClick={() => toggleFeatured(p.id, !p.featured)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                            p.featured ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' : 'bg-bc-surface text-slate-500 border-bc-border'
                          }`}>
                          {p.featured ? '⭐ Yes' : '—'}
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openEdit(p)}
                            className="p-1.5 rounded-lg bg-bc-blue/10 border border-bc-blue/25 text-bc-blue hover:bg-bc-blue/20 transition-all text-xs">
                            ✏️
                          </button>
                          <button onClick={() => del(p.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-xs">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Name-only row list — mobile (<768px), tap to open quick view */}
          <div className="md:hidden bg-bc-card border border-bc-border rounded-2xl divide-y divide-bc-border/50 overflow-hidden">
            {filtered.map(p => (
              <button
                key={p.id}
                onClick={() => setQuickView(p)}
                className="w-full text-left px-4 py-3 hover:bg-bc-border/20 transition-colors"
              >
                <span className="text-white text-sm font-medium leading-snug">{p.name}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Mobile quick-view modal — Name / Category+Price / Stock+Featured / Edit+Delete */}
      {quickView && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setQuickView(null)}>
          <div
            className="bg-bc-card border border-bc-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-5 space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-white font-semibold text-sm leading-snug">{quickView.name}</h3>
              <button onClick={() => setQuickView(null)} className="text-slate-500 hover:text-white text-lg leading-none shrink-0">✕</button>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE[quickView.category]}`}>
                {CATS.find(c => c.v === quickView.category)?.l ?? quickView.category}
              </span>
              <span className="font-semibold text-bc-cyan text-sm">{quickView.price ?? '—'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const val = !quickView.in_stock
                  toggleStock(quickView.id, val)
                  setQuickView({ ...quickView, in_stock: val })
                }}
                className={`flex-1 text-xs font-medium px-2.5 py-2 rounded-full border transition-all ${
                  quickView.in_stock ? 'bg-green-500/15 text-green-400 border-green-500/30' : 'bg-red-500/15 text-red-400 border-red-500/30'
                }`}>
                {quickView.in_stock ? '✓ In Stock' : '✗ Out'}
              </button>
              <button
                onClick={() => {
                  const val = !quickView.featured
                  toggleFeatured(quickView.id, val)
                  setQuickView({ ...quickView, featured: val })
                }}
                className={`flex-1 text-xs px-2.5 py-2 rounded-full border transition-all ${
                  quickView.featured ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' : 'bg-bc-surface text-slate-500 border-bc-border'
                }`}>
                {quickView.featured ? '⭐ Featured' : '— Not Featured'}
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => { setQuickView(null); openEdit(quickView) }}
                className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg bg-bc-blue/10 border border-bc-blue/25 text-bc-blue hover:bg-bc-blue/20 transition-all text-xs font-medium">
                ✏️ Edit
              </button>
              <button
                onClick={() => { setQuickView(null); del(quickView.id) }}
                className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-xs font-medium">
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bc-card border border-bc-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-bc-border flex items-center justify-between">
              <h2 className="font-bold text-white">{modal === 'add' ? 'Add Product' : 'Edit Product'}</h2>
              <button onClick={() => setModal(null)} className="text-slate-500 hover:text-white text-lg leading-none">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">

                {/* Name (English) */}
                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Name (English) *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-bc-surface border border-bc-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-bc-blue/60"
                    placeholder="Product name"
                  />
                </div>

                {/* Description — auto-expanding textarea */}
                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Description</label>
                  <textarea
                    ref={descRef}
                    value={form.name_bn ?? ''}
                    onChange={e => setForm({ ...form, name_bn: e.target.value })}
                    onKeyDown={e => { if (e.key === 'Enter' && e.shiftKey) e.stopPropagation() }}
                    rows={1}
                    style={{ resize: 'none', overflowY: 'auto', minHeight: '42px', maxHeight: '240px' }}
                    className="w-full bg-bc-surface border border-bc-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-bc-blue/60 leading-relaxed"
                    placeholder="Enter product description"
                  />
                  <p className="text-slate-600 text-xs mt-1">Shift + Enter for new line</p>
                </div>

                {/* Category + Price */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value as Product['category'] })}
                    className="w-full bg-bc-surface border border-bc-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-bc-blue/60">
                    {CATS.map(c => <option key={c.v} value={c.v}>{c.l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Price</label>
                  <input
                    value={form.price ?? ''}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-bc-surface border border-bc-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-bc-blue/60"
                    placeholder="৳0.00"
                  />
                </div>

                {/* Specs */}
                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Specs</label>
                  <input
                    value={form.specs ?? ''}
                    onChange={e => setForm({ ...form, specs: e.target.value })}
                    className="w-full bg-bc-surface border border-bc-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-bc-blue/60"
                    placeholder="Enter product specifications"
                  />
                </div>

                {/* Image URL */}
                <div className="col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">Image URL</label>
                  <input
                    value={form.image_url ?? ''}
                    onChange={e => setForm({ ...form, image_url: e.target.value })}
                    className="w-full bg-bc-surface border border-bc-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-bc-blue/60"
                    placeholder="https://..."
                  />
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.in_stock} onChange={e => setForm({ ...form, in_stock: e.target.checked })} className="sr-only peer" />
                    <div className="w-9 h-5 bg-bc-border rounded-full peer-checked:bg-bc-blue transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-4" />
                    <span className="text-sm text-slate-300">In Stock</span>
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="sr-only peer" />
                    <div className="w-9 h-5 bg-bc-border rounded-full peer-checked:bg-yellow-500 transition-colors relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-4" />
                    <span className="text-sm text-slate-300">Featured</span>
                  </label>
                </div>
              </div>

              {err && <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">⚠️ {err}</p>}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setModal(null)}
                  className="flex-1 border border-bc-border text-slate-400 hover:text-white py-2.5 rounded-xl text-sm transition-all">
                  Cancel
                </button>
                <button onClick={save} disabled={saving}
                  className="flex-1 bg-gradient-to-r from-bc-blue to-bc-cyan text-white font-semibold py-2.5 rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-50">
                  {saving ? '⏳ Saving...' : modal === 'add' ? '+ Add Product' : '✓ Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

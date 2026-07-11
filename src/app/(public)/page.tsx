'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { supabase, Product } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import PolicyNotice from '@/components/PolicyNotice'
import { BUSINESS, SERVICES } from '@/lib/constants'

function useSettings() {
  const [settings, setSettings] = useState({
    fb_followers: BUSINESS.fbFollowers,
    fb_rating:    BUSINESS.fbRating,
  })
  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('settings').select('key, value')
      if (!data) return
      const map = Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]))
      setSettings(prev => ({
        fb_followers: map.fb_followers ?? prev.fb_followers,
        fb_rating:    map.fb_rating    ?? prev.fb_rating,
      }))
    }
    fetch()
    const channel = supabase
      .channel('settings-home')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, fetch)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])
  return settings
}

const CAT_ORDER: Record<string, number> = { new: 0, used: 1, accessories: 2, services: 3 }
function sortByCategory(products: Product[]): Product[] {
  return [...products].sort((a, b) => (CAT_ORDER[a.category] ?? 99) - (CAT_ORDER[b.category] ?? 99))
}

function useBreakpoint() {
  const [bp, setBp] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  useEffect(() => {
    function update() {
      const w = window.innerWidth
      if (w < 640) setBp('mobile')
      else if (w < 1024) setBp('tablet')
      else setBp('desktop')
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return bp
}

function Carousel({ products }: { products: Product[] }) {
  const bp = useBreakpoint()
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const visibleCount = bp === 'mobile' ? 1 : bp === 'tablet' ? 2 : 3
  const actualVisible = bp === 'desktop' && products.length >= 4 ? 4 : visibleCount
  const maxIndex = Math.max(0, products.length - actualVisible)
  const [index, setIndex] = useState(0)
  const dragStartX = useRef(0)
  const dragStartIndex = useRef(0)
  const isDragging = useRef(false)
  const dragCurrentX = useRef(0)
  const animating = useRef(false)
  const pointerCaptured = useRef(false)

  useEffect(() => { setIndex(0) }, [bp])
  useEffect(() => { setIndex(i => Math.min(i, maxIndex)) }, [maxIndex])
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft')  goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, maxIndex])

  const goNext = useCallback(() => { setIndex(i => Math.min(i + 1, maxIndex)) }, [maxIndex])
  const goPrev = useCallback(() => { setIndex(i => Math.max(i - 1, 0)) }, [])

  function getCardStyle(): React.CSSProperties {
    if (bp === 'mobile') return { flex: '0 0 84%', maxWidth: '84%' }
    if (bp === 'tablet') return { flex: `0 0 calc(${100 / actualVisible}% - 24px)`, maxWidth: `calc(${100 / actualVisible}% - 24px)` }
    return { flex: `0 0 calc(${100 / actualVisible}% - 28px)`, maxWidth: `calc(${100 / actualVisible}% - 28px)` }
  }
  function getGap() { return bp === 'mobile' ? 12 : bp === 'tablet' ? 16 : 20 }
  function getTranslateX(extraDrag = 0): string {
    const gap = getGap()
    if (bp === 'mobile') {
      const containerWidth = containerRef.current?.offsetWidth ?? 0
      const cardWidth = containerWidth * 0.84
      const step = cardWidth + gap
      return `${containerWidth * 0.08 - index * step + extraDrag}px`
    }
    const containerWidth = containerRef.current?.offsetWidth ?? 0
    const cardWidth = (containerWidth - gap * (actualVisible - 1)) / actualVisible
    return `${-index * (cardWidth + gap) + extraDrag}px`
  }

  function onPointerDown(e: React.PointerEvent) {
    if (animating.current) return
    const target = e.target as HTMLElement
    if (target.closest('a, button')) return
    isDragging.current = true
    pointerCaptured.current = false
    dragStartX.current = e.clientX
    dragCurrentX.current = 0
    dragStartIndex.current = index
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging.current) return
    const delta = e.clientX - dragStartX.current
    if (!pointerCaptured.current && Math.abs(delta) > 5) {
      pointerCaptured.current = true
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }
    dragCurrentX.current = delta
    if (trackRef.current) {
      trackRef.current.style.transition = 'none'
      trackRef.current.style.transform = `translateX(${getTranslateX(delta)})`
    }
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!isDragging.current) return
    isDragging.current = false
    if (pointerCaptured.current) {
      try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId) } catch {}
    }
    pointerCaptured.current = false
    const delta = dragCurrentX.current
    if (delta < -60) goNext()
    else if (delta > 60) goPrev()
    dragCurrentX.current = 0
    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)'
      trackRef.current.style.transform = `translateX(${getTranslateX()})`
    }
  }

  useEffect(() => {
    if (!trackRef.current || isDragging.current) return
    trackRef.current.style.transition = 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)'
    trackRef.current.style.transform = `translateX(${getTranslateX()})`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, bp, products.length])

  if (products.length === 0) return null
  const gap = getGap()
  const cardStyle = getCardStyle()

  return (
    <div className="relative group/carousel">
      {index > 0 && (
        <button onClick={goPrev} aria-label="Previous"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 -translate-x-3
            w-10 h-10 rounded-full bg-bc-card border border-bc-border
            flex items-center justify-center text-bc-gold
            hover:bg-bc-gold hover:border-bc-gold hover:text-bc-text-dark transition-all shadow-xl
            opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {index < maxIndex && (
        <button onClick={goNext} aria-label="Next"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 translate-x-3
            w-10 h-10 rounded-full bg-bc-card border border-bc-border
            flex items-center justify-center text-bc-gold
            hover:bg-bc-gold hover:border-bc-gold hover:text-bc-text-dark transition-all shadow-xl
            opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
      <div ref={containerRef} className="overflow-hidden" style={{ padding: bp === 'mobile' ? '0' : '0 2px' }}>
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          className="flex will-change-transform"
          style={{
            gap: `${gap}px`,
            cursor: isDragging.current ? 'grabbing' : 'grab',
            userSelect: 'none',
            transform: bp === 'mobile' ? `translateX(${(containerRef.current?.offsetWidth ?? 0) * 0.08}px)` : 'translateX(0px)',
          }}
        >
          {products.map(p => (
            <div key={p.id} style={cardStyle} className="shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
      {products.length > actualVisible && (
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all ${
                i === index ? 'w-5 h-1.5 bg-bc-gold' : 'w-1.5 h-1.5 bg-bc-border hover:bg-bc-gold/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function RowSkeleton() {
  return (
    <div className="flex gap-5 overflow-hidden">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex-shrink-0 w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.33%-14px)]
          bg-bc-card border border-bc-border rounded-2xl overflow-hidden">
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
  )
}

function CategoryRow({ category, products }: { category: string; products: Product[] }) {
  const catProducts = products.filter(p => p.category === category)
  if (catProducts.length === 0) return null
  return (
    <div className="mb-10">
      <Carousel products={catProducts} />
    </div>
  )
}

function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchFeatured() {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('featured', true)
      if (error) throw error
      setProducts(sortByCategory((data as Product[]) ?? []))
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeatured()
    const channel = supabase
      .channel('homepage-featured')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => { fetchFeatured() })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return (
    <div className="space-y-10"><RowSkeleton /><RowSkeleton /></div>
  )

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <p className="bengali text-bc-text/60 text-base mb-1">এই মুহূর্তে কোনো featured পণ্য নেই</p>
        <p className="bengali text-bc-text/40 text-sm mb-6">সব পণ্য দেখতে নিচের বোতামে ক্লিক করুন</p>
        <Link href="/products"
          className="inline-flex items-center gap-2 bg-bc-gold text-bc-text-dark font-bold px-6 py-2.5 rounded-xl hover:bg-bc-gold-light transition-all text-sm">
          সব প্রোডাক্ট দেখুন →
        </Link>
      </div>
    )
  }

  return (
    <div>
      <CategoryRow category="new"         products={products} />
      <CategoryRow category="used"        products={products} />
      <CategoryRow category="accessories" products={products} />
      <CategoryRow category="services"    products={products} />
    </div>
  )
}

export default function HomePage() {
  const liveStats = useSettings()

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden circuit-bg">
        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-bc-gold/10 border border-bc-gold/25 rounded-full px-4 py-1.5 text-bc-gold text-sm font-medium mb-6 fade-up">
                <span className="w-2 h-2 rounded-full bg-bc-gold animate-pulse" />
                Khulna's Trusted Tech Partner
              </div>

              <h1 className="bengali font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[1.08] mb-4 fade-up-d1"
                style={{ color: '#FFBF00' }}>
                খুলনার বিশ্বস্ত লোকাল<br />ল্যাপটপ পার্টনার
              </h1>

              <p className="bengali text-xl font-semibold mb-1 fade-up-d1" style={{ color: '#D1D5DB' }}>
                বাঙালী কম্পিউটার্স
              </p>
              <p className="bengali text-base mb-8 fade-up-d2" style={{ color: '#D1D5DB', opacity: 0.7 }}>
                আমরা আপনার এলাকার পুরোনো এবং নতুন ল্যাপটপ সঠিক মূল্যে সরবরাহ করি
              </p>

              <div className="flex flex-wrap gap-4 fade-up-d3">
                {/* Primary — golden */}
                <Link href="/products"
                  className="inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-xl transition-all hover:scale-105"
                  style={{ backgroundColor: '#FFBF00', color: '#111827' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  সব ল্যাপটপ দেখুন
                </Link>

                {/* Secondary — golden outline */}
                <a href={`tel:${BUSINESS.phone1}`}
                  className="inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-xl transition-all hover:scale-105"
                  style={{ border: '2px solid #FFBF00', color: '#FFBF00', backgroundColor: 'transparent' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,191,0,0.08)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  কল করুন
                </a>
              </div>

              <div className="flex flex-wrap gap-3 mt-5 fade-up-d4">
                <a href={`tel:${BUSINESS.phone1}`} className="bengali text-sm font-medium transition-colors hover:text-bc-gold" style={{ color: '#D1D5DB' }}>
                  📞 {BUSINESS.phone1}
                </a>
                <span style={{ color: '#1E2E2D' }}>|</span>
                <a href={`tel:${BUSINESS.phone2}`} className="bengali text-sm font-medium transition-colors hover:text-bc-gold" style={{ color: '#D1D5DB' }}>
                  📞 {BUSINESS.phone2}
                </a>
              </div>
            </div>

            {/* Right — feature cards */}
            <div className="hidden lg:flex flex-col gap-4">
              {SERVICES.slice(0, 3).map((s, i) => (
                <div key={i} className="card-hover rounded-2xl p-5 flex items-start gap-4 fade-up-d2"
                  style={{ backgroundColor: '#162626', border: '1px solid #1E2E2D' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: 'rgba(255,191,0,0.10)', border: '1px solid rgba(255,191,0,0.20)' }}>
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1" style={{ color: '#FFBF00' }}>{s.title}</h3>
                    <p className="bengali text-xs leading-relaxed" style={{ color: '#D1D5DB', opacity: 0.75 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20"
          style={{ background: 'linear-gradient(to top, #0E1717, transparent)' }} />
      </section>

      {/* ─── STATS ─── */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { value: liveStats.fb_followers, label: 'Facebook Followers', icon: '👥' },
            { value: liveStats.fb_rating,    label: 'Facebook Rating',    icon: '⭐' },
            { value: 'Japan/SG',             label: 'Imported Laptops',   icon: '✈️' },
            { value: BUSINESS.yearsInBusiness + ' Years', label: 'In Business', icon: '🏆' },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-4 text-center card-hover"
              style={{ backgroundColor: '#162626', border: '1px solid #1E2E2D' }}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-bold text-xl" style={{ color: '#FFBF00' }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: '#D1D5DB', opacity: 0.6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── POLICY ─── */}
      <section className="max-w-7xl mx-auto px-4 mt-10">
        <PolicyNotice />
      </section>

      {/* ─── USED LAPTOP PROMO ─── */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="relative rounded-3xl p-8 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(255,191,0,0.08) 0%, #162626 100%)', border: '1px solid rgba(255,191,0,0.20)' }}>
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold mb-3"
                style={{ backgroundColor: 'rgba(255,191,0,0.12)', border: '1px solid rgba(255,191,0,0.25)', color: '#FFBF00' }}>
                ✈️ Japan / Singapore Imported
              </div>
              <h2 className="bengali font-bold text-2xl sm:text-3xl mb-2" style={{ color: '#FFBF00' }}>
                রিফার্বিশড ল্যাপটপ
              </h2>
              <p className="bengali text-sm max-w-md leading-relaxed" style={{ color: '#D1D5DB', opacity: 0.75 }}>
                জাপান ও সিঙ্গাপুর থেকে আমদানিকৃত উচ্চমানের রিফার্বিশড ল্যাপটপ। কম দামে প্রিমিয়াম পারফরম্যান্স।
              </p>
            </div>
            <Link href="/products?cat=used"
              className="shrink-0 font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 text-sm"
              style={{ backgroundColor: '#FFBF00', color: '#111827' }}>
              দেখুন →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-outfit font-bold text-2xl sm:text-3xl" style={{ color: '#FFBF00' }}>
              Featured Products
            </h2>
            <p className="bengali text-sm mt-1" style={{ color: '#D1D5DB', opacity: 0.6 }}>সেরা পণ্য সমূহ</p>
          </div>
          <Link href="/products" className="text-sm font-medium transition-colors hover:opacity-80 flex items-center gap-1"
            style={{ color: '#FFBF00' }}>
            সব দেখুন <span>→</span>
          </Link>
        </div>
        <Suspense fallback={<div className="space-y-10"><RowSkeleton /><RowSkeleton /></div>}>
          <FeaturedProducts />
        </Suspense>
      </section>

      {/* ─── SERVICES ─── */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl mb-2" style={{ color: '#FFBF00' }}>Our Services</h2>
          <p className="bengali" style={{ color: '#D1D5DB', opacity: 0.6 }}>আমাদের সার্ভিস সমূহ</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => (
            <div key={i} className="card-hover rounded-2xl p-5 flex items-start gap-4"
              style={{ backgroundColor: '#162626', border: '1px solid #1E2E2D' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: 'rgba(255,191,0,0.10)', border: '1px solid rgba(255,191,0,0.20)' }}>
                {s.icon}
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: '#FFBF00' }}>{s.title}</h3>
                <p className="bengali text-xs leading-relaxed" style={{ color: '#D1D5DB', opacity: 0.7 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/services"
            className="inline-flex items-center gap-2 font-medium px-6 py-2.5 rounded-xl text-sm transition-all hover:scale-105"
            style={{ border: '1.5px solid #FFBF00', color: '#FFBF00' }}>
            সব সার্ভিস দেখুন →
          </Link>
        </div>
      </section>

      {/* ─── CONTACT CTA ─── */}
      <section className="max-w-7xl mx-auto px-4 mt-20 mb-4">
        <div className="relative rounded-3xl p-10 text-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(255,191,0,0.07) 0%, #162626 100%)', border: '1px solid rgba(255,191,0,0.20)' }}>
          <h2 className="bengali font-bold text-2xl sm:text-3xl mb-2" style={{ color: '#FFBF00' }}>
            আজই আমাদের সাথে যোগাযোগ করুন
          </h2>
          <p className="bengali text-sm mb-6 max-w-lg mx-auto" style={{ color: '#D1D5DB', opacity: 0.7 }}>
            {BUSINESS.addressBn}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={BUSINESS.whatsapp} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-bc-wa hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp করুন
            </a>
            <a href={`tel:${BUSINESS.phone1}`}
              className="flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105"
              style={{ backgroundColor: 'transparent', border: '2px solid #FFBF00', color: '#FFBF00' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {BUSINESS.phone1}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

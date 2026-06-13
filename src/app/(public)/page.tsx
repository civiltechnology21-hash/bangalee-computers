'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { supabase, Product } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'
import PolicyNotice from '@/components/PolicyNotice'
import { BUSINESS, SERVICES } from '@/lib/constants'

// ─── Category sort order & config ────────────────────────
const CAT_ORDER: Record<string, number> = { new: 0, used: 1, accessories: 2, services: 3 }

function sortByCategory(products: Product[]): Product[] {
  return [...products].sort(
    (a, b) => (CAT_ORDER[a.category] ?? 99) - (CAT_ORDER[b.category] ?? 99)
  )
}

// ─── Responsive hook ─────────────────────────────────────
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

// ─── Carousel ────────────────────────────────────────────
interface CarouselProps {
  products: Product[]
}

function Carousel({ products }: CarouselProps) {
  const bp = useBreakpoint()
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // How many cards visible per breakpoint
  const visibleCount = bp === 'mobile' ? 1 : bp === 'tablet' ? 2 : 3

  // For desktop: show 4 if >= 4 products
  const actualVisible = bp === 'desktop' && products.length >= 4 ? 4 : visibleCount

  const maxIndex = Math.max(0, products.length - actualVisible)
  const [index, setIndex] = useState(0)

  // Drag / swipe state
  const dragStartX = useRef(0)
  const dragStartIndex = useRef(0)
  const isDragging = useRef(false)
  const dragCurrentX = useRef(0)
  const animating = useRef(false)

  // Reset index on breakpoint change
  useEffect(() => {
    setIndex(0)
  }, [bp])

  // Clamp index if products change
  useEffect(() => {
    setIndex(i => Math.min(i, maxIndex))
  }, [maxIndex])

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, maxIndex])

  const goNext = useCallback(() => {
    setIndex(i => Math.min(i + 1, maxIndex))
  }, [maxIndex])

  const goPrev = useCallback(() => {
    setIndex(i => Math.max(i - 1, 0))
  }, [])

  // ── Compute card width & gap ──
  // Mobile: show 1 card with peek on both sides (~8% peek each side)
  // Tablet: 2 cards; Desktop: 3-4 cards
  function getCardStyle(): React.CSSProperties {
    if (bp === 'mobile') {
      // 1 card visible, 8% peek on each side
      return { flex: '0 0 84%', maxWidth: '84%' }
    }
    if (bp === 'tablet') {
      return { flex: `0 0 calc(${100 / actualVisible}% - 8px)`, maxWidth: `calc(${100 / actualVisible}% - 8px)` }
    }
    // desktop
    return { flex: `0 0 calc(${100 / actualVisible}% - 12px)`, maxWidth: `calc(${100 / actualVisible}% - 12px)` }
  }

  function getGap() {
    if (bp === 'mobile') return 12
    if (bp === 'tablet') return 16
    return 20
  }

  function getTranslateX(extraDrag = 0): string {
    const gap = getGap()
    if (bp === 'mobile') {
      // 8% peek padding on left, so first card starts at 8%
      // Each step = cardWidth + gap = 84% + gap
      const containerWidth = containerRef.current?.offsetWidth ?? 0
      const cardWidth = containerWidth * 0.84
      const step = cardWidth + gap
      const base = containerWidth * 0.08 - index * step + extraDrag
      return `${base}px`
    }
    const containerWidth = containerRef.current?.offsetWidth ?? 0
    const cardWidth = (containerWidth - gap * (actualVisible - 1)) / actualVisible
    const step = cardWidth + gap
    return `${-index * step + extraDrag}px`
  }

  // ── Pointer events (drag + swipe) ──
  function onPointerDown(e: React.PointerEvent) {
    if (animating.current) return
    isDragging.current = true
    dragStartX.current = e.clientX
    dragCurrentX.current = 0
    dragStartIndex.current = index
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging.current) return
    const delta = e.clientX - dragStartX.current
    dragCurrentX.current = delta
    if (trackRef.current) {
      trackRef.current.style.transition = 'none'
      trackRef.current.style.transform = `translateX(${getTranslateX(delta)})`
    }
  }

  function onPointerUp() {
    if (!isDragging.current) return
    isDragging.current = false
    const delta = dragCurrentX.current
    const threshold = 60
    if (delta < -threshold) goNext()
    else if (delta > threshold) goPrev()
    dragCurrentX.current = 0
    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)'
      trackRef.current.style.transform = `translateX(${getTranslateX()})`
    }
  }

  // Apply transform on index change
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
      {/* Left Arrow */}
      {index > 0 && (
        <button
          onClick={goPrev}
          aria-label="Previous"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 -translate-x-3
            w-10 h-10 rounded-full bg-bc-card border border-bc-border
            flex items-center justify-center text-white
            hover:bg-bc-blue hover:border-bc-blue transition-all shadow-xl
            opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Right Arrow */}
      {index < maxIndex && (
        <button
          onClick={goNext}
          aria-label="Next"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 translate-x-3
            w-10 h-10 rounded-full bg-bc-card border border-bc-border
            flex items-center justify-center text-white
            hover:bg-bc-blue hover:border-bc-blue transition-all shadow-xl
            opacity-0 group-hover/carousel:opacity-100 focus:opacity-100"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Viewport */}
      <div
        ref={containerRef}
        className="overflow-hidden"
        style={{
          // Mobile: add 8% padding each side so peek is visible
          padding: bp === 'mobile' ? '0' : '0 2px',
        }}
      >
        {/* Track */}
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
            transform: bp === 'mobile'
              ? `translateX(${(containerRef.current?.offsetWidth ?? 0) * 0.08}px)`
              : 'translateX(0px)',
          }}
        >
          {products.map(p => (
            <div key={p.id} style={cardStyle} className="shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      {products.length > actualVisible && (
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all ${
                i === index
                  ? 'w-5 h-1.5 bg-bc-blue'
                  : 'w-1.5 h-1.5 bg-bc-border hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Skeleton ────────────────────────────────────────────
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

// ─── Category Carousel Row ────────────────────────────────
function CategoryRow({ category, products }: { category: string; products: Product[] }) {
  const catProducts = products.filter(p => p.category === category)
  if (catProducts.length === 0) return null

  return (
    <div className="mb-10">
      <Carousel products={catProducts} />
    </div>
  )
}

// ─── Featured products — realtime client component ────────
function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchFeatured() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
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
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => { fetchFeatured() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) return (
    <div className="space-y-10">
      <RowSkeleton />
      <RowSkeleton />
    </div>
  )

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <p className="bengali text-slate-400 text-base mb-1">এই মুহূর্তে কোনো featured পণ্য নেই</p>
        <p className="bengali text-slate-500 text-sm mb-6">সব পণ্য দেখতে নিচের বোতামে ক্লিক করুন</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-bc-blue to-bc-cyan text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-all text-sm"
        >
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

// ─── Page ────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      {/* ─── HERO ───────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden grid-bg">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-bc-blue/10 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-bc-cyan/8 blur-[90px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-bc-blue/10 border border-bc-blue/25 rounded-full px-4 py-1.5 text-bc-blue text-sm font-medium mb-6 fade-up">
              <span className="w-2 h-2 rounded-full bg-bc-cyan animate-pulse" />
              Khulna's Trusted Tech Partner
            </div>
            <h1 className="font-outfit font-extrabold text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-4 fade-up-d1">
              Best Laptops
              <br />
              <span className="gradient-text">Best Prices</span>
            </h1>
            <p className="bengali text-xl sm:text-2xl text-slate-300 mb-2 fade-up-d1">
              বাঙালী কম্পিউটার্স — খুলনার বিশ্বস্ত ল্যাপটপ শপ
            </p>
            <p className="bengali text-slate-500 text-base mb-8 fade-up-d2">
              নতুন ও জাপান/সিঙ্গাপুর আমদানিকৃত রিফার্বিশড ল্যাপটপ | মেরামত ও আপগ্রেড সার্ভিস
            </p>

            <div className="flex flex-wrap gap-4 fade-up-d3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-bc-blue to-bc-cyan text-white font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-bc-blue/25"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                সব প্রোডাক্ট দেখুন
              </Link>
              <a
                href={`tel:${BUSINESS.phone1}`}
                className="inline-flex items-center gap-2 bg-bc-surface border border-bc-border hover:border-bc-blue/50 text-white font-semibold px-7 py-3.5 rounded-xl transition-all hover:scale-105"
              >
                <svg className="w-5 h-5 text-bc-blue" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                এখনই কল করুন
              </a>
            </div>

            <div className="flex flex-wrap gap-3 mt-5 fade-up-d4">
              <a href={`tel:${BUSINESS.phone1}`} className="bengali text-bc-cyan text-sm font-medium hover:text-white transition-colors">
                📞 {BUSINESS.phone1}
              </a>
              <span className="text-bc-border">|</span>
              <a href={`tel:${BUSINESS.phone2}`} className="bengali text-bc-cyan text-sm font-medium hover:text-white transition-colors">
                📞 {BUSINESS.phone2}
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-bc-bg to-transparent" />
      </section>

      {/* ─── STATS ROW ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { value: BUSINESS.fbFollowers,                label: 'Facebook Followers', icon: '👥' },
            { value: BUSINESS.fbRating,                   label: 'Facebook Rating',    icon: '⭐' },
            { value: 'Japan/SG',                          label: 'Imported Laptops',   icon: '✈️' },
            { value: BUSINESS.yearsInBusiness + ' Years', label: 'In Business',        icon: '🏆' },
          ].map((s, i) => (
            <div key={i} className="bg-bc-card border border-bc-border rounded-2xl p-4 text-center blue-glow">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-bold text-xl text-white">{s.value}</div>
              <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── POLICY NOTICE ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 mt-10">
        <PolicyNotice />
      </section>

      {/* ─── USED LAPTOPS PROMO ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="relative bg-gradient-to-r from-amber-500/10 to-bc-card border border-amber-500/20 rounded-3xl p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/25 rounded-full px-3 py-1 text-amber-400 text-xs font-bold mb-3">
                ✈️ Japan / Singapore Imported
              </div>
              <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-white mb-2">
                রিফার্বিশড ল্যাপটপ
              </h2>
              <p className="bengali text-slate-400 text-sm max-w-md leading-relaxed">
                জাপান ও সিঙ্গাপুর থেকে আমদানিকৃত উচ্চমানের রিফার্বিশড ল্যাপটপ। কম দামে প্রিমিয়াম পারফরম্যান্স।
              </p>
            </div>
            <Link
              href="/products?cat=used"
              className="shrink-0 bg-amber-500 hover:bg-amber-400 text-bc-bg font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 text-sm"
            >
              দেখুন →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PRODUCT CAROUSELS ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-white">
              Featured Products
            </h2>
            <p className="bengali text-slate-400 text-sm mt-1">সেরা পণ্য সমূহ</p>
          </div>
          <Link href="/products" className="text-bc-blue hover:text-bc-cyan text-sm font-medium transition-colors flex items-center gap-1">
            সব দেখুন <span>→</span>
          </Link>
        </div>

        <Suspense fallback={<div className="space-y-10"><RowSkeleton /><RowSkeleton /></div>}>
          <FeaturedProducts />
        </Suspense>
      </section>

      {/* ─── SERVICES ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-white mb-2">Our Services</h2>
          <p className="bengali text-slate-400">আমাদের সার্ভিস সমূহ</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => (
            <div key={i} className="card-hover bg-bc-card border border-bc-border rounded-2xl p-5 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-bc-blue/10 border border-bc-blue/20 flex items-center justify-center text-xl shrink-0">
                {s.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm mb-1">{s.title}</h3>
                <p className="bengali text-slate-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 border border-bc-blue/40 text-bc-blue hover:bg-bc-blue/10 font-medium px-6 py-2.5 rounded-xl text-sm transition-all"
          >
            সব সার্ভিস দেখুন →
          </Link>
        </div>
      </section>

      {/* ─── CONTACT CTA ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 mt-20 mb-4">
        <div className="relative bg-gradient-to-br from-bc-blue/15 to-bc-cyan/10 border border-bc-blue/25 rounded-3xl p-10 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-bc-blue/15 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="font-outfit font-bold text-2xl sm:text-3xl text-white mb-2">
              আজই আমাদের সাথে যোগাযোগ করুন
            </h2>
            <p className="bengali text-slate-400 text-sm mb-6 max-w-lg mx-auto">
              {BUSINESS.addressBn}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={BUSINESS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-bc-wa hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp করুন
              </a>
              <a
                href={`tel:${BUSINESS.phone1}`}
                className="flex items-center gap-2 bg-bc-surface border border-bc-border hover:border-bc-blue/50 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105"
              >
                <svg className="w-5 h-5 text-bc-blue" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {BUSINESS.phone1}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

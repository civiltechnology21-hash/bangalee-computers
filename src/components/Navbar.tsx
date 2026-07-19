'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { BUSINESS, NAV_LINKS } from '@/lib/constants'

const CART_KEY = 'bc_cart'
const CART_EVENT = 'bc-cart-updated'

function getCartCount(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = window.localStorage.getItem(CART_KEY)
    if (!raw) return 0
    const items = JSON.parse(raw)
    return Array.isArray(items) ? items.length : 0
  } catch {
    return 0
  }
}

function TrolleyIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l3.6-8H5.4M7 13L5.4 5M7 13l-1.4 5.6A1 1 0 006.56 20H18M9 20a1 1 0 100 2 1 1 0 000-2zm9 0a1 1 0 100 2 1 1 0 000-2z" />
    </svg>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    setCartCount(getCartCount())

    function onCartUpdate() { setCartCount(getCartCount()) }
    function onStorage(e: StorageEvent) { if (e.key === CART_KEY) setCartCount(getCartCount()) }

    window.addEventListener(CART_EVENT, onCartUpdate)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(CART_EVENT, onCartUpdate)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md"
      style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderBottom: '1px solid #E2E8F0' }}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo.png"
            alt="Bangalee Computers"
            className="w-9 h-9 rounded-lg object-cover group-hover:scale-110 transition-transform shadow-lg"
          />
          <div className="leading-none">
            <div className="font-outfit font-bold text-sm tracking-wide" style={{ color: '#0F172A' }}>Bangalee</div>
            <div className="bengali text-xs font-medium" style={{ color: '#2563EB' }}>কম্পিউটার্স</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
              style={
                pathname === l.href
                  ? { color: '#2563EB', backgroundColor: 'rgba(37,99,235,0.08)' }
                  : { color: '#475569' }
              }
              onMouseEnter={e => {
                if (pathname !== l.href) {
                  (e.currentTarget as HTMLElement).style.color = '#2563EB'
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(37,99,235,0.05)'
                }
              }}
              onMouseLeave={e => {
                if (pathname !== l.href) {
                  (e.currentTarget as HTMLElement).style.color = '#475569'
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                }
              }}
            >
              {l.labelEn}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Cart — trolley icon */}
          <Link
            href="/cart"
            aria-label="My Cart"
            className="relative hidden md:flex items-center justify-center w-10 h-10 rounded-lg transition-all hover:scale-105"
            style={{ color: '#475569' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#2563EB'
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(37,99,235,0.05)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = '#475569'
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
            }}
          >
            <TrolleyIcon />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* WhatsApp — unchanged */}
          <a
            href={BUSINESS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-bc-wa hover:bg-green-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:scale-105"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp
          </a>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-md transition-colors"
            style={{ color: '#475569' }}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 bg-current transition-all ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 py-3 space-y-1"
          style={{ borderTop: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-md text-sm font-medium transition-all"
              style={
                pathname === l.href
                  ? { color: '#2563EB', backgroundColor: 'rgba(37,99,235,0.08)' }
                  : { color: '#475569' }
              }
            >
              {l.labelEn} <span className="bengali ml-1" style={{ color: '#2563EB', opacity: 0.6 }}>{l.label}</span>
            </Link>
          ))}

          {/* Cart — mobile */}
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-all"
            style={{ color: '#475569' }}
          >
            <span className="flex items-center gap-2">
              <TrolleyIcon className="w-4 h-4" />
              My Cart
            </span>
            {cartCount > 0 && (
              <span
                className="min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold"
                style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* WhatsApp — unchanged */}
          <a
            href={BUSINESS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-bc-wa text-white text-sm font-semibold px-4 py-2.5 rounded-lg mt-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp করুন
          </a>
        </div>
      )}
    </header>
  )
}

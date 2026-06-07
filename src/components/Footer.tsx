import Link from 'next/link'
import { BUSINESS, NAV_LINKS, NOTICE_BN } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="border-t border-bc-border bg-bc-surface mt-20">
      {/* Notice banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 py-3 px-4">
        <p className="bengali text-center text-amber-400 text-sm font-medium">
          ⚠️ {NOTICE_BN}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-bc-blue to-bc-cyan flex items-center justify-center text-white font-black">
                BC
              </div>
              <div>
                <div className="font-bold text-white">Bangalee Computers</div>
                <div className="bengali text-bc-cyan text-xs">বাঙালী কম্পিউটার্স</div>
              </div>
            </div>
            <p className="bengali text-slate-400 text-sm leading-relaxed">
              খুলনার বিশ্বস্ত কম্পিউটার ও ল্যাপটপ শপ। জাপান/সিঙ্গাপুর আমদানিকৃত রিফার্বিশড ল্যাপটপ এবং নতুন ল্যাপটপের জন্য আমাদের সাথে যোগাযোগ করুন।
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a href={BUSINESS.facebook} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#1877f2]/10 hover:bg-[#1877f2]/25 border border-[#1877f2]/30 flex items-center justify-center text-[#1877f2] transition-all hover:scale-110" title="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href={BUSINESS.youtube} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#ff0000]/10 hover:bg-[#ff0000]/25 border border-[#ff0000]/30 flex items-center justify-center text-[#ff4444] transition-all hover:scale-110" title="YouTube">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-pink-600/10 hover:bg-pink-600/25 border border-pink-600/30 flex items-center justify-center text-pink-400 transition-all hover:scale-110" title="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href={BUSINESS.maps} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-bc-blue/10 hover:bg-bc-blue/25 border border-bc-blue/30 flex items-center justify-center text-bc-blue transition-all hover:scale-110" title="Google Maps">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-slate-400 hover:text-bc-cyan text-sm transition-colors flex items-center gap-1.5">
                    <span className="text-bc-blue/60">›</span> {l.labelEn}
                    <span className="bengali text-slate-600 text-xs">({l.label})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-slate-400">
                <svg className="w-4 h-4 text-bc-blue mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="bengali leading-relaxed">{BUSINESS.addressBn}</span>
              </li>
              <li>
                <a href={`tel:${BUSINESS.phone1}`} className="flex items-center gap-2 text-slate-400 hover:text-bc-cyan transition-colors">
                  <svg className="w-4 h-4 text-bc-blue shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {BUSINESS.phone1}
                </a>
              </li>
              <li>
                <a href={`tel:${BUSINESS.phone2}`} className="flex items-center gap-2 text-slate-400 hover:text-bc-cyan transition-colors">
                  <svg className="w-4 h-4 text-bc-blue shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {BUSINESS.phone2}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">Business Hours</h3>
            <ul className="space-y-2 text-sm">
              <li className="bengali text-slate-300">{BUSINESS.hours.weekdays}</li>
              <li className="bengali text-red-400 font-medium">🚫 {BUSINESS.hours.friday}</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-bc-border">
              <div className="flex items-center gap-1.5 text-sm">
                <span className="w-2 h-2 rounded-full bg-bc-wa animate-pulse"></span>
                <span className="text-slate-400 bengali">এখন খোলা</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-bc-border flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Bangalee Computers. All rights reserved.</p>
          <p className="bengali">মাসিক খরচ: ৳০ | Powered by Next.js + Supabase + Vercel</p>
        </div>
      </div>
    </footer>
  )
}

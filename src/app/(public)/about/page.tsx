'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BUSINESS } from '@/lib/constants'
import { supabase } from '@/lib/supabase'

// ─── Live settings from Supabase ─────────────────────────
type Settings = {
  fb_followers: string
  fb_rating: string
  google_rating: string
  yt_subscribers: string
  years_in_business: string
}

function useSettings() {
  const [settings, setSettings] = useState<Settings>({
    fb_followers:      BUSINESS.fbFollowers,
    fb_rating:         BUSINESS.fbRating,
    google_rating:     BUSINESS.googleRating,
    yt_subscribers:    '৬৭০+',
    years_in_business: BUSINESS.yearsInBusiness,
  })

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('settings').select('key, value')
      if (!data) return
      const map = Object.fromEntries(data.map(r => [r.key, r.value]))
      setSettings(prev => ({
        fb_followers:      map.fb_followers      ?? prev.fb_followers,
        fb_rating:         map.fb_rating         ?? prev.fb_rating,
        google_rating:     map.google_rating     ?? prev.google_rating,
        yt_subscribers:    map.yt_subscribers    ?? prev.yt_subscribers,
        years_in_business: map.years_in_business ?? prev.years_in_business,
      }))
    }
    fetch()

    const channel = supabase
      .channel('settings-about')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, fetch)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return settings
}

export default function AboutPage() {
  const s = useSettings()

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="max-w-2xl mb-12">
        <div className="inline-flex items-center gap-2 bg-bc-blue/10 border border-bc-blue/25 rounded-full px-3 py-1 text-bc-blue text-xs font-medium mb-4">
          🏪 About Us
        </div>
        <h1 className="font-outfit font-bold text-3xl sm:text-4xl text-white mb-3">
          বাঙালী কম্পিউটার্স সম্পর্কে
        </h1>
        <p className="bengali text-slate-400 leading-relaxed">
          খুলনার বিশ্বস্ত কম্পিউটার ও ল্যাপটপ শপ — বাঙালী কম্পিউটার্স।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Story */}
        <div className="space-y-5">
          <div className="bg-bc-card border border-bc-border rounded-2xl p-6">
            <h2 className="font-outfit font-bold text-xl text-white mb-4 flex items-center gap-2">
              <span className="text-bc-blue">📖</span> আমাদের গল্প
            </h2>
            <p className="bengali text-slate-400 text-sm leading-7">
              💙 বিশ্বাসস্থতার একটাই নাম Bangalee Computers 💙 ✅আপনাদের সেবাই আমাদের মূল লক্ষ ... তাই আর দেরি না করে এখনই আমাদের সপটি ভিজিট করুন। বাঙালী কম্পিউটার্স খুলনার একটি বিশ্বস্ত প্রযুক্তি প্রতিষ্ঠান। আমরা গত {s.years_in_business} বছরেরও বেশি সময় ধরে খুলনাবাসীকে মানসম্পন্ন ল্যাপটপ এবং কম্পিউটার সেবা প্রদান করে আসছি।
            </p>
            <p className="bengali text-slate-400 text-sm leading-7 mt-3">
              🚀 আমাদের শপ থেকে নিজের জন্য বেছে নিন সেরা ল্যাপটপ! 💼 অফিস কাজ হোক বা গেমিং – সবকিছু হবে আরও স্মার্ট! 📍 এখনই আমাদের শপে আসুন এবং নতুন ল্যাপটপের অভিজ্ঞতা নিন! এই ল্যাপটপগুলো কম দামে প্রিমিয়াম পারফরম্যান্স দেয় এবং আমাদের দক্ষ টেকনিশিয়ান দ্বারা পরীক্ষিত।
            </p>
          </div>

          {/* Ratings */}
          <div className="bg-bc-card border border-bc-border rounded-2xl p-6">
            <h2 className="font-outfit font-bold text-lg text-white mb-4 flex items-center gap-2">
              <span className="text-yellow-400">⭐</span> গ্রাহক রেটিং
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1877f2]/15 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-slate-300 text-sm">Facebook Rating</span>
                </div>
                <span className="text-yellow-400 font-bold">{s.fb_rating}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center text-sm font-bold text-red-400">G</div>
                  <span className="text-slate-300 text-sm">Google Rating</span>
                </div>
                <span className="text-yellow-400 font-bold">{s.google_rating}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1877f2]/15 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-slate-300 text-sm">Facebook Followers</span>
                </div>
                <span className="text-bc-cyan font-bold">{s.fb_followers}</span>
              </div>
            </div>
          </div>

          {/* Social links */}
          <div className="bg-bc-card border border-bc-border rounded-2xl p-6">
            <h2 className="font-outfit font-bold text-lg text-white mb-4">📱 আমাদের সোশ্যাল মিডিয়া</h2>
            <div className="space-y-3">
              <a href={BUSINESS.facebook} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-bc-border/30 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-[#1877f2]/15 border border-[#1877f2]/25 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">Facebook</div>
                  <div className="text-slate-500 text-xs">bangalee.computers · {s.fb_followers} followers</div>
                </div>
                <svg className="w-4 h-4 text-slate-600 group-hover:text-bc-blue transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a href={BUSINESS.youtube} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-bc-border/30 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-red-600/15 border border-red-600/25 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">YouTube</div>
                  <div className="text-slate-500 text-xs">{s.yt_subscribers} subscribers</div>
                </div>
                <svg className="w-4 h-4 text-slate-600 group-hover:text-bc-blue transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Map + location */}
        <div className="space-y-5">
          <div className="bg-bc-card border border-bc-border rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-bc-border">
              <h2 className="font-outfit font-bold text-lg text-white flex items-center gap-2">
                <span className="text-bc-blue">📍</span> আমাদের অবস্থান
              </h2>
            </div>
            <div className="relative h-64 bg-bc-surface">
              <iframe
                src="https://maps.google.com/maps?q=Tiger+Garden+International+Hotel+KDA+Avenue+Khulna+Bangladesh&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="p-5">
              <p className="bengali text-slate-300 text-sm leading-relaxed">{BUSINESS.addressBn}</p>
              <a href={BUSINESS.maps} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-bc-blue hover:text-bc-cyan text-sm font-medium mt-3 transition-colors">
                Google Maps এ দেখুন →
              </a>
            </div>
          </div>

          {/* Why choose us */}
          <div className="bg-bc-card border border-bc-border rounded-2xl p-6">
            <h2 className="font-outfit font-bold text-lg text-white mb-5 flex items-center gap-2">
              <span>🏆</span> কেন আমাদের বেছে নেবেন?
            </h2>
            <ul className="space-y-3">
              {[
                { icon: '✈️', text: 'জাপান ও সিঙ্গাপুর আমদানিকৃত রিফার্বিশড ল্যাপটপ' },
                { icon: '✅', text: 'প্রতিটি পণ্য ব্যবহারের আগে পরীক্ষিত ও যাচাইকৃত' },
                { icon: '💰', text: 'সাশ্রয়ী মূল্যে সর্বোচ্চ মানের পণ্য' },
                { icon: '🔧', text: 'বিক্রয়োত্তর মেরামত ও সার্ভিস সুবিধা' },
                { icon: '📞', text: `${s.years_in_business}+ বছরের বিশ্বস্ত সেবার অভিজ্ঞতা` },
                { icon: '👥', text: `${s.fb_followers} সন্তুষ্ট গ্রাহক Facebook-এ` },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <span className="bengali text-slate-300 text-sm leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-br from-bc-blue/10 to-bc-cyan/5 border border-bc-blue/20 rounded-3xl p-10">
        <h2 className="font-outfit font-bold text-2xl text-white mb-2">আজই আমাদের সাথে যোগাযোগ করুন</h2>
        <p className="bengali text-slate-400 text-sm mb-6">আমরা আপনাকে সাহায্য করতে সর্বদা প্রস্তুত।</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact"
            className="bg-gradient-to-r from-bc-blue to-bc-cyan text-white font-semibold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-all hover:scale-105">
            যোগাযোগ ফর্ম পূরণ করুন
          </Link>
          <Link href="/products"
            className="bg-bc-surface border border-bc-border text-white font-semibold px-6 py-3 rounded-xl text-sm hover:border-bc-blue/50 transition-all hover:scale-105">
            পণ্য দেখুন →
          </Link>
        </div>
      </div>
    </div>
  )
}

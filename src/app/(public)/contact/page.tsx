'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { BUSINESS } from '@/lib/constants'

const CATEGORIES = [
  'নতুন ল্যাপটপ কিনতে চাই',
  'পুরনো/রিফার্বিশড ল্যাপটপ কিনতে চাই',
  'ল্যাপটপ মেরামত করাতে চাই',
  'OS ইনস্টলেশন করাতে চাই',
  'SSD/RAM আপগ্রেড করাতে চাই',
  'স্ক্রিন রিপ্লেসমেন্ট করাতে চাই',
  'অন্যান্য',
]

// BD valid prefixes
const VALID_PREFIXES = ['017', '013', '019', '014', '018', '016', '015']

// Bengali digit map
const BN_TO_EN: Record<string, string> = {
  '০':'0','১':'1','২':'2','৩':'3','৪':'4',
  '৫':'5','৬':'6','৭':'7','৮':'8','৯':'9',
}

function toEnDigits(str: string) {
  return str.split('').map(c => BN_TO_EN[c] ?? c).join('')
}

function formatPhone(raw: string) {
  // raw = digits only, max 11
  if (raw.length <= 5) return raw
  return raw.slice(0, 5) + '-' + raw.slice(5)
}

export default function ContactPage() {
  const [form, setForm]     = useState({ name: '', phone: '', category: '', message: '' })
  const [rawPhone, setRawPhone] = useState('')          // digits only, no hyphen
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [err, setErr]       = useState('')

  // ── Name validation ─────────────────────────────────────────
  const nameLen    = form.name.length
  const nameTooShort = nameLen > 0 && nameLen < 3
  const nameTooLong  = nameLen > 50

  // ── Phone validation ────────────────────────────────────────
  const phoneDigits  = rawPhone.length          // 0-11
  const prefix3      = rawPhone.slice(0, 3)
  const prefixInvalid =
    rawPhone.length >= 3 && !VALID_PREFIXES.includes(prefix3)
  const phoneTooShort = rawPhone.length > 0 && rawPhone.length < 11
  const phoneReady    = rawPhone.length === 11 && !prefixInvalid

  // ── Message validation ──────────────────────────────────────
  const msgLen     = form.message.length
  const msgTooLong = msgLen > 1000

  // ── Phone input handler ─────────────────────────────────────
  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    // Strip hyphen, map bengali digits, keep only numeric chars, max 11
    const digits = toEnDigits(raw.replace(/-/g, '')).replace(/\D/g, '').slice(0, 11)
    setRawPhone(digits)
    setForm(prev => ({ ...prev, phone: digits }))
  }

  // ── Submit ──────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.name.trim() || nameLen < 3) {
      setErr('নামে কমপক্ষে ৩টি অক্ষর দিতে হবে।'); return
    }
    if (nameTooLong) {
      setErr('নাম ৫০ অক্ষরের বেশি হতে পারবে না।'); return
    }
    if (rawPhone.length !== 11) {
      setErr('সঠিক ১১ ডিজিটের ফোন নম্বর দিতে হবে।'); return
    }
    if (prefixInvalid) {
      setErr('বৈধ বাংলাদেশি নম্বর দিন।'); return
    }
    if (msgTooLong) {
      setErr('বার্তা ১০০০ অক্ষরের বেশি হতে পারবে না।'); return
    }

    setStatus('loading'); setErr('')
    try {
      const { error } = await supabase.from('inquiries').insert({
        name:     form.name.trim(),
        phone:    formatPhone(rawPhone),
        category: form.category || null,
        message:  form.message.trim() || null,
      })
      if (error) throw error
      setStatus('success')
      setForm({ name: '', phone: '', category: '', message: '' })
      setRawPhone('')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error'
      setErr('সমস্যা হয়েছে। সরাসরি ফোন করুন: ' + BUSINESS.phone1)
      setStatus('error')
      console.error(msg)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="max-w-2xl mb-10">
        <div className="inline-flex items-center gap-2 bg-bc-blue/10 border border-bc-blue/25 rounded-full px-3 py-1 text-bc-blue text-xs font-medium mb-4">
          📞 Contact Us
        </div>
        <h1 className="font-outfit font-bold text-3xl sm:text-4xl text-white mb-2">যোগাযোগ করুন</h1>
        <p className="bengali text-slate-400">আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── FORM ─────────────────────────────── */}
        <div className="lg:col-span-3">
          {status === 'success' ? (
            <div className="bg-bc-wa/10 border border-bc-wa/30 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="font-bold text-xl text-white mb-2">বার্তা পাঠানো হয়েছে!</h3>
              <p className="bengali text-slate-400 text-sm mb-6">আমরা শীঘ্রই আপনাকে ফোন করব।</p>
              <button
                onClick={() => setStatus('idle')}
                className="bg-bc-blue hover:bg-bc-blue/80 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all"
              >
                আরেকটি বার্তা পাঠান
              </button>
            </div>
          ) : (
            <div className="bg-bc-card border border-bc-border rounded-2xl p-6 space-y-5">
              <h2 className="font-semibold text-white text-lg">📝 ইনকোয়ারি ফর্ম</h2>

              {/* ── Name ── */}
              <div>
                <label className="bengali block text-sm text-slate-400 mb-1.5">
                  নাম <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="আপনার নাম লিখুন"
                  value={form.name}
                  maxLength={50}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className={`bengali w-full bg-bc-surface border rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none transition-colors ${
                    nameTooShort || nameTooLong
                      ? 'border-red-500/60 focus:border-red-500'
                      : 'border-bc-border focus:border-bc-blue/60'
                  }`}
                />
                {nameTooShort && (
                  <p className="bengali text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    ⚠️ নামে কমপক্ষে ৩টি অক্ষর থাকতে হবে।
                  </p>
                )}
                {nameTooLong && (
                  <p className="bengali text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    ⚠️ নাম সর্বোচ্চ ৫০ অক্ষরের মধ্যে হতে হবে।
                  </p>
                )}
                {!nameTooShort && !nameTooLong && nameLen > 0 && (
                  <p className="text-slate-600 text-xs mt-1 text-right">{nameLen}/50</p>
                )}
              </div>

              {/* ── Phone ── */}
              <div>
                <label className="bengali block text-sm text-slate-400 mb-1.5">
                  ফোন নম্বর <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="01XXXXXXXXX"
                  value={rawPhone.length > 5 ? rawPhone.slice(0,5) + '-' + rawPhone.slice(5) : rawPhone}
                  onChange={handlePhoneChange}
                  className={`w-full bg-bc-surface border rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none transition-colors ${
                    prefixInvalid || (phoneTooShort && phoneDigits === 11 === false && phoneDigits > 0 && phoneDigits < 11 && phoneDigits >= 3)
                      ? 'border-red-500/60 focus:border-red-500'
                      : phoneReady
                        ? 'border-green-500/50 focus:border-green-500/70'
                        : 'border-bc-border focus:border-bc-blue/60'
                  }`}
                />
                {prefixInvalid && (
                  <p className="bengali text-red-400 text-xs mt-1.5">
                    ⚠️ অবৈধ নম্বর — বাংলাদেশের বৈধ নম্বর দিন (017/013/019/014/018/016/015)।
                  </p>
                )}
                {!prefixInvalid && phoneDigits > 0 && phoneDigits < 11 && (
                  <p className="bengali text-slate-500 text-xs mt-1.5">
                    {phoneDigits}/11 ডিজিট
                  </p>
                )}
                {!prefixInvalid && phoneDigits === 11 && (
                  <p className="bengali text-green-400 text-xs mt-1.5">✓ সঠিক নম্বর</p>
                )}
              </div>

              {/* ── Category ── */}
              <div>
                <label className="bengali block text-sm text-slate-400 mb-1.5">কারণ</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="bengali w-full bg-bc-surface border border-bc-border rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-bc-blue/60 transition-colors appearance-none cursor-pointer"
                >
                  <option value="">-- বেছে নিন --</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* ── Message ── */}
              <div>
                <label className="bengali block text-sm text-slate-400 mb-1.5">বার্তা</label>
                <textarea
                  placeholder="আপনার বার্তা লিখুন (ঐচ্ছিক)"
                  rows={4}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className={`bengali w-full bg-bc-surface border rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none transition-colors resize-none ${
                    msgTooLong
                      ? 'border-red-500/60 focus:border-red-500'
                      : 'border-bc-border focus:border-bc-blue/60'
                  }`}
                />
                <div className="flex items-center justify-between mt-1">
                  {msgTooLong ? (
                    <p className="bengali text-red-400 text-xs">
                      ⚠️ বার্তা সর্বোচ্চ ১০০০ অক্ষরের মধ্যে হতে হবে।
                    </p>
                  ) : (
                    <span />
                  )}
                  <p className={`text-xs ml-auto ${msgLen > 950 ? (msgTooLong ? 'text-red-400' : 'text-yellow-400') : 'text-slate-600'}`}>
                    {msgLen}/1000
                  </p>
                </div>
              </div>

              {err && (
                <p className="bengali text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">
                  ⚠️ {err}
                </p>
              )}

              <button
                onClick={handleSubmit}
                disabled={status === 'loading' || nameTooShort || nameTooLong || prefixInvalid || msgTooLong}
                className="w-full bg-gradient-to-r from-bc-blue to-bc-cyan text-white font-semibold py-3.5 rounded-xl transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {status === 'loading' ? '⏳ পাঠানো হচ্ছে...' : '✉️ বার্তা পাঠান'}
              </button>

              <p className="bengali text-slate-600 text-xs text-center">
                আমরা আপনার নম্বরে ফোন করে যোগাযোগ করব।
              </p>
            </div>
          )}
        </div>

        {/* ── INFO PANEL ───────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-bc-card border border-bc-border rounded-2xl p-5 space-y-4">
            <h2 className="font-semibold text-white">📍 যোগাযোগের তথ্য</h2>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-bc-blue/10 border border-bc-blue/20 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-bc-blue" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium">ঠিকানা</p>
                <p className="bengali text-slate-400 text-xs leading-relaxed mt-0.5">{BUSINESS.addressBn}</p>
              </div>
            </div>

            {[
              { phone: BUSINESS.phone1, label: 'প্রাথমিক' },
              { phone: BUSINESS.phone2, label: 'বিকল্প' },
            ].map(p => (
              <a key={p.phone} href={`tel:${p.phone}`} className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-bc-blue/10 border border-bc-blue/20 flex items-center justify-center shrink-0 group-hover:bg-bc-blue/20 transition-colors">
                  <svg className="w-4 h-4 text-bc-blue" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <div>
                  <p className="bengali text-slate-500 text-xs">{p.label}</p>
                  <p className="text-white text-sm font-medium group-hover:text-bc-cyan transition-colors">{p.phone}</p>
                </div>
              </a>
            ))}

            <div className="pt-3 border-t border-bc-border">
              <p className="text-slate-500 text-xs mb-2">Business Hours</p>
              <p className="bengali text-slate-300 text-sm">{BUSINESS.hours.weekdays}</p>
              <p className="bengali text-red-400 text-sm mt-1">🚫 {BUSINESS.hours.friday}</p>
            </div>
          </div>

          <a href={BUSINESS.whatsapp} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 bg-bc-wa/10 hover:bg-bc-wa/20 border border-bc-wa/30 rounded-2xl p-5 transition-all group">
            <div className="w-11 h-11 rounded-xl bg-bc-wa flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">WhatsApp করুন</p>
              <p className="bengali text-slate-400 text-xs">সরাসরি মেসেজ করুন</p>
            </div>
            <svg className="w-4 h-4 text-slate-600 ml-auto group-hover:text-bc-wa transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </a>

          <div className="bg-bc-card border border-bc-border rounded-2xl overflow-hidden">
            <div className="h-48 bg-bc-surface">
              <iframe
                src="https://maps.google.com/maps?q=Tiger+Garden+International+Hotel+KDA+Avenue+Khulna+Bangladesh&output=embed"
                width="100%" height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="p-4">
              <a href={BUSINESS.maps} target="_blank" rel="noopener noreferrer"
                className="text-bc-blue hover:text-bc-cyan text-xs font-medium transition-colors">
                Google Maps এ খুলুন →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const FIELDS = [
  { key: 'fb_followers',      label: 'Facebook Followers', icon: '👥', placeholder: 'যেমন: 36,000+' },
  { key: 'fb_rating',         label: 'Facebook Rating',    icon: '⭐', placeholder: 'যেমন: 4.7/5' },
  { key: 'google_rating',     label: 'Google Rating',      icon: '🔍', placeholder: 'যেমন: 3.6/5' },
  { key: 'yt_subscribers',    label: 'YouTube Subscribers',icon: '▶️', placeholder: 'যেমন: 685+' },
  { key: 'years_in_business', label: 'Years in Business',  icon: '🏆', placeholder: 'যেমন: ৫' },
]

export default function BusinessStatsPage() {
  const [values, setValues]   = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('settings').select('key, value')
      if (data) {
        const map: Record<string, string> = {}
        data.forEach((r: { key: string; value: string }) => { map[r.key] = r.value })
        setValues(map)
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)

    const rows = FIELDS.map(f => ({
      key:   f.key,
      value: values[f.key] ?? '',
    }))

    await supabase.from('settings').upsert(rows, { onConflict: 'key' })

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white font-bold text-xl">Business Stats</h1>
          <p className="bengali text-slate-500 text-sm mt-0.5">
            হোমপেজ ও About পেজে দেখানো তথ্য আপডেট করুন
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 bg-bc-blue hover:bg-bc-blue/80 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
        >
          {saving ? (
            <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> সেভ হচ্ছে...</>
          ) : saved ? '✅ সেভ হয়েছে' : '💾 সেভ করুন'}
        </button>
      </div>

      {/* Fields */}
      {loading ? (
        <div className="space-y-4">
          {FIELDS.map(f => (
            <div key={f.key} className="h-20 bg-bc-card border border-bc-border rounded-xl shimmer" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {FIELDS.map(f => (
            <div key={f.key} className="bg-bc-card border border-bc-border rounded-xl px-5 py-4">
              <label className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </label>
              <input
                type="text"
                value={values[f.key] ?? ''}
                placeholder={f.placeholder}
                onChange={e => setValues(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full bg-bc-surface border border-bc-border focus:border-bc-blue/60 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none transition-colors placeholder-slate-600"
              />
            </div>
          ))}
        </div>
      )}

      {/* Bottom save */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 bg-bc-blue hover:bg-bc-blue/80 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
        >
          {saving ? '⏳ সেভ হচ্ছে...' : saved ? '✅ সেভ হয়েছে' : '💾 সেভ করুন'}
        </button>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleLogin = async () => {
    setError('')
    if (!email || !password) { setError('Email and password required.'); return }
    setLoading(true)
    const { error: authErr } = await supabase.auth.signInWithPassword({ email, password })
    if (authErr) {
      setError(authErr.message)
      setLoading(false)
    } else {
      router.replace('/admin/messages')
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className="min-h-screen bg-bc-bg grid-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-bc-blue to-bc-cyan mb-4 shadow-lg">
            <span className="text-white font-black text-lg">BC</span>
          </div>
          <h1 className="font-outfit font-bold text-xl text-white">Admin Panel</h1>
          <p className="text-slate-500 text-sm mt-1">Bangalee Computers</p>
        </div>

        {/* Card */}
        <div className="bg-bc-card border border-bc-border rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKey}
              placeholder="admin@example.com"
              className="w-full bg-bc-surface border border-bc-border rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-bc-blue/60 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKey}
              placeholder="••••••••"
              className="w-full bg-bc-surface border border-bc-border rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-bc-blue/60 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">
              ⚠️ {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-bc-blue to-bc-cyan text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Signing in...' : '🔑 Sign In'}
          </button>

          <p className="text-slate-600 text-xs text-center">
            Create admin account via Supabase Dashboard → Authentication → Users
          </p>
        </div>
      </div>
    </div>
  )
}

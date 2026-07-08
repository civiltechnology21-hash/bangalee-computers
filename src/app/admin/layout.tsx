'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && pathname !== '/admin/login') {
        router.replace('/admin/login')
      } else {
        setUser(session?.user ?? null)
      }
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && pathname !== '/admin/login') router.replace('/admin/login')
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [pathname, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bc-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-bc-blue border-t-transparent animate-spin" />
      </div>
    )
  }

  if (pathname === '/admin/login') return <>{children}</>

  if (!user) return null

  const navItems = [
    { href: '/admin/messages', label: 'Messages', icon: '💬' },
    { href: '/admin/products', label: 'Products', icon: '💻' },
    { href: '/admin/priority', label: 'Priority',  icon: '🔢' },
    { href: '/admin/business-stats', label: 'Business Stats', icon: '📊' },
  ]

  return (
    <div className="min-h-screen bg-bc-bg flex">
      {/* Sidebar */}
      <aside className="w-56 bg-bc-surface border-r border-bc-border flex flex-col">
        <div className="p-5 border-b border-bc-border">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Bangalee Computers"
              className="w-9 h-9 rounded-lg object-cover"
            />
            <div>
              <div className="text-white text-xs font-bold">Admin Panel</div>
              <div className="text-slate-500 text-[10px]">Bangalee Computers</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-xs transition-colors">
            <span>🏠</span> View Site
          </Link>
          <div className="h-px bg-bc-border my-2" />
          {navItems.map(n => (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors font-medium ${
                pathname === n.href
                  ? 'bg-bc-blue/15 text-bc-blue border border-bc-blue/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}>
              <span>{n.icon}</span> {n.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-bc-border">
          <div className="px-3 py-2 mb-1">
            <p className="text-slate-500 text-[10px] truncate">{user.email}</p>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-400/10 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

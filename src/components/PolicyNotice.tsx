import { NOTICE_BN } from '@/lib/constants'

export default function PolicyNotice() {
  return (
    <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
        <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <div>
        <p className="text-amber-400 font-bold text-sm mb-0.5">গুরুত্বপূর্ণ নোটিশ</p>
        <p className="bengali text-amber-300/80 text-sm leading-relaxed">{NOTICE_BN}</p>
      </div>
    </div>
  )
}

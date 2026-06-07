import { BUSINESS, SERVICES } from '@/lib/constants'

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="max-w-2xl mb-12">
        <div className="inline-flex items-center gap-2 bg-bc-blue/10 border border-bc-blue/25 rounded-full px-3 py-1 text-bc-blue text-xs font-medium mb-4">
          🔧 Professional Services
        </div>
        <h1 className="font-outfit font-bold text-3xl sm:text-4xl text-white mb-3">
          আমাদের সার্ভিস
        </h1>
        <p className="bengali text-slate-400 leading-relaxed">
          আমরা সব ধরনের ল্যাপটপ মেরামত ও আপগ্রেড সার্ভিস প্রদান করি। অভিজ্ঞ টেকনিশিয়ান দ্বারা সঠিক ও দ্রুত সার্ভিস নিশ্চিত।
        </p>
      </div>

      {/* Services grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
        {SERVICES.map((s, i) => (
          <div key={i} className="card-hover bg-bc-card border border-bc-border rounded-2xl p-6 group">
            <div className="w-14 h-14 rounded-2xl bg-bc-blue/10 border border-bc-blue/20 flex items-center justify-center text-3xl mb-4 group-hover:bg-bc-blue/20 transition-colors">
              {s.icon}
            </div>
            <h3 className="font-semibold text-white text-base mb-1">{s.title}</h3>
            <p className="bengali text-xs text-bc-cyan font-medium mb-2">{s.titleBn}</p>
            <p className="bengali text-slate-400 text-sm leading-relaxed mb-4">{s.desc}</p>
            <a
              href={`tel:${BUSINESS.phone1}`}
              className="inline-flex items-center gap-1.5 text-bc-blue hover:text-bc-cyan text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call for Price
            </a>
          </div>
        ))}
      </div>

      {/* Why choose us */}
      <div className="bg-bc-card border border-bc-border rounded-3xl p-8 mb-10">
        <h2 className="font-outfit font-bold text-xl text-white mb-6 text-center">কেন আমাদের বেছে নেবেন?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '⚡', title: 'দ্রুত সার্ভিস',   desc: 'অধিকাংশ সমস্যা একই দিনে সমাধান করা হয়' },
            { icon: '👨‍💻', title: 'অভিজ্ঞ টেকনিশিয়ান', desc: 'বছরের পর বছর অভিজ্ঞতা সম্পন্ন দক্ষ টেকনিশিয়ান' },
            { icon: '💰', title: 'সাশ্রয়ী মূল্য',  desc: 'বাজারের সর্বনিম্ন মূল্যে সর্বোচ্চ মানের সার্ভিস' },
            { icon: '🔒', title: 'ওয়ারেন্টি',      desc: 'সার্ভিস করা পার্টসে ওয়ারেন্টি প্রদান করা হয়' },
          ].map((w, i) => (
            <div key={i} className="text-center p-4">
              <div className="text-3xl mb-3">{w.icon}</div>
              <h3 className="bengali text-white font-semibold text-sm mb-2">{w.title}</h3>
              <p className="bengali text-slate-400 text-xs leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="bengali text-slate-400 mb-4">সার্ভিস সংক্রান্ত যেকোনো প্রশ্নের জন্য আমাদের সাথে যোগাযোগ করুন</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href={BUSINESS.whatsapp} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-bc-wa hover:bg-green-400 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105 text-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp করুন
          </a>
          <a href={`tel:${BUSINESS.phone1}`}
            className="flex items-center gap-2 bg-bc-surface border border-bc-border hover:border-bc-blue/50 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105 text-sm">
            <svg className="w-5 h-5 text-bc-blue" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {BUSINESS.phone1}
          </a>
        </div>
      </div>
    </div>
  )
}

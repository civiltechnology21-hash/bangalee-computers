import Link from 'next/link'
import { Product } from '@/lib/supabase'
import { BUSINESS, CATEGORY_LABELS, WA_PRODUCT_MSG } from '@/lib/constants'

const categoryIcons: Record<string, string> = {
  new:         '💻',
  used:        '🔄',
  accessories: '🎮',
  services:    '🔧',
}

export default function ProductCard({ product }: { product: Product }) {
  const cat = CATEGORY_LABELS[product.category]
  const icon = categoryIcons[product.category] ?? '📦'
  const waLink = `${BUSINESS.whatsapp}?text=${WA_PRODUCT_MSG(product.name)}`

  return (
    <div className="card-hover group relative rounded-2xl overflow-hidden flex flex-col"
      style={{ backgroundColor: '#162626', border: '1px solid #1E2E2D' }}>

      {/* Image area */}
      <div className="relative h-44 flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #122020 0%, #0E1717 100%)' }}>
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-6xl">{icon}</span>
        )}

        {/* Category badge */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${cat?.badge}`}>
          {cat?.en}
        </span>

        {/* Out of stock */}
        {!product.in_stock && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(14,23,23,0.75)' }}>
            <span className="bengali font-bold text-sm px-3 py-1 rounded-full"
              style={{ color: '#ef4444', backgroundColor: 'rgba(14,23,23,0.85)', border: '1px solid rgba(239,68,68,0.30)' }}>
              স্টক নেই
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-base leading-snug mb-1" style={{ color: '#FFBF00' }}>
          {product.name}
        </h3>
        {product.name_bn && (
          <p className="text-xs mb-2 whitespace-pre-wrap leading-relaxed" style={{ color: '#D1D5DB', opacity: 0.75 }}>
            {product.name_bn}
          </p>
        )}
        {product.specs && (
          <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: '#D1D5DB', opacity: 0.65 }}>
            {product.specs}
          </p>
        )}

        {/* Price */}
        {product.price && (
          <div className="mb-3">
            <span className="font-bold text-lg" style={{ color: '#FFBF00' }}>{product.price}</span>
          </div>
        )}

        {/* CTAs */}
        <div className="flex items-center gap-2 mt-auto">
          {/* WhatsApp — unchanged */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-bc-wa hover:bg-green-400 text-white text-sm font-semibold py-2.5 rounded-xl transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp
          </a>

          {/* Call button — golden outline */}
          <a
            href={`tel:${BUSINESS.phone1}`}
            className="px-3 py-2.5 rounded-xl transition-all hover:scale-105"
            title="Call"
            style={{ border: '1.5px solid rgba(255,191,0,0.35)', color: '#FFBF00' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#FFBF00'
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,191,0,0.08)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,191,0,0.35)'
              ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

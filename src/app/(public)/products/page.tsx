import { Suspense } from 'react'
import ProductsClient from './ProductsClient'

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-bc-card border border-bc-border rounded-2xl overflow-hidden">
              <div className="shimmer h-44" />
              <div className="p-4 space-y-3">
                <div className="shimmer h-4 rounded w-3/4" />
                <div className="shimmer h-3 rounded w-full" />
                <div className="shimmer h-9 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    }>
      <ProductsClient />
    </Suspense>
  )
}

'use client'

// ─────────────────────────────────────────────────────────
// Cart storage — 100% client-side (localStorage only)
// No database, no login, no admin visibility.
// ─────────────────────────────────────────────────────────

export const CART_KEY = 'bc_cart'
export const CART_EVENT = 'bc-cart-updated'

/** Returns the list of saved product IDs from localStorage. */
export function getCartIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CART_KEY)
    const items = raw ? JSON.parse(raw) : []
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

/** Persists the given ID list and notifies listeners (e.g. Navbar badge). */
function setCartIds(ids: string[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CART_KEY, JSON.stringify(ids))
  window.dispatchEvent(new Event(CART_EVENT))
}

/** Whether a product ID is currently saved. */
export function isInCart(id: string): boolean {
  return getCartIds().includes(id)
}

/** Adds a product ID if not already present. */
export function addToCart(id: string) {
  const ids = getCartIds()
  if (!ids.includes(id)) {
    ids.push(id)
    setCartIds(ids)
  }
}

/** Removes a product ID if present. */
export function removeFromCart(id: string) {
  const ids = getCartIds().filter(x => x !== id)
  setCartIds(ids)
}

/** Adds if absent, removes if present. Returns the new saved state (true = now in cart). */
export function toggleCart(id: string): boolean {
  const ids = getCartIds()
  const idx = ids.indexOf(id)
  if (idx >= 0) {
    ids.splice(idx, 1)
    setCartIds(ids)
    return false
  } else {
    ids.push(id)
    setCartIds(ids)
    return true
  }
}

/** Clears the entire cart. */
export function clearCart() {
  setCartIds([])
}

/** Number of items currently saved. */
export function getCartCount(): number {
  return getCartIds().length
}

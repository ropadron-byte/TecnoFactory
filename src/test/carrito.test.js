import { describe, expect, it } from 'vitest'
import { addToCart, cartTotalItems, cartTotalPrice, getCart, removeFromCart, updateCartQty } from '../services/carritoService'

describe('carrito', () => {
  it('agrega y acumula cantidades', () => {
    expect(addToCart('TF-NB-001', 1).ok).toBe(true)
    expect(addToCart('TF-NB-001', 2).ok).toBe(true)
    expect(getCart()).toEqual([{ codigo: 'TF-NB-001', qty: 3 }])
    expect(cartTotalItems()).toBe(3)
    expect(cartTotalPrice()).toBe(1899990 * 3)
  })

  it('respeta el stock', () => {
    expect(addToCart('TF-SP-012', 1).ok).toBe(false) // stock 0
    expect(addToCart('TF-SP-016', 8).ok).toBe(false) // stock 7
    expect(addToCart('NO-EXISTE', 1).ok).toBe(false)
  })

  it('actualiza y quita productos', () => {
    addToCart('TF-SP-016', 1)
    updateCartQty('TF-SP-016', 999)
    expect(getCart()[0].qty).toBe(7)
    removeFromCart('TF-SP-016')
    expect(getCart()).toEqual([])
  })
})

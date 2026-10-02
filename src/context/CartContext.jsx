import { createContext, useContext, useEffect, useState } from 'react'
import * as carrito from '../services/carritoService'
import { STORAGE_KEYS } from '../data/constantes'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => carrito.getCart())

  // Si el carrito cambia en otra pestaña, lo sincronizamos.
  useEffect(() => {
    function onStorage(e) {
      if (e.key === STORAGE_KEYS.carrito || e.key === null) setCart(carrito.getCart())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Cada acción modifica localStorage y luego refresca el estado de React.
  function addToCart(codigo, qty) {
    const resultado = carrito.addToCart(codigo, qty)
    setCart(carrito.getCart())
    return resultado
  }
  function removeFromCart(codigo) {
    carrito.removeFromCart(codigo)
    setCart(carrito.getCart())
  }
  function updateCartQty(codigo, qty) {
    carrito.updateCartQty(codigo, qty)
    setCart(carrito.getCart())
  }
  function clearCart() {
    carrito.clearCart()
    setCart([])
  }

  const value = {
    cart,
    totalItems: carrito.cartTotalItems(cart),
    totalPrice: carrito.cartTotalPrice(cart),
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}

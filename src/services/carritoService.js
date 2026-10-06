import { STORAGE_KEYS } from '../data/constantes'
import { obtenerProductoPorCodigo } from './productosService'
import { precioFinal } from '../utils/precios'

// Lógica pura del carrito sobre localStorage. La UI no la usa directo:
// pasa por CartContext, que además mantiene el estado de React al día.

export function getCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.carrito)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('No se pudo leer el carrito:', e)
    return []
  }
}

export function saveCart(cart) {
  localStorage.setItem(STORAGE_KEYS.carrito, JSON.stringify(cart))
}

/** Agrega un producto respetando el stock. Devuelve { ok, message }. */
export function addToCart(codigo, qty) {
  const product = obtenerProductoPorCodigo(codigo)
  if (!product) return { ok: false, message: 'Producto no encontrado.' }
  if (product.stock <= 0) return { ok: false, message: 'Este producto no tiene stock disponible.' }

  const cart = getCart()
  const existing = cart.find((item) => item.codigo === codigo)
  const newQty = (existing ? existing.qty : 0) + qty

  if (newQty > product.stock) {
    return { ok: false, message: `Solo quedan ${product.stock} unidades disponibles.` }
  }

  const nuevo = existing
    ? cart.map((item) => (item.codigo === codigo ? { ...item, qty: newQty } : item))
    : [...cart, { codigo, qty }]

  saveCart(nuevo)
  return { ok: true, message: 'Producto añadido al carrito.' }
}

export function removeFromCart(codigo) {
  saveCart(getCart().filter((item) => item.codigo !== codigo))
}

/** Cambia la cantidad de un producto ya agregado (entre 1 y el stock). */
export function updateCartQty(codigo, qty) {
  const product = obtenerProductoPorCodigo(codigo)
  const cart = getCart()
  if (!product || !cart.some((i) => i.codigo === codigo)) return
  const nueva = Math.max(1, Math.min(qty, product.stock))
  saveCart(cart.map((i) => (i.codigo === codigo ? { ...i, qty: nueva } : i)))
}

export function clearCart() {
  localStorage.removeItem(STORAGE_KEYS.carrito)
}

export function cartTotalItems(cart = getCart()) {
  return cart.reduce((sum, item) => sum + item.qty, 0)
}

export function cartTotalPrice(cart = getCart()) {
  return cart.reduce((sum, item) => {
    const product = obtenerProductoPorCodigo(item.codigo)
    return sum + (product ? precioFinal(product) * item.qty : 0)
  }, 0)
}

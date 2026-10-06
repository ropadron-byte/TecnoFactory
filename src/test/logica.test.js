import { describe, expect, it } from 'vitest'
import { precioFinal, tieneOferta } from '../utils/precios'
import { contrasenaValida, correoValido, validarRun } from '../utils/validaciones'
import { addToCart, cartTotalPrice, getCart } from '../services/carritoService'
import { procesarCompra } from '../services/ordenesService'
import { obtenerProductoPorCodigo } from '../services/productosService'
import { CLIENTE, ENTREGA_RETIRO } from './helpers.jsx'

describe('lógica de negocio', () => {
  it('calcula el precio con oferta solo cuando hay descuento', () => {
    expect(precioFinal({ precio: 10000, descuento: 25 })).toBe(7500)
    expect(tieneOferta({ precio: 10000, descuento: 25 })).toBe(true)
    expect(tieneOferta({ precio: 10000 })).toBe(false)
  })

  it('valida RUN, correo (dominios permitidos) y contraseña (4 a 10 caracteres)', () => {
    expect(validarRun('190110222')).toBe(true)
    expect(validarRun('190110228')).toBe(false)
    expect(correoValido('ana@gmail.com')).toBe(true)
    expect(correoValido('ana@hotmail.com')).toBe(false)
    expect(contrasenaValida('abc')).toBe(false)
    expect(contrasenaValida('abcd')).toBe(true)
  })

  it('el carrito acumula cantidades, respeta el stock y suma con el precio de oferta', () => {
    expect(addToCart('TF-SP-008', 1).ok).toBe(true)
    expect(addToCart('TF-SP-008', 1).ok).toBe(true)
    expect(getCart()).toEqual([{ codigo: 'TF-SP-008', qty: 2 }])
    expect(cartTotalPrice()).toBe(Math.round(142490 * 0.8) * 2) // 20% de descuento
    expect(addToCart('TF-SP-012', 1).ok).toBe(false) // sin stock
    expect(addToCart('TF-SP-016', 99).ok).toBe(false) // más que el stock
  })

  it('la compra pagada descuenta el stock y la rechazada no', () => {
    const compra = (resultadoPago) =>
      procesarCompra({ carrito: [{ codigo: 'TF-NB-004', qty: 2 }], cliente: CLIENTE, entrega: ENTREGA_RETIRO, resultadoPago })

    const rechazada = compra('rechazado')
    expect(rechazada.orden.estado).toBe('Fallida')
    expect(obtenerProductoPorCodigo('TF-NB-004').stock).toBe(40)

    const pagada = compra('exitoso')
    expect(pagada.orden).toMatchObject({ estado: 'Pagada', total: 1044990 * 2 })
    expect(obtenerProductoPorCodigo('TF-NB-004').stock).toBe(38)
  })
})

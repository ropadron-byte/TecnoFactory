import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'
import { procesarCompra } from '../services/ordenesService'

describe('CompraError', () => {
  it('muestra el pago fallido y permite reintentar con los mismos datos', async () => {
    const { orden } = procesarCompra({ carrito: [{ codigo: 'TF-NB-004', qty: 1 }], cliente: CLIENTE, entrega: ENTREGA_RETIRO, resultadoPago: 'rechazado' })
    const router = renderEn(`/compra/error/${orden.id}`)
    expect(await screen.findByText(/No se pudo realizar el pago/)).toBeInTheDocument()
    hacerClick('Volver a realizar el pago')
    expect(await screen.findByRole('heading', { level: 1, name: 'Finalizar compra' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/checkout')
  })
})

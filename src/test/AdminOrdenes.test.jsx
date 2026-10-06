import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'
import { procesarCompra } from '../services/ordenesService'

describe('AdminOrdenes', () => {
  it('lista las órdenes y abre su boleta', async () => {
    conSesion('Administrador', { id: 1 })
    const { orden } = procesarCompra({ carrito: [{ codigo: 'TF-NB-004', qty: 1 }], cliente: CLIENTE, entrega: ENTREGA_RETIRO })
    renderEn('/admin/ordenes')
    fireEvent.click(await screen.findByRole('link', { name: 'Ver boleta' }))
    expect(await screen.findByRole('heading', { level: 1, name: `Boleta #${orden.numero}` })).toBeInTheDocument()
  })
})

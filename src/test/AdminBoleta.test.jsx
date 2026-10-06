import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'
import { procesarCompra } from '../services/ordenesService'

describe('AdminBoleta', () => {
  it('muestra la boleta con el cliente y el total', async () => {
    conSesion('Administrador', { id: 1 })
    const { orden } = procesarCompra({ carrito: [{ codigo: 'TF-NB-004', qty: 1 }], cliente: CLIENTE, entrega: ENTREGA_RETIRO })
    renderEn(`/admin/ordenes/${orden.id}`)
    expect(await screen.findByRole('heading', { level: 1, name: `Boleta #${orden.numero}` })).toBeInTheDocument()
    expect(screen.getByText('Pedro Hacker')).toBeInTheDocument()
    expect(screen.getByText('Total pagado: $1.044.990')).toBeInTheDocument()
  })
})

import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'
import { procesarCompra } from '../services/ordenesService'

describe('CompraExitosa', () => {
  it('muestra el resumen de una compra pagada', async () => {
    const { orden } = procesarCompra({ carrito: [{ codigo: 'TF-NB-004', qty: 1 }], cliente: CLIENTE, entrega: ENTREGA_RETIRO })
    renderEn(`/compra/exitosa/${orden.id}`)
    expect(await screen.findByText(/Se ha realizado la compra/)).toBeInTheDocument()
    expect(screen.getByText('Total pagado: $1.044.990')).toBeInTheDocument()
  })
})

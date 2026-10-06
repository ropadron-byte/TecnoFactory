import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('Ofertas', () => {
  it('muestra solo productos con descuento', async () => {
    renderEn('/ofertas')
    expect(await screen.findByRole('heading', { level: 1, name: 'Productos en oferta' })).toBeInTheDocument()
    expect(screen.getAllByText(/^-\d+%$/).length).toBeGreaterThan(0)
  })
})

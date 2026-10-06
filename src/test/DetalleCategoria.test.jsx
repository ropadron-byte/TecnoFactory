import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('DetalleCategoria', () => {
  it('muestra los productos de la categoría elegida', async () => {
    renderEn('/categorias/notebooks')
    expect(await screen.findByRole('heading', { level: 1, name: 'Notebooks' })).toBeInTheDocument()
    expect(screen.getByText('Lenovo Yoga 920')).toBeInTheDocument()
    expect(screen.queryByText('iPhone 5s')).not.toBeInTheDocument()
  })
})

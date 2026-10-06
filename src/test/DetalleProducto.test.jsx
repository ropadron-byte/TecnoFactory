import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('DetalleProducto', () => {
  it('agrega el producto al carrito y actualiza el contador', async () => {
    renderEn('/productos/TF-NB-004')
    fireEvent.click(await screen.findByRole('button', { name: 'Agregar al carrito' }))
    expect(screen.getByText('Producto añadido al carrito.')).toBeInTheDocument()
    expect(document.querySelector('.cart-count').textContent).toBe('1')
  })
})

import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'
import { addToCart, getCart } from '../services/carritoService'

describe('Carrito', () => {
  it('muestra el carrito con la lista lateral de productos disponibles y permite sumar uno', async () => {
    addToCart('TF-NB-004', 1)
    renderEn('/carrito')
    expect(await screen.findByRole('heading', { level: 1, name: 'Mi carrito de compras' })).toBeInTheDocument()

    const lateral = screen.getByRole('complementary', { name: 'Productos disponibles' })
    expect(within(lateral).queryByText('Lenovo Yoga 920')).toBeNull() // el que ya está en el carrito no se repite
    const botones = within(lateral).getAllByRole('button')
    expect(botones.length).toBeGreaterThan(0)

    fireEvent.click(botones[0])
    expect(getCart()).toHaveLength(2)
  })
})

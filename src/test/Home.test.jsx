import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('Home', () => {
  it('muestra las categorías y los productos más vendidos', async () => {
    renderEn('/')
    expect(await screen.findByRole('heading', { name: 'Productos Más Vendidos' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Categorías' })).toBeInTheDocument()
  })
})

import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('Categorias', () => {
  it('lista los productos separados por categoría', async () => {
    renderEn('/categorias')
    expect(await screen.findByRole('heading', { level: 1, name: 'Compra por categoría' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Notebooks' })).toBeInTheDocument()
  })
})

import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('AdminProductos', () => {
  it('lista los productos y ofrece crear uno nuevo', async () => {
    conSesion('Administrador', { id: 1 })
    renderEn('/admin/productos')
    expect(await screen.findByRole('heading', { level: 1, name: 'Productos' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '+ Nuevo producto' })).toBeInTheDocument()
    expect(screen.getByText('iPhone 5s')).toBeInTheDocument()
  })
})

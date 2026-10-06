import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('AdminDetalleProducto', () => {
  it('muestra el detalle de un producto', async () => {
    conSesion('Administrador', { id: 1 })
    renderEn('/admin/productos/TF-NB-004')
    expect(await screen.findByRole('heading', { level: 1, name: 'Lenovo Yoga 920' })).toBeInTheDocument()
  })
})

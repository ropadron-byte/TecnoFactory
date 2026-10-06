import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('AdminDetalleUsuario', () => {
  it('muestra el detalle de un usuario', async () => {
    conSesion('Administrador', { id: 1 })
    renderEn('/admin/usuarios/1')
    expect(await screen.findByRole('heading', { level: 1, name: 'Admin Tecno Factory' })).toBeInTheDocument()
  })
})

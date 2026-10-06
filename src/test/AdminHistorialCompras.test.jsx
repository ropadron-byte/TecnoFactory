import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('AdminHistorialCompras', () => {
  it('muestra el historial de compras del usuario', async () => {
    conSesion('Administrador', { id: 1 })
    renderEn('/admin/usuarios/1/compras')
    expect(await screen.findByRole('heading', { level: 1, name: 'Compras de Admin Tecno Factory' })).toBeInTheDocument()
  })
})

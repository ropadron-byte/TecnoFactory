import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('AdminUsuarios', () => {
  it('lista los usuarios registrados', async () => {
    conSesion('Administrador', { id: 1 })
    renderEn('/admin/usuarios')
    expect(await screen.findByRole('heading', { level: 1, name: 'Usuarios' })).toBeInTheDocument()
    expect(screen.getAllByText(/admin@duoc.cl/).length).toBeGreaterThan(0)
  })
})

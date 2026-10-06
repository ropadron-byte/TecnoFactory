import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('AdminPerfil', () => {
  it('muestra el perfil de la sesión iniciada', async () => {
    conSesion('Administrador', { id: 1 })
    renderEn('/admin/perfil')
    expect(await screen.findByRole('heading', { level: 1, name: 'Mi perfil' })).toBeInTheDocument()
    expect(screen.getByText('Administrador', { selector: 'strong' })).toBeInTheDocument()
  })
})

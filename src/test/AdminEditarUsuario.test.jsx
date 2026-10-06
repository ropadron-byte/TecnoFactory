import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('AdminEditarUsuario', () => {
  it('carga los datos del usuario en el formulario', async () => {
    conSesion('Administrador', { id: 1 })
    renderEn('/admin/usuarios/1/editar')
    expect(await screen.findByRole('heading', { level: 1, name: 'Editar usuario' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toHaveValue('Admin')
  })
})

import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('AdminNuevoUsuario', () => {
  it('muestra el formulario de nuevo usuario', async () => {
    conSesion('Administrador', { id: 1 })
    renderEn('/admin/usuarios/nuevo')
    expect(await screen.findByRole('heading', { level: 1, name: 'Nuevo usuario' })).toBeInTheDocument()
    hacerClick('Guardar usuario')
    expect(screen.getByText('Revisa los campos marcados en rojo.')).toBeInTheDocument()
  })
})

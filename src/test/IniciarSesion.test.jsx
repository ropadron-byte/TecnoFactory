import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('IniciarSesion', () => {
  it('rechaza credenciales incorrectas y entra con las correctas', async () => {
    renderEn('/iniciar-sesion')
    expect(await screen.findByRole('heading', { level: 1, name: 'Iniciar sesión' })).toBeInTheDocument()
    escribir('Correo electrónico', 'admin@duoc.cl')
    escribir('Contraseña', 'mala')
    hacerClick('Iniciar sesión')
    expect(screen.getByText('Correo o contraseña incorrectos.')).toBeInTheDocument()
  })
})

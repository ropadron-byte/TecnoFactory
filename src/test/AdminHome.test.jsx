import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('AdminHome', () => {
  it('saluda al administrador y muestra las métricas', async () => {
    conSesion('Administrador', { id: 1 })
    renderEn('/admin')
    expect(await screen.findByRole('heading', { level: 1, name: '¡Hola, Ana!' })).toBeInTheDocument()
    expect(screen.getByText('Usuarios', { selector: '.card-subtitle' })).toBeInTheDocument()
  })
})

import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('Nosotros', () => {
  it('muestra la información de la empresa', async () => {
    renderEn('/nosotros')
    expect(await screen.findByRole('heading', { level: 1, name: 'Quiénes somos' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Nuestra misión' })).toBeInTheDocument()
  })
})

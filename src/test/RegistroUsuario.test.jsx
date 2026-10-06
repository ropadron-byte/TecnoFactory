import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('RegistroUsuario', () => {
  it('no deja registrar con datos inválidos', async () => {
    renderEn('/registro')
    expect(await screen.findByRole('heading', { level: 1, name: 'Crea tu cuenta' })).toBeInTheDocument()
    escribir('RUN', '190110228')
    hacerClick('Crear cuenta')
    expect(screen.getByLabelText('RUN')).toHaveClass('is-invalid')
    escribir('RUN', '190110222')
    expect(screen.getByLabelText('RUN')).toHaveClass('is-valid')
  })
})

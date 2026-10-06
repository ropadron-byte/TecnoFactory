import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('NotFound', () => {
  it('muestra el 404 en una ruta inexistente', async () => {
    renderEn('/algo-que-no-existe')
    expect(await screen.findByRole('heading', { level: 1, name: 'Página no encontrada' })).toBeInTheDocument()
  })
})

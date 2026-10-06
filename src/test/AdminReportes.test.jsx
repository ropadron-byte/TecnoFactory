import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('AdminReportes', () => {
  it('muestra los reportes de ventas', async () => {
    conSesion('Administrador', { id: 1 })
    renderEn('/admin/reportes')
    expect(await screen.findByRole('heading', { level: 1, name: 'Reportes' })).toBeInTheDocument()
  })
})

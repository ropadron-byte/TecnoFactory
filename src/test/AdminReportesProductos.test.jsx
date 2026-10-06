import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('AdminReportesProductos', () => {
  it('muestra el reporte de inventario', async () => {
    conSesion('Administrador', { id: 1 })
    renderEn('/admin/productos/reportes')
    expect(await screen.findByRole('heading', { level: 1, name: 'Reporte de productos' })).toBeInTheDocument()
  })
})

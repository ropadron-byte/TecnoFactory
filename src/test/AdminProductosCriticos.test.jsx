import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('AdminProductosCriticos', () => {
  it('muestra solo productos con stock crítico', async () => {
    conSesion('Administrador', { id: 1 })
    renderEn('/admin/productos/criticos')
    expect(await screen.findByRole('heading', { level: 1, name: 'Productos críticos' })).toBeInTheDocument()
    expect(screen.queryByText('Lenovo Yoga 920')).not.toBeInTheDocument()
  })
})

import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('AdminEditarProducto', () => {
  it('carga los datos del producto en el formulario', async () => {
    conSesion('Administrador', { id: 1 })
    renderEn('/admin/productos/TF-NB-004/editar')
    expect(await screen.findByRole('heading', { level: 1, name: 'Editar producto' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toHaveValue('Lenovo Yoga 920')
  })
})

import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'
import { obtenerCategorias } from '../services/categoriasService'

describe('AdminEditarCategoria', () => {
  it('carga los datos de la categoría', async () => {
    conSesion('Administrador', { id: 1 })
    const cat = obtenerCategorias().find((c) => c.nombre === 'Notebooks')
    renderEn(`/admin/categorias/${cat.id}/editar`)
    expect(await screen.findByRole('heading', { level: 1, name: 'Editar categoría' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre')).toHaveValue('Notebooks')
  })
})

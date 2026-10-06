import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'
import { obtenerCategorias } from '../services/categoriasService'

describe('AdminNuevaCategoria', () => {
  it('crea una categoría', async () => {
    conSesion('Administrador', { id: 1 })
    renderEn('/admin/categorias/nueva')
    expect(await screen.findByRole('heading', { level: 1, name: 'Nueva categoría' })).toBeInTheDocument()
    escribir('Nombre', 'Gamer')
    hacerClick('Guardar categoría')
    expect(screen.getByText('Categoría guardada correctamente.')).toBeInTheDocument()
    expect(obtenerCategorias().some((c) => c.nombre === 'Gamer')).toBe(true)
  })
})

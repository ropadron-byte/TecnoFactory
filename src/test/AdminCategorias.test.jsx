import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('AdminCategorias', () => {
  it('no deja eliminar una categoría con productos', async () => {
    conSesion('Administrador', { id: 1 })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderEn('/admin/categorias')
    expect(await screen.findByRole('heading', { level: 1, name: 'Categorías' })).toBeInTheDocument()
    fireEvent.click(within(screen.getByText('Notebooks').closest('tr')).getByRole('button', { name: 'Eliminar' }))
    expect(screen.getByText(/No se puede eliminar "Notebooks"/)).toBeInTheDocument()
  })
})

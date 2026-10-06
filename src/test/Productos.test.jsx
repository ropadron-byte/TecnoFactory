import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('Productos', () => {
  it('muestra el catálogo y filtra por categoría', async () => {
    renderEn('/productos')
    expect(await screen.findByRole('heading', { level: 1, name: 'Todos nuestros productos' })).toBeInTheDocument()
    expect(screen.getByText('iPhone 5s')).toBeInTheDocument()
    hacerClick('Notebooks')
    expect(screen.queryByText('iPhone 5s')).not.toBeInTheDocument()
    expect(screen.getByText('Lenovo Yoga 920')).toBeInTheDocument()
  })
})

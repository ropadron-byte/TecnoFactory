import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('DetalleBlog', () => {
  it('muestra un artículo del blog', async () => {
    renderEn('/blogs/5-datos-curiosos-ssd')
    expect(await screen.findByRole('heading', { level: 1, name: '5 datos curiosos sobre el SSD' })).toBeInTheDocument()
  })
})

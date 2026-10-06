import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('Blogs', () => {
  it('lista los artículos disponibles', async () => {
    renderEn('/blogs')
    expect(await screen.findByRole('heading', { level: 1, name: 'Novedades y curiosidades tecno' })).toBeInTheDocument()
    expect(screen.getByText('5 datos curiosos sobre el SSD')).toBeInTheDocument()
  })
})

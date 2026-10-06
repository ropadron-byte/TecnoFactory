import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'

describe('Contacto', () => {
  it('valida el formulario y confirma el envío', async () => {
    renderEn('/contacto')
    expect(await screen.findByRole('heading', { level: 1, name: 'Escríbenos' })).toBeInTheDocument()
    escribir('Correo electrónico', 'pedro@hotmail.com')
    expect(screen.getByLabelText('Correo electrónico')).toHaveClass('is-invalid')
    escribir('Correo electrónico', 'pedro@gmail.com')
    hacerClick('Enviar mensaje')
    expect(screen.getByText('Revisa los campos marcados en rojo antes de enviar el formulario.')).toBeInTheDocument()
    escribir('Nombre *', 'Pedro')
    escribir('Comentario *', 'Quiero cotizar 10 notebooks')
    hacerClick('Enviar mensaje')
    expect(screen.getByText('¡Gracias, Pedro! Tu mensaje fue enviado correctamente.')).toBeInTheDocument()
  })
})

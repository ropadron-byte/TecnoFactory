import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'
import { addToCart, getCart } from '../services/carritoService'
import { obtenerOrdenes } from '../services/ordenesService'
import { obtenerProductoPorCodigo } from '../services/productosService'
import { guardarUsuario, iniciarSesion } from '../services/usuariosService'

describe('Checkout', () => {
  it('con sesión iniciada autocompleta los datos y registra la compra a nombre del usuario', async () => {
    guardarUsuario({ run: '190110222', nombre: 'Luisa', apellidos: 'Soto', correo: 'luisa@gmail.com', contrasena: 'abcd', tipo: 'Cliente', region: 'Región Metropolitana', comuna: 'Santiago', direccion: 'Los Olmos 45' })
    const usuario = iniciarSesion('luisa@gmail.com', 'abcd')
    addToCart('TF-NB-004', 2)
    renderEn('/checkout')
    expect(await screen.findByRole('heading', { level: 1, name: 'Finalizar compra' })).toBeInTheDocument()

    // Los datos de la cuenta aparecen solos, sin escribir nada
    expect(screen.getByLabelText('Nombre *')).toHaveValue('Luisa')
    expect(screen.getByLabelText('Apellidos *')).toHaveValue('Soto')
    expect(screen.getByLabelText('Correo *')).toHaveValue('luisa@gmail.com')
    expect(screen.getByLabelText('Calle *')).toHaveValue('Los Olmos 45')

    hacerClick(/Pagar ahora/)
    expect(await screen.findByText(/Se ha realizado la compra/)).toBeInTheDocument()
    expect(obtenerOrdenes()[0]).toMatchObject({ estado: 'Pagada', usuarioId: usuario.id, cliente: { nombre: 'Luisa', correo: 'luisa@gmail.com' } })
    expect(getCart()).toEqual([])
    expect(obtenerProductoPorCodigo('TF-NB-004').stock).toBe(38)
  })
})

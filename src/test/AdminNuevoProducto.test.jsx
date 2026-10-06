import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'
import { obtenerProductos } from '../services/productosService'

describe('AdminNuevoProducto', () => {
  it('valida y guarda un producto con descuento', async () => {
    conSesion('Administrador', { id: 1 })
    renderEn('/admin/productos/nuevo')
    expect(await screen.findByRole('heading', { level: 1, name: 'Nuevo producto' })).toBeInTheDocument()
    escribir('Código producto', 'TF-TEST-1')
    escribir('Nombre', 'Mouse de prueba')
    escribir('Precio', '10000')
    escribir('Stock', '5')
    escribir('Categoría', 'Audio')
    escribir('Descuento (%)', '150')
    hacerClick('Guardar producto')
    expect(screen.getByText('Revisa los campos marcados en rojo.')).toBeInTheDocument()
    escribir('Descuento (%)', '20')
    hacerClick('Guardar producto')
    expect(screen.getByText('Producto guardado correctamente.')).toBeInTheDocument()
    expect(obtenerProductos().find((p) => p.codigo === 'TF-TEST-1')).toMatchObject({ precio: 10000, stock: 5, descuento: 20 })
  })
})

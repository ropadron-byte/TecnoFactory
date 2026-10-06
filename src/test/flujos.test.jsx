import { describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, screen, within } from '@testing-library/react'
import { CLIENTE, ENTREGA_RETIRO, conSesion, escribir, hacerClick, renderEn } from './helpers.jsx'
import { addToCart, getCart } from '../services/carritoService'
import { obtenerOrdenes, procesarCompra } from '../services/ordenesService'
import { obtenerProductoPorCodigo, obtenerProductos } from '../services/productosService'
import { obtenerCategorias } from '../services/categoriasService'

const titulo = (texto) => screen.findByRole('heading', { level: 1, name: texto })

describe('tienda (cliente)', () => {
  it('el catálogo filtra por categoría y por texto de búsqueda', async () => {
    renderEn('/productos')
    await titulo('Todos nuestros productos')
    expect(screen.getByText('iPhone 5s')).toBeInTheDocument()

    hacerClick('Notebooks')
    expect(screen.queryByText('iPhone 5s')).not.toBeInTheDocument()
    expect(screen.getByText('Lenovo Yoga 920')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Buscar productos'), { target: { value: 'zzzz' } })
    expect(screen.getByText('No encontramos productos con esos filtros.')).toBeInTheDocument()
  })

  it('estado y eventos: el formulario de contacto valida al escribir y se envía', async () => {
    renderEn('/contacto')
    await titulo('Escríbenos')

    escribir('Correo electrónico', 'pedro@hotmail.com')
    expect(screen.getByLabelText('Correo electrónico')).toHaveClass('is-invalid')
    escribir('Correo electrónico', 'pedro@gmail.com')
    expect(screen.getByLabelText('Correo electrónico')).toHaveClass('is-valid')

    hacerClick('Enviar mensaje') // faltan los campos obligatorios
    expect(screen.getByText('Revisa los campos marcados en rojo antes de enviar el formulario.')).toBeInTheDocument()

    escribir('Nombre *', 'Pedro')
    escribir('Comentario *', 'Quiero cotizar 10 notebooks')
    hacerClick('Enviar mensaje')
    expect(screen.getByText('¡Gracias, Pedro! Tu mensaje fue enviado correctamente.')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre *')).toHaveValue('')
  })

  const llenarCliente = () => {
    escribir('Nombre *', 'Pedro')
    escribir('Apellidos *', 'Hacker')
    escribir('Correo *', 'pedro@gmail.com')
    escribir('Calle *', 'Los Crisantemos 123')
    escribir('Región', 'Región Metropolitana')
    escribir('Comuna', 'Santiago')
  }

  it('checkout con pago exitoso: crea la orden, descuenta stock y vacía el carrito', async () => {
    addToCart('TF-NB-004', 2)
    const router = renderEn('/checkout')
    await titulo('Finalizar compra')
    llenarCliente()
    hacerClick(/Pagar ahora/)

    expect(await screen.findByText(/Se ha realizado la compra/)).toBeInTheDocument()
    expect(router.state.location.pathname).toMatch(/^\/compra\/exitosa\/\d+$/)
    expect(screen.getByText('Total pagado: $2.089.980')).toBeInTheDocument()
    expect(getCart()).toEqual([])
    expect(obtenerProductoPorCodigo('TF-NB-004').stock).toBe(38)
    expect(obtenerOrdenes()[0].estado).toBe('Pagada')
  })

  it('checkout con pago rechazado: conserva el carrito y permite reintentar con los datos escritos', async () => {
    addToCart('TF-NB-004', 1)
    const router = renderEn('/checkout')
    await titulo('Finalizar compra')
    llenarCliente()
    escribir('Simulación del pago (solo demostración)', 'rechazado')
    hacerClick(/Pagar ahora/)

    expect(await screen.findByText(/No se pudo realizar el pago/)).toBeInTheDocument()
    expect(getCart()).toHaveLength(1)
    expect(obtenerProductoPorCodigo('TF-NB-004').stock).toBe(40)

    hacerClick('Volver a realizar el pago')
    await titulo('Finalizar compra')
    expect(router.state.location.pathname).toBe('/checkout')
    expect(screen.getByLabelText('Nombre *')).toHaveValue('Pedro')
  })
})

describe('control de acceso por rol', () => {
  it('sin sesión (o como Cliente) el panel redirige al login', async () => {
    const router = renderEn('/admin/productos')
    await titulo('Iniciar sesión')
    expect(router.state.location.pathname).toBe('/iniciar-sesion')
  })

  it('el Vendedor ve las órdenes pero no la gestión de usuarios', async () => {
    conSesion('Vendedor')
    const router = renderEn('/admin/usuarios')
    await titulo('Productos') // lo devuelve al listado de productos
    expect(router.state.location.pathname).toBe('/admin/productos')

    const menu = within(screen.getByRole('navigation'))
    expect(menu.getByRole('link', { name: /Órdenes/ })).toBeInTheDocument()
    expect(menu.queryByRole('link', { name: /Usuarios/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '+ Nuevo producto' })).not.toBeInTheDocument()
  })
})

describe('panel de administración', () => {
  it('el Administrador crea un producto con descuento y aparece en el catálogo', async () => {
    conSesion('Administrador', { id: 1 })
    renderEn('/admin/productos/nuevo')
    await titulo('Nuevo producto')

    escribir('Código producto', 'TF-TEST-1')
    escribir('Nombre', 'Mouse de prueba')
    escribir('Precio', '10000')
    escribir('Stock', '5')
    escribir('Categoría', 'Audio')
    escribir('Descuento (%)', '150') // fuera de rango
    hacerClick('Guardar producto')
    expect(screen.getByText('Revisa los campos marcados en rojo.')).toBeInTheDocument()

    escribir('Descuento (%)', '20')
    hacerClick('Guardar producto')
    expect(screen.getByText('Producto guardado correctamente.')).toBeInTheDocument()
    expect(obtenerProductos().find((p) => p.codigo === 'TF-TEST-1')).toMatchObject({ precio: 10000, stock: 5, descuento: 20 })
  })

  it('las categorías se crean y no se pueden eliminar si tienen productos', async () => {
    conSesion('Administrador', { id: 1 })
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderEn('/admin/categorias/nueva')
    await titulo('Nueva categoría')
    escribir('Nombre', 'Gamer')
    hacerClick('Guardar categoría')
    expect(screen.getByText('Categoría guardada correctamente.')).toBeInTheDocument()
    expect(obtenerCategorias().some((c) => c.nombre === 'Gamer')).toBe(true)
    cleanup() // se desmonta la página anterior antes de abrir el listado

    renderEn('/admin/categorias')
    await titulo('Categorías')
    fireEvent.click(within(screen.getByText('Notebooks').closest('tr')).getByRole('button', { name: 'Eliminar' }))
    expect(screen.getByText(/No se puede eliminar "Notebooks"/)).toBeInTheDocument()
    fireEvent.click(within(screen.getByText('Gamer').closest('tr')).getByRole('button', { name: 'Eliminar' }))
    expect(screen.getByText('Categoría eliminada.')).toBeInTheDocument()
  })

  it('el Administrador abre la boleta de una orden desde el listado', async () => {
    conSesion('Administrador', { id: 1 })
    const { orden } = procesarCompra({ carrito: [{ codigo: 'TF-NB-004', qty: 1 }], cliente: CLIENTE, entrega: ENTREGA_RETIRO })
    renderEn('/admin/ordenes')
    fireEvent.click(await screen.findByRole('link', { name: 'Ver boleta' }))

    expect(await titulo(`Boleta #${orden.numero}`)).toBeInTheDocument()
    expect(screen.getByText('Pedro Hacker')).toBeInTheDocument()
    expect(screen.getByText('Total pagado: $1.044.990')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Enviar boleta por email' })).toHaveAttribute('href', expect.stringContaining('mailto:pedro@gmail.com'))
  })
})

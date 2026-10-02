import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { routes } from '../router.jsx'
import { AuthProvider } from '../context/AuthContext.jsx'
import { CartProvider } from '../context/CartContext.jsx'

function renderEn(ruta) {
  const router = createMemoryRouter(routes, { initialEntries: [ruta] })
  return render(
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>,
  )
}

describe('navegación del cliente (react-router-dom)', () => {
  it('muestra el catálogo y filtra por categoría', async () => {
    renderEn('/productos')
    expect(await screen.findByText('Todos nuestros productos')).toBeInTheDocument()
    expect(screen.getByText('iPhone 5s')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Notebooks' }))
    expect(screen.queryByText('iPhone 5s')).not.toBeInTheDocument()
    expect(screen.getByText('Lenovo Yoga 920')).toBeInTheDocument()
  })

  it('navega del catálogo a la ficha con un clic', async () => {
    renderEn('/productos')
    fireEvent.click((await screen.findAllByText('Lenovo Yoga 920'))[0])
    expect(await screen.findByRole('button', { name: 'Agregar al carrito' })).toBeInTheDocument()
  })

  it('agrega un producto al carrito y actualiza el contador', async () => {
    renderEn('/productos/TF-NB-004')
    fireEvent.click(await screen.findByRole('button', { name: 'Agregar al carrito' }))
    expect(screen.getByText('Producto añadido al carrito.')).toBeInTheDocument()
    expect(document.querySelector('.cart-count').textContent).toBe('1')
  })

  it('rechaza credenciales incorrectas en el login', async () => {
    renderEn('/iniciar-sesion')
    fireEvent.change(await screen.findByLabelText('Correo electrónico'), { target: { value: 'admin@duoc.cl' } })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'wrong' } })
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }))
    expect(screen.getByText('Correo o contraseña incorrectos.')).toBeInTheDocument()
  })

  it('muestra 404 en rutas inexistentes', async () => {
    renderEn('/algo-que-no-existe')
    expect(await screen.findByText('Página no encontrada', { selector: 'h1' })).toBeInTheDocument()
  })

  it('muestra 404 si el producto o el artículo no existen (loaders)', async () => {
    renderEn('/productos/NO-EXISTE')
    expect(await screen.findByText('Página no encontrada', { selector: 'h1' })).toBeInTheDocument()
  })

  it('muestra un artículo del blog', async () => {
    renderEn('/blogs/5-datos-curiosos-ssd')
    expect(await screen.findByText('5 datos curiosos sobre los SSD que quizás no conocías')).toBeInTheDocument()
  })
})

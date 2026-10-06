import { render, screen, fireEvent } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { routes } from '../router.jsx'
import { AuthProvider } from '../context/AuthContext.jsx'
import { CartProvider } from '../context/CartContext.jsx'

// Utilidades compartidas por los tests de páginas.

/** Deja una sesión iniciada (como si el usuario ya hubiera hecho login). */
export function conSesion(tipo, extra = {}) {
  localStorage.setItem(
    'tf_sesion',
    JSON.stringify({ id: 999, nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@duoc.cl', tipo, ...extra }),
  )
}

/** Renderiza la app completa en una ruta y devuelve el router (para ver la URL). */
export function renderEn(ruta) {
  const router = createMemoryRouter(routes, { initialEntries: [ruta] })
  render(
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>,
  )
  return router
}

/** Escribe un valor en el campo que tiene esa etiqueta. */
export const escribir = (label, valor) => fireEvent.change(screen.getByLabelText(label), { target: { value: valor } })

export const hacerClick = (nombre) => fireEvent.click(screen.getByRole('button', { name: nombre }))

export const CLIENTE = { nombre: 'Pedro', apellidos: 'Hacker', correo: 'pedro@gmail.com' }
export const ENTREGA_RETIRO = { tipo: 'retiro', calle: '', departamento: '', region: '', comuna: '', indicaciones: '' }

import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { routes } from '../router.jsx'
import { AuthProvider } from '../context/AuthContext.jsx'
import { CartProvider } from '../context/CartContext.jsx'
import { obtenerUsuarios } from '../services/usuariosService'
import { obtenerProductoPorCodigo, obtenerProductos } from '../services/productosService'

function conSesion(tipo, extra = {}) {
  localStorage.setItem(
    'tf_sesion',
    JSON.stringify({ id: 999, nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@duoc.cl', tipo, ...extra }),
  )
}

function renderEn(ruta) {
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

const escribir = (label, valor) => fireEvent.change(screen.getByLabelText(label), { target: { value: valor } })

describe('control de acceso por rol (RequireRole)', () => {
  it('sin sesión redirige al login', async () => {
    const router = renderEn('/admin/productos')
    expect(await screen.findByText('Iniciar sesión', { selector: 'h1' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/iniciar-sesion')
  })

  it('un Cliente no puede entrar al panel', async () => {
    conSesion('Cliente')
    const router = renderEn('/admin')
    await screen.findByText('Iniciar sesión', { selector: 'h1' })
    expect(router.state.location.pathname).toBe('/iniciar-sesion')
  })

  it('el Vendedor ve productos pero no usuarios (se le devuelve a productos)', async () => {
    conSesion('Vendedor')
    const router = renderEn('/admin/usuarios')
    expect(await screen.findByText('Productos', { selector: 'h1' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/admin/productos')
    expect(screen.queryByRole('link', { name: /Usuarios/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: '+ Nuevo producto' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Eliminar' })).not.toBeInTheDocument()
  })

  it('el Vendedor tampoco puede editar ni crear productos por URL', async () => {
    conSesion('Vendedor')
    const router = renderEn('/admin/productos/TF-NB-004/editar')
    await screen.findByText('Productos', { selector: 'h1' })
    expect(router.state.location.pathname).toBe('/admin/productos')
  })

  it('el Administrador ve el menú completo y el saludo', async () => {
    conSesion('Administrador')
    renderEn('/admin')
    expect(await screen.findByText('¡Hola, Ana!')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Usuarios/ })).toBeInTheDocument()
  })

  it('muestra 404 dentro del panel para registros inexistentes', async () => {
    conSesion('Administrador')
    renderEn('/admin/usuarios/123456')
    expect(await screen.findByText('No encontrado', { selector: 'h1' })).toBeInTheDocument()
  })
})

describe('productos en el panel', () => {
  it('crea un producto nuevo y valida el código duplicado', async () => {
    conSesion('Administrador')
    renderEn('/admin/productos/nuevo')
    await screen.findByText('Nuevo producto', { selector: 'h1' })

    // código ya existente
    escribir('Código producto', 'TF-NB-004')
    escribir('Nombre', 'Otro')
    escribir('Precio', '1000')
    escribir('Stock', '5')
    escribir('Categoría', 'Notebooks')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }))
    expect(screen.getByText('Ya existe un producto con ese código.', { selector: '.form-status' })).toBeInTheDocument()

    // código nuevo + dos imágenes (una repetida y una vacía se descartan)
    escribir('Código producto', 'TF-TEST-1')
    escribir('Nombre', '  Mouse de prueba ')
    fireEvent.change(document.getElementById('imagen-0'), { target: { value: 'https://x.test/a.jpg' } })
    fireEvent.click(screen.getByRole('button', { name: '+ Añadir otra imagen' }))
    fireEvent.change(document.getElementById('imagen-1'), { target: { value: 'https://x.test/a.jpg' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }))

    expect(screen.getByText('Producto guardado correctamente.')).toBeInTheDocument()
    const guardado = obtenerProductoPorCodigo('TF-TEST-1')
    expect(guardado).toMatchObject({ nombre: 'Mouse de prueba', precio: 1000, stock: 5, stockCritico: 0, categoria: 'Notebooks' })
    expect(guardado.urls).toEqual(['https://x.test/a.jpg'])
  })

  it('rechaza un stock inválido', async () => {
    conSesion('Administrador')
    renderEn('/admin/productos/nuevo')
    await screen.findByText('Nuevo producto', { selector: 'h1' })
    escribir('Código producto', 'TF-TEST-2')
    escribir('Nombre', 'X')
    escribir('Precio', '10')
    escribir('Stock', '2.5')
    escribir('Categoría', 'Audio')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }))
    expect(screen.getByText('Revisa los campos marcados en rojo.')).toBeInTheDocument()
    expect(obtenerProductoPorCodigo('TF-TEST-2')).toBeUndefined()
  })

  it('edita un producto sin cambiar su código', async () => {
    conSesion('Administrador')
    renderEn('/admin/productos/TF-NB-004/editar')
    await screen.findByText('Editar producto', { selector: 'h1' })
    expect(screen.getByLabelText('Código producto')).toHaveAttribute('readonly')
    escribir('Nombre', 'Nombre editado')
    escribir('Stock', '3')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.getByText('Producto actualizado correctamente.')).toBeInTheDocument()
    expect(obtenerProductoPorCodigo('TF-NB-004')).toMatchObject({ nombre: 'Nombre editado', stock: 3 })
  })

  it('elimina un producto desde el listado', async () => {
    conSesion('Administrador')
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderEn('/admin/productos')
    await screen.findByText('Productos', { selector: 'h1' })
    const antes = obtenerProductos().length
    const fila = screen.getByText('TF-NB-004').closest('tr')
    fireEvent.click(within(fila).getByRole('button', { name: 'Eliminar' }))
    expect(obtenerProductos()).toHaveLength(antes - 1)
    expect(screen.queryByText('TF-NB-004')).not.toBeInTheDocument()
  })
})

describe('usuarios en el panel', () => {
  const rellenar = () => {
    escribir('RUN', '190110222')
    escribir('Nombre', 'Luis')
    escribir('Apellidos', 'Soto')
    escribir('Correo', 'luis@gmail.com')
    escribir('Contraseña', 'abcd')
    escribir('Tipo de usuario', 'Vendedor')
    escribir('Región', 'Región Metropolitana')
    escribir('Comuna', 'Santiago')
    escribir('Dirección', 'Calle 123')
  }

  it('crea un usuario con selects dependientes de región y comuna', async () => {
    conSesion('Administrador')
    renderEn('/admin/usuarios/nuevo')
    await screen.findByText('Nuevo usuario', { selector: 'h1' })
    expect(screen.getByLabelText('Comuna')).toBeDisabled()
    rellenar()
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }))
    expect(screen.getByText('Usuario guardado correctamente.')).toBeInTheDocument()
    expect(obtenerUsuarios().find((u) => u.correo === 'luis@gmail.com')).toMatchObject({ tipo: 'Vendedor', comuna: 'Santiago' })
  })

  it('valida RUN, dominio de correo y correo repetido', async () => {
    conSesion('Administrador')
    renderEn('/admin/usuarios/nuevo')
    await screen.findByText('Nuevo usuario', { selector: 'h1' })
    rellenar()
    escribir('RUN', '190110228') // dígito verificador incorrecto
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }))
    expect(screen.getByText('Revisa los campos marcados en rojo.')).toBeInTheDocument()

    escribir('RUN', '190110222')
    escribir('Correo', 'admin@duoc.cl') // ya existe
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }))
    expect(screen.getByText('Ya existe un usuario registrado con ese correo.', { selector: '.form-status' })).toBeInTheDocument()
  })

  it('al editar, la contraseña vacía conserva la actual', async () => {
    conSesion('Administrador')
    renderEn('/admin/usuarios/1/editar')
    await screen.findByText('Editar usuario', { selector: 'h1' })
    expect(screen.getByLabelText('Comuna')).toHaveValue('Santiago') // precargada
    escribir('Nombre', 'Administrador Jefe')
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.getByText('Usuario actualizado correctamente.')).toBeInTheDocument()
    expect(obtenerUsuarios().find((u) => u.id === 1)).toMatchObject({ nombre: 'Administrador Jefe', contrasena: 'admin123' })
  })

  it('no permite eliminar al único administrador ni la propia cuenta', async () => {
    conSesion('Administrador', { id: 1 })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderEn('/admin/usuarios')
    await screen.findByText('Usuarios', { selector: 'h1' })
    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(screen.getByText(/No puedes eliminar tu propia cuenta/)).toBeInTheDocument()
    expect(obtenerUsuarios()).toHaveLength(1)
  })
})

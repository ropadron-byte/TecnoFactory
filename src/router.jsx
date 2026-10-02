import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Cargando from './components/Cargando.jsx'
import RouteError from './components/RouteError.jsx'
import AdminRouteError from './components/AdminRouteError.jsx'
import RequireRole from './components/RequireRole.jsx'
import NotFound from './pages/NotFound.jsx'
import { obtenerProductoPorCodigo } from './services/productosService'
import { obtenerUsuarioPorId } from './services/usuariosService'
import { BLOGS } from './data/blogs'
import { ROLES } from './data/constantes'

// Carga diferida: cada página se descarga solo cuando se visita.
const pagina = (importador) => async () => ({ Component: (await importador()).default })

// Loaders: si el registro no existe, lanzan un 404 que captura el
// errorElement correspondiente (así las páginas no tienen que validarlo).
const noEncontrado = (mensaje) => new Response(mensaje, { status: 404 })

function loaderProducto({ params }) {
  const producto = obtenerProductoPorCodigo(params.codigo)
  if (!producto) throw noEncontrado('Producto no encontrado')
  return producto
}

function loaderBlog({ params }) {
  const blog = BLOGS.find((b) => b.slug === params.slug && b.disponible)
  if (!blog) throw noEncontrado('Artículo no encontrado')
  return blog
}

function loaderUsuario({ params }) {
  const usuario = obtenerUsuarioPorId(Number(params.id))
  if (!usuario) throw noEncontrado('Usuario no encontrado')
  return usuario
}

// ---------- Tienda (cliente) ----------
const rutasTienda = {
  path: '/',
  HydrateFallback: Cargando,
  element: <Layout />,
  children: [
    {
      errorElement: <RouteError />,
      children: [
        { index: true, lazy: pagina(() => import('./pages/Home.jsx')) },
        { path: 'productos', lazy: pagina(() => import('./pages/Productos.jsx')) },
        {
          path: 'productos/:codigo',
          loader: loaderProducto,
          lazy: pagina(() => import('./pages/DetalleProducto.jsx')),
        },
        { path: 'carrito', lazy: pagina(() => import('./pages/Carrito.jsx')) },
        { path: 'nosotros', lazy: pagina(() => import('./pages/Nosotros.jsx')) },
        { path: 'blogs', lazy: pagina(() => import('./pages/Blogs.jsx')) },
        {
          path: 'blogs/:slug',
          loader: loaderBlog,
          lazy: pagina(() => import('./pages/DetalleBlog.jsx')),
        },
        { path: 'contacto', lazy: pagina(() => import('./pages/Contacto.jsx')) },
        { path: 'iniciar-sesion', lazy: pagina(() => import('./pages/IniciarSesion.jsx')) },
        { path: 'registro', lazy: pagina(() => import('./pages/RegistroUsuario.jsx')) },
        { path: '*', Component: NotFound },
      ],
    },
  ],
}

// ---------- Panel de administración ----------
// Administrador y Vendedor entran al panel. Dentro, el Vendedor solo ve
// Inicio y Productos (solo lectura): lo demás exige ser Administrador y,
// si el Vendedor intenta entrar, se le devuelve al listado de productos.
const rutasAdmin = {
  path: '/admin',
  HydrateFallback: Cargando,
  element: <RequireRole roles={[ROLES.admin, ROLES.vendedor]} />,
  children: [
    {
      lazy: pagina(() => import('./components/AdminLayout.jsx')),
      children: [
        {
          errorElement: <AdminRouteError />,
          children: [
            { index: true, lazy: pagina(() => import('./pages/admin/AdminHome.jsx')) },

            // Accesibles para Administrador y Vendedor
            { path: 'productos', lazy: pagina(() => import('./pages/admin/AdminProductos.jsx')) },
            {
              path: 'productos/:codigo',
              loader: loaderProducto,
              lazy: pagina(() => import('./pages/admin/AdminDetalleProducto.jsx')),
            },

            // Solo Administrador
            {
              element: <RequireRole roles={[ROLES.admin]} redirectTo="/admin/productos" />,
              children: [
                { path: 'productos/nuevo', lazy: pagina(() => import('./pages/admin/AdminNuevoProducto.jsx')) },
                {
                  path: 'productos/:codigo/editar',
                  loader: loaderProducto,
                  lazy: pagina(() => import('./pages/admin/AdminEditarProducto.jsx')),
                },
                { path: 'usuarios', lazy: pagina(() => import('./pages/admin/AdminUsuarios.jsx')) },
                { path: 'usuarios/nuevo', lazy: pagina(() => import('./pages/admin/AdminNuevoUsuario.jsx')) },
                {
                  path: 'usuarios/:id',
                  loader: loaderUsuario,
                  lazy: pagina(() => import('./pages/admin/AdminDetalleUsuario.jsx')),
                },
                {
                  path: 'usuarios/:id/editar',
                  loader: loaderUsuario,
                  lazy: pagina(() => import('./pages/admin/AdminEditarUsuario.jsx')),
                },
              ],
            },

            { path: '*', loader: () => { throw noEncontrado('Página no encontrada') } },
          ],
        },
      ],
    },
  ],
}

export const routes = [rutasTienda, rutasAdmin]

// basename = base de Vite sin la barra final ("/" -> "", "/TecnoFactory/" -> "/TecnoFactory")
export const createRouter = () =>
  createBrowserRouter(routes, { basename: import.meta.env.BASE_URL.replace(/\/$/, '') })

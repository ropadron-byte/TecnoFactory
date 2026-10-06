import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Cargando from './components/Cargando.jsx'
import RouteError from './components/RouteError.jsx'
import AdminRouteError from './components/AdminRouteError.jsx'
import RequireRole from './components/RequireRole.jsx'
import NotFound from './pages/NotFound.jsx'
import { obtenerProductoPorCodigo } from './services/productosService'
import { obtenerUsuarioPorId } from './services/usuariosService'
import { obtenerCategoriaPorId, obtenerCategoriaPorSlug } from './services/categoriasService'
import { obtenerOrdenPorId } from './services/ordenesService'
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

function loaderCategoriaSlug({ params }) {
  const categoria = obtenerCategoriaPorSlug(params.slug)
  if (!categoria) throw noEncontrado('Categoría no encontrada')
  return categoria
}

function loaderCategoriaId({ params }) {
  const categoria = obtenerCategoriaPorId(Number(params.id))
  if (!categoria) throw noEncontrado('Categoría no encontrada')
  return categoria
}

// La pantalla de compra exitosa / con error solo existe si la orden existe
// y tiene el estado correspondiente (no se puede "ver" un pago ajeno al resultado).
const loaderOrden = (estado) => ({ params }) => {
  const orden = obtenerOrdenPorId(Number(params.id))
  if (!orden || orden.estado !== estado) throw noEncontrado('Orden no encontrada')
  return orden
}

function loaderOrdenAdmin({ params }) {
  const orden = obtenerOrdenPorId(Number(params.id))
  if (!orden) throw noEncontrado('Orden no encontrada')
  return orden
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
        { path: 'categorias', lazy: pagina(() => import('./pages/Categorias.jsx')) },
        {
          path: 'categorias/:slug',
          loader: loaderCategoriaSlug,
          lazy: pagina(() => import('./pages/DetalleCategoria.jsx')),
        },
        { path: 'ofertas', lazy: pagina(() => import('./pages/Ofertas.jsx')) },
        { path: 'carrito', lazy: pagina(() => import('./pages/Carrito.jsx')) },
        { path: 'checkout', lazy: pagina(() => import('./pages/Checkout.jsx')) },
        {
          path: 'compra/exitosa/:id',
          loader: loaderOrden('Pagada'),
          lazy: pagina(() => import('./pages/CompraExitosa.jsx')),
        },
        {
          path: 'compra/error/:id',
          loader: loaderOrden('Fallida'),
          lazy: pagina(() => import('./pages/CompraError.jsx')),
        },
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
// Administrador y Vendedor entran al panel. El Vendedor ve Inicio, Órdenes,
// Productos (solo lectura, incluye críticos) y su Perfil. Todo lo demás
// (crear/editar productos, categorías, usuarios y reportes) exige ser
// Administrador; si el Vendedor lo intenta, vuelve al listado de productos.
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
            { path: 'ordenes', lazy: pagina(() => import('./pages/admin/AdminOrdenes.jsx')) },
            {
              path: 'ordenes/:id',
              loader: loaderOrdenAdmin,
              lazy: pagina(() => import('./pages/admin/AdminBoleta.jsx')),
            },
            { path: 'perfil', lazy: pagina(() => import('./pages/admin/AdminPerfil.jsx')) },
            { path: 'productos', lazy: pagina(() => import('./pages/admin/AdminProductos.jsx')) },
            { path: 'productos/criticos', lazy: pagina(() => import('./pages/admin/AdminProductosCriticos.jsx')) },
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
                { path: 'productos/reportes', lazy: pagina(() => import('./pages/admin/AdminReportesProductos.jsx')) },
                { path: 'categorias', lazy: pagina(() => import('./pages/admin/AdminCategorias.jsx')) },
                { path: 'categorias/nueva', lazy: pagina(() => import('./pages/admin/AdminNuevaCategoria.jsx')) },
                {
                  path: 'categorias/:id/editar',
                  loader: loaderCategoriaId,
                  lazy: pagina(() => import('./pages/admin/AdminEditarCategoria.jsx')),
                },
                { path: 'reportes', lazy: pagina(() => import('./pages/admin/AdminReportes.jsx')) },
                { path: 'usuarios', lazy: pagina(() => import('./pages/admin/AdminUsuarios.jsx')) },
                { path: 'usuarios/nuevo', lazy: pagina(() => import('./pages/admin/AdminNuevoUsuario.jsx')) },
                {
                  path: 'usuarios/:id',
                  loader: loaderUsuario,
                  lazy: pagina(() => import('./pages/admin/AdminDetalleUsuario.jsx')),
                },
                {
                  path: 'usuarios/:id/compras',
                  loader: loaderUsuario,
                  lazy: pagina(() => import('./pages/admin/AdminHistorialCompras.jsx')),
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

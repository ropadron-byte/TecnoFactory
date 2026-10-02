import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import RouteError from './components/RouteError.jsx'
import NotFound from './pages/NotFound.jsx'
import { obtenerProductoPorCodigo } from './services/productosService'
import { BLOGS } from './data/blogs'

// Carga diferida: cada página se descarga solo cuando se visita.
const pagina = (importador) => async () => ({ Component: (await importador()).default })

// Loaders: si el producto / artículo no existe, lanzan un 404 que
// captura el errorElement (así las páginas no tienen que validarlo).
function loaderProducto({ params }) {
  const producto = obtenerProductoPorCodigo(params.codigo)
  if (!producto) throw new Response('Producto no encontrado', { status: 404 })
  return producto
}

function loaderBlog({ params }) {
  const blog = BLOGS.find((b) => b.slug === params.slug && b.disponible)
  if (!blog) throw new Response('Artículo no encontrado', { status: 404 })
  return blog
}

export const routes = [
  {
    path: '/',
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
  },
]

// basename = base de Vite sin la barra final ("/" -> "", "/TecnoFactory/" -> "/TecnoFactory")
export const createRouter = () =>
  createBrowserRouter(routes, { basename: import.meta.env.BASE_URL.replace(/\/$/, '') })

import { Link, useLoaderData } from 'react-router-dom'
import PageHead from '../components/PageHead.jsx'
import ArticuloTiendaOnline from './blog/ArticuloTiendaOnline.jsx'
import ArticuloSsd from './blog/ArticuloSsd.jsx'
import usePageTitle from '../hooks/usePageTitle'

// Relaciona cada entrada del listado (data/blogs.js) con su contenido.
const ARTICULOS = {
  'abrimos-nuestra-tienda-online': ArticuloTiendaOnline,
  '5-datos-curiosos-ssd': ArticuloSsd,
}

export default function DetalleBlog() {
  const blog = useLoaderData() // validado por el loader de la ruta
  const Articulo = ARTICULOS[blog.slug]
  usePageTitle(blog.titulo)

  return (
    <>
      <PageHead
        eyebrow={
          <>
            <Link to="/blogs">← Volver a blogs</Link> · {blog.fecha} · {blog.categoria}
          </>
        }
        titulo={blog.titulo}
      />

      <article className="container py-4" style={{ maxWidth: 800 }}>
        <img src={blog.imagen} alt={blog.alt} className="img-fluid rounded mb-4 w-100" />
        <Articulo />
        <hr className="my-4" />
        <p>
          <Link className="btn btn-outline-primary btn-sm" to="/blogs">
            ← Volver al listado de blogs
          </Link>
        </p>
      </article>
    </>
  )
}

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

      <article className="section wrap blog-body">
        <img src={blog.imagen} alt={blog.alt} className="blog-hero-img" />
        <Articulo />
        <hr className="divider" />
        <p>
          <Link className="btn ghost small" to="/blogs">
            ← Volver al listado de blogs
          </Link>
        </p>
      </article>
    </>
  )
}

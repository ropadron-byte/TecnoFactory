import { Link, useLoaderData } from 'react-router-dom'
import PageHead from '../components/PageHead.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import { obtenerProductos } from '../services/productosService'
import { obtenerCategorias } from '../services/categoriasService'
import { slugify } from '../utils/texto'
import usePageTitle from '../hooks/usePageTitle'

// Una categoría en particular (el loader de la ruta ya validó que existe).
export default function DetalleCategoria() {
  const categoria = useLoaderData()
  usePageTitle(categoria.nombre)

  const productos = obtenerProductos().filter((p) => p.categoria === categoria.nombre)
  const otras = obtenerCategorias().filter((c) => c.id !== categoria.id)

  return (
    <>
      <PageHead eyebrow={<Link to="/categorias">← Todas las categorías</Link>} titulo={categoria.nombre}>
        {categoria.descripcion}
      </PageHead>

      <section className="container py-4">
        <ProductGrid productos={productos} vacio="Todavía no hay productos en esta categoría." />
      </section>

      {otras.length > 0 && (
        <section className="container py-4">
          <h2 className="h5">Otras categorías</h2>
          <div className="d-flex flex-wrap gap-2">
            {otras.map((c) => (
              <Link key={c.id} className="btn btn-outline-primary btn-sm rounded-pill" to={`/categorias/${slugify(c.nombre)}`}>
                {c.nombre}
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

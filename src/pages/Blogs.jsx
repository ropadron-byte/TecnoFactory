import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead.jsx'
import { BLOGS } from '../data/blogs'
import usePageTitle from '../hooks/usePageTitle'

export default function Blogs() {
  usePageTitle('Blogs')
  return (
    <>
      <PageHead eyebrow="TF / BLOG" titulo="Novedades y curiosidades tecno">
        Aquí podrás encontrar noticias de la tienda, lanzamientos y datos curiosos sobre tecnología, seleccionados
        por el equipo de Tecno Factory.
      </PageHead>

      <section className="section wrap">
        <div className="grid grid-3">
          {BLOGS.map((b) => (
            <article className="card" key={b.slug}>
              <div className="media media--card">
                <img src={b.imagen} alt={b.alt} />
                <span className="media-tag">{b.etiqueta}</span>
              </div>
              <div className="card-body">
                <span className="card-meta">{b.meta}</span>
                <h3>{b.titulo}</h3>
                <p>{b.resumen}</p>
                {b.disponible ? (
                  <Link className="btn ghost small" to={`/blogs/${b.slug}`}>
                    Leer más
                  </Link>
                ) : (
                  <span className="btn ghost small" style={{ opacity: 0.5, pointerEvents: 'none' }}>
                    Próximamente
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

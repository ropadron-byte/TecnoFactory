import { useState } from 'react'
import PageHead from '../components/PageHead.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { CATEGORIAS } from '../data/constantes'
import { obtenerProductos } from '../services/productosService'
import usePageTitle from '../hooks/usePageTitle'

// La categoría Smartphones existe en el catálogo, pero los filtros
// originales solo mostraban estas cinco (mismo comportamiento que antes).
const FILTROS = CATEGORIAS.filter((c) => c !== 'Smartphones')

export default function Productos() {
  usePageTitle('Productos')
  const [categoria, setCategoria] = useState('todos')
  const [productos] = useState(obtenerProductos)

  const visibles = productos.filter((p) => categoria === 'todos' || p.categoria === categoria)

  return (
    <>
      <PageHead eyebrow="TF / CATÁLOGO" titulo="Todos nuestros productos">
        Notebooks, audio, accesorios, monitores y almacenamiento: todo lo que necesitas, en un solo catálogo.
      </PageHead>

      <section className="section wrap">
        <div className="category-filters">
          {['todos', ...FILTROS].map((c) => (
            <button
              key={c}
              type="button"
              className={'filter-btn' + (categoria === c ? ' active' : '')}
              onClick={() => setCategoria(c)}
            >
              {c === 'todos' ? 'Todos' : c}
            </button>
          ))}
        </div>

        {visibles.length === 0 ? (
          <p className="text-center" style={{ color: 'var(--ink-soft)', paddingBlock: 40 }}>
            No encontramos productos para esta categoría.
          </p>
        ) : (
          <div className="grid grid-3">
            {visibles.map((p) => (
              <ProductCard key={p.codigo} producto={p} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

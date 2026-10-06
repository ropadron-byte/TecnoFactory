import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader.jsx'
import ProductImage from '../../components/ProductImage.jsx'
import { contarProductosDeCategoria, eliminarCategoria, obtenerCategorias } from '../../services/categoriasService'
import usePageTitle from '../../hooks/usePageTitle'
import EstadoForm from '../../components/EstadoForm.jsx'

export default function AdminCategorias() {
  usePageTitle('Categorías', 'Panel Tecno Factory')
  const [categorias, setCategorias] = useState(obtenerCategorias)
  const [aviso, setAviso] = useState(null)

  function eliminar(c) {
    if (!window.confirm(`¿Eliminar la categoría "${c.nombre}"? Esta acción no se puede deshacer.`)) return
    const resultado = eliminarCategoria(c.id)
    setAviso({ tipo: resultado.ok ? 'success' : 'error', texto: resultado.message })
    setCategorias(obtenerCategorias())
  }

  return (
    <>
      <AdminHeader titulo="Categorías" />

      <section>
        <p>
          <Link className="btn btn-warning btn-sm" to="/admin/categorias/nueva">
            + Nueva categoría
          </Link>
        </p>

        <EstadoForm estado={aviso} className="mb-3" />

        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white">
            <thead className="table-light">
              <tr>
                <th></th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Productos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length === 0 ? (
                <tr>
                  <td colSpan={5}>Aún no hay categorías.</td>
                </tr>
              ) : (
                categorias.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="ratio ratio-1x1 bg-body-secondary rounded overflow-hidden" style={{ width: 44 }}>
                        <ProductImage url={c.imagen} alt={c.nombre} categoria={c.nombre} />
                      </div>
                    </td>
                    <td>{c.nombre}</td>
                    <td>{c.descripcion || '—'}</td>
                    <td>{contarProductosDeCategoria(c.nombre)}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <Link className="btn btn-outline-primary btn-sm" to={`/admin/categorias/${c.id}/editar`}>
                          Editar
                        </Link>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => eliminar(c)}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

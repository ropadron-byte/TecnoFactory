import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { ROLES } from '../../data/constantes'
import { esStockCritico, obtenerProductos } from '../../services/productosService'
import usePageTitle from '../../hooks/usePageTitle'

// Productos cuyo stock llegó al nivel crítico (o se agotó), del más urgente al menos.
export default function AdminProductosCriticos() {
  usePageTitle('Productos críticos', 'Panel Tecno Factory')
  const { sesion } = useAuth()
  const [criticos] = useState(() => obtenerProductos().filter(esStockCritico).sort((a, b) => a.stock - b.stock))

  return (
    <>
      <AdminHeader titulo="Productos críticos" />

      <section>
        <p className="text-body-secondary">
          Productos con stock igual o menor a su nivel crítico. Conviene reponerlos pronto.
        </p>

        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white">
            <thead className="table-light">
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Stock crítico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {criticos.length === 0 ? (
                <tr>
                  <td colSpan={6}>No hay productos con stock crítico. ¡Todo en orden!</td>
                </tr>
              ) : (
                criticos.map((p) => (
                  <tr key={p.codigo}>
                    <td>{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td>{p.categoria}</td>
                    <td>
                      <span className="badge text-bg-danger">{p.stock <= 0 ? 'Sin stock' : p.stock}</span>
                    </td>
                    <td>{p.stockCritico || 0}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <Link className="btn btn-outline-primary btn-sm" to={`/admin/productos/${encodeURIComponent(p.codigo)}`}>
                          Ver
                        </Link>
                        {sesion.tipo === ROLES.admin && (
                          <Link className="btn btn-outline-primary btn-sm" to={`/admin/productos/${encodeURIComponent(p.codigo)}/editar`}>
                            Editar
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p>
          <Link className="btn btn-outline-primary btn-sm" to="/admin/productos">
            ← Volver a productos
          </Link>
        </p>
      </section>
    </>
  )
}

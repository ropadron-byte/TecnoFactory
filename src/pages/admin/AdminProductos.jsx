import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader.jsx'
import ProductImage from '../../components/ProductImage.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { ROLES } from '../../data/constantes'
import { formatCLP } from '../../utils/formato'
import { eliminarProducto, imagenesProducto, obtenerProductos } from '../../services/productosService'
import usePageTitle from '../../hooks/usePageTitle'

function StockBadge({ producto }) {
  if (producto.stock <= 0) return <span className="badge critico">Sin stock</span>
  if (producto.stock <= producto.stockCritico) return <span className="badge critico">{producto.stock} (crítico)</span>
  return <span className="badge ok">{producto.stock}</span>
}

export default function AdminProductos() {
  usePageTitle('Productos', 'Panel Tecno Factory')
  const { sesion } = useAuth()
  const esAdmin = sesion.tipo === ROLES.admin
  const [productos, setProductos] = useState(obtenerProductos)

  function eliminar(p) {
    if (!window.confirm(`¿Eliminar el producto "${p.nombre}"? Esta acción no se puede deshacer.`)) return
    eliminarProducto(p.codigo)
    setProductos(obtenerProductos())
  }

  return (
    <>
      <AdminHeader titulo="Productos" />

      <section>
        {/* Solo el Administrador puede crear, editar o eliminar productos */}
        {esAdmin && (
          <p>
            <Link className="btn accent small" to="/admin/productos/nuevo">
              + Nuevo producto
            </Link>
          </p>
        )}

        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan={7}>Aún no hay productos cargados.</td>
                </tr>
              ) : (
                productos.map((p) => (
                  <tr key={p.codigo}>
                    <td>
                      <div className="table-thumb">
                        <ProductImage url={imagenesProducto(p)[0]} alt={p.nombre} categoria={p.categoria} />
                      </div>
                    </td>
                    <td>{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td>{p.categoria}</td>
                    <td>{formatCLP(p.precio)}</td>
                    <td>
                      <StockBadge producto={p} />
                    </td>
                    <td className="admin-actions">
                      <Link className="btn ghost small" to={`/admin/productos/${encodeURIComponent(p.codigo)}`}>
                        Ver
                      </Link>
                      {esAdmin && (
                        <>
                          <Link className="btn ghost small" to={`/admin/productos/${encodeURIComponent(p.codigo)}/editar`}>
                            Editar
                          </Link>
                          <button type="button" className="btn ghost small danger" onClick={() => eliminar(p)}>
                            Eliminar
                          </button>
                        </>
                      )}
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

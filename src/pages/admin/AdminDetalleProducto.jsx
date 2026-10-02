import { Link, useLoaderData } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader.jsx'
import ProductImage from '../../components/ProductImage.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { ROLES } from '../../data/constantes'
import { formatCLP } from '../../utils/formato'
import { imagenesProducto } from '../../services/productosService'
import usePageTitle from '../../hooks/usePageTitle'

export default function AdminDetalleProducto() {
  const producto = useLoaderData()
  usePageTitle('Detalle producto', 'Panel Tecno Factory')
  const { sesion } = useAuth()
  const imagenes = imagenesProducto(producto)

  const datos = [
    ['Código', producto.codigo],
    ['Nombre', producto.nombre],
    ['Descripción', producto.descripcion || 'Sin descripción'],
    ['Categoría', producto.categoria],
    ['Precio', formatCLP(producto.precio)],
    ['Stock', `${producto.stock} unidades`],
    ['Stock crítico', producto.stockCritico ? `${producto.stockCritico} unidades` : 'No definido'],
  ]

  return (
    <>
      <AdminHeader titulo={producto.nombre} />

      <section>
        <div className="admin-panel">
          <div className="media" style={{ width: 120, height: 120, marginBottom: 12 }}>
            <ProductImage url={imagenes[0]} alt={producto.nombre} categoria={producto.categoria} />
          </div>

          {imagenes.length > 1 && (
            <div className="product-thumbs" style={{ marginTop: 0, marginBottom: 18 }}>
              {imagenes.map((url) => (
                <div className="product-thumb" key={url}>
                  <img src={url} alt="" />
                </div>
              ))}
            </div>
          )}

          <div className="spec-list">
            {datos.map(([label, valor]) => (
              <div className="spec-row" key={label}>
                <span>{label}</span>
                <span>{valor}</span>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 24 }}>
            {sesion.tipo === ROLES.admin && (
              <Link className="btn accent small" to={`/admin/productos/${encodeURIComponent(producto.codigo)}/editar`}>
                Editar
              </Link>
            )}{' '}
            <Link className="btn ghost small" to="/admin/productos">
              ← Volver al listado
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}

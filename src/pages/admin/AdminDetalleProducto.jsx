import { Link, useLoaderData } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader.jsx'
import ProductImage from '../../components/ProductImage.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { ROLES } from '../../data/constantes'
import { formatCLP } from '../../utils/formato'
import { descuentoDe, precioFinal, tieneOferta } from '../../utils/precios'
import { imagenesProducto } from '../../services/productosService'
import usePageTitle from '../../hooks/usePageTitle'
import ListaDatos from '../../components/ListaDatos.jsx'

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
    ...(tieneOferta(producto)
      ? [
          ['Descuento', `${descuentoDe(producto)}%`],
          ['Precio con oferta', formatCLP(precioFinal(producto))],
        ]
      : []),
    ['Stock', `${producto.stock} unidades`],
    ['Stock crítico', producto.stockCritico ? `${producto.stockCritico} unidades` : 'No definido'],
  ]

  return (
    <>
      <AdminHeader titulo={producto.nombre} />

      <section>
        <div className="card card-body mb-3">
          <div className="ratio ratio-1x1 bg-body-secondary rounded overflow-hidden mb-3" style={{ width: 120 }}>
            <ProductImage url={imagenes[0]} alt={producto.nombre} categoria={producto.categoria} />
          </div>

          {imagenes.length > 1 && (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {imagenes.map((url) => (
                <div key={url} className="border rounded" style={{ width: 56, height: 56 }}>
                  <img src={url} alt="" className="w-100 h-100 object-fit-cover rounded" />
                </div>
              ))}
            </div>
          )}

          <ListaDatos filas={datos} />

          <p style={{ marginTop: 24 }}>
            {sesion.tipo === ROLES.admin && (
              <Link className="btn btn-warning btn-sm" to={`/admin/productos/${encodeURIComponent(producto.codigo)}/editar`}>
                Editar
              </Link>
            )}{' '}
            <Link className="btn btn-outline-primary btn-sm" to="/admin/productos">
              ← Volver al listado
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}

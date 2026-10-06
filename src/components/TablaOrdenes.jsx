import { Link } from 'react-router-dom'
import { formatCLP } from '../utils/formato'

/** Tabla de órdenes (listado general e historial de un usuario). */
export default function TablaOrdenes({ ordenes, vacio }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle bg-white">
        <thead className="table-light">
          <tr>
            <th>N° boleta</th>
            <th>Código</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenes.length === 0 ? (
            <tr>
              <td colSpan={7}>{vacio}</td>
            </tr>
          ) : (
            ordenes.map((o) => (
              <tr key={o.id}>
                <td>#{o.numero}</td>
                <td>{o.codigo}</td>
                <td>{new Date(o.fecha).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td>
                  {o.cliente.nombre} {o.cliente.apellidos}
                </td>
                <td>{formatCLP(o.total)}</td>
                <td>
                  <span className={'badge ' + (o.estado === 'Pagada' ? 'text-bg-success' : 'text-bg-danger')}>{o.estado}</span>
                </td>
                <td>
                  <div className="d-flex flex-wrap gap-2">
                    <Link className="btn btn-outline-primary btn-sm" to={`/admin/ordenes/${o.id}`}>
                      Ver boleta
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

import { Link, useLoaderData } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader.jsx'
import OrdenResumen from '../../components/OrdenResumen.jsx'
import BoletaAcciones from '../../components/BoletaAcciones.jsx'
import usePageTitle from '../../hooks/usePageTitle'

// "Mostrar boleta": detalle completo de una orden.
export default function AdminBoleta() {
  const orden = useLoaderData()
  usePageTitle(`Boleta #${orden.numero}`, 'Panel Tecno Factory')

  return (
    <>
      <AdminHeader titulo={`Boleta #${orden.numero}`} />

      <section>
        <div className="card card-body mb-3">
          <p className="d-flex flex-wrap gap-3 align-items-center text-body-secondary">
            <span>Código orden: {orden.codigo}</span>
            <span>{new Date(orden.fecha).toLocaleString('es-CL')}</span>
            <span className={'badge ' + (orden.estado === 'Pagada' ? 'text-bg-success' : 'text-bg-danger')}>{orden.estado}</span>
          </p>
          <OrdenResumen orden={orden} />
          <BoletaAcciones orden={orden} />
        </div>
        <p className="no-print">
          <Link className="btn btn-outline-primary btn-sm" to="/admin/ordenes">
            ← Volver a órdenes
          </Link>
        </p>
      </section>
    </>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader.jsx'
import TablaOrdenes from '../../components/TablaOrdenes.jsx'
import { obtenerOrdenes } from '../../services/ordenesService'
import usePageTitle from '../../hooks/usePageTitle'

const FILTROS = ['Todas', 'Pagada', 'Fallida']

// Listado de órdenes / boletas, de la más nueva a la más antigua.
export default function AdminOrdenes() {
  usePageTitle('Órdenes', 'Panel Tecno Factory')
  const [ordenes] = useState(() => [...obtenerOrdenes()].reverse())
  const [filtro, setFiltro] = useState('Todas')

  const visibles = ordenes.filter((o) => filtro === 'Todas' || o.estado === filtro)

  return (
    <>
      <AdminHeader titulo="Órdenes / Boletas" />

      <section>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {FILTROS.map((f) => (
            <button key={f} type="button" className={'btn btn-sm rounded-pill ' + (filtro === f ? 'btn-primary' : 'btn-outline-primary')} onClick={() => setFiltro(f)}>
              {f === 'Todas' ? 'Todas' : f === 'Pagada' ? 'Pagadas' : 'Con error de pago'}
            </button>
          ))}
        </div>

        <TablaOrdenes
          ordenes={visibles}
          vacio={
            <>
              Aún no hay órdenes{filtro !== 'Todas' ? ' con ese estado' : ''}. Las compras que hagan los clientes en la{' '}
              <Link to="/">tienda</Link> aparecerán aquí.
            </>
          }
        />
      </section>
    </>
  )
}

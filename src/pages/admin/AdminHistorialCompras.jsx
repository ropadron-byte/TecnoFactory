import { Link, useLoaderData } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader.jsx'
import TablaOrdenes from '../../components/TablaOrdenes.jsx'
import { formatCLP } from '../../utils/formato'
import { ordenesPagadas } from '../../utils/reportes'
import { ordenesDeUsuario } from '../../services/ordenesService'
import usePageTitle from '../../hooks/usePageTitle'

// Historial de compras de un usuario (se busca por su sesión o por su correo).
export default function AdminHistorialCompras() {
  const usuario = useLoaderData()
  usePageTitle('Historial de compras', 'Panel Tecno Factory')

  const ordenes = ordenesDeUsuario(usuario).reverse()
  const totalGastado = ordenesPagadas(ordenes).reduce((s, o) => s + o.total, 0)

  return (
    <>
      <AdminHeader titulo={`Compras de ${usuario.nombre} ${usuario.apellidos}`} />

      <section>
        <p className="text-body-secondary">
          {ordenes.length} orden(es) · Total pagado: <strong>{formatCLP(totalGastado)}</strong>
        </p>
        <TablaOrdenes ordenes={ordenes} vacio="Este usuario todavía no ha realizado compras." />
        <p>
          <Link className="btn btn-outline-primary btn-sm" to={`/admin/usuarios/${usuario.id}`}>
            ← Volver al usuario
          </Link>
        </p>
      </section>
    </>
  )
}

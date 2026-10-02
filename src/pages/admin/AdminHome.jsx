import AdminHeader from '../../components/AdminHeader.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import usePageTitle from '../../hooks/usePageTitle'

export default function AdminHome() {
  usePageTitle('Panel de administración')
  const { sesion } = useAuth()

  return (
    <>
      <AdminHeader titulo={sesion ? `¡Hola, ${sesion.nombre}!` : '¡Hola!'}>
        <span className="admin-bell" aria-hidden="true">
          🔔
        </span>
      </AdminHeader>

      <section>
        <div className="admin-panel">
          <p>Resumen general de la tienda.</p>
        </div>
        <div className="admin-panel">
          <p>Actividad reciente.</p>
        </div>
      </section>
    </>
  )
}

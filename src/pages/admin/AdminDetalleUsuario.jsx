import { Link, useLoaderData } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader.jsx'
import usePageTitle from '../../hooks/usePageTitle'

export default function AdminDetalleUsuario() {
  const usuario = useLoaderData()
  usePageTitle('Detalle usuario', 'Panel Tecno Factory')

  const datos = [
    ['RUN', usuario.run],
    ['Nombre', usuario.nombre],
    ['Apellidos', usuario.apellidos],
    ['Correo', usuario.correo],
    ['Fecha de nacimiento', usuario.fecha_nacimiento || 'No especificada'],
    ['Tipo de usuario', usuario.tipo],
    ['Región', usuario.region],
    ['Comuna', usuario.comuna],
    ['Dirección', usuario.direccion],
  ]

  return (
    <>
      <AdminHeader titulo={`${usuario.nombre} ${usuario.apellidos}`} />

      <section>
        <div className="admin-panel">
          <div className="spec-list">
            {datos.map(([label, valor]) => (
              <div className="spec-row" key={label}>
                <span>{label}</span>
                <span>{valor}</span>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 24 }}>
            <Link className="btn accent small" to={`/admin/usuarios/${usuario.id}/editar`}>
              Editar
            </Link>{' '}
            <Link className="btn ghost small" to="/admin/usuarios">
              ← Volver al listado
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}

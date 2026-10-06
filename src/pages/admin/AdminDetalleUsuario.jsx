import { Link, useLoaderData } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader.jsx'
import usePageTitle from '../../hooks/usePageTitle'
import ListaDatos from '../../components/ListaDatos.jsx'

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
        <div className="card card-body mb-3">
          <ListaDatos filas={datos} />

          <p style={{ marginTop: 24 }}>
            <Link className="btn btn-warning btn-sm" to={`/admin/usuarios/${usuario.id}/editar`}>
              Editar
            </Link>{' '}
            <Link className="btn btn-outline-primary btn-sm" to={`/admin/usuarios/${usuario.id}/compras`}>
              Historial de compras
            </Link>{' '}
            <Link className="btn btn-outline-primary btn-sm" to="/admin/usuarios">
              ← Volver al listado
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}

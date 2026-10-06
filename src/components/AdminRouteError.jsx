import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'
import AdminHeader from './AdminHeader.jsx'

// Error dentro del panel (p. ej. producto o usuario inexistente).
export default function AdminRouteError() {
  const error = useRouteError()
  const noEncontrado = isRouteErrorResponse(error) && error.status === 404
  if (!noEncontrado) console.error(error)

  return (
    <>
      <AdminHeader titulo={noEncontrado ? 'No encontrado' : 'Algo salió mal'} />
      <section>
        <p>{noEncontrado ? 'El registro que buscas no existe.' : 'Ocurrió un error inesperado.'}</p>
        <p>
          <Link className="btn btn-outline-primary" to="/admin">
            Volver al inicio del panel
          </Link>
        </p>
      </section>
    </>
  )
}

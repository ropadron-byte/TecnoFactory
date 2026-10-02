import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import NotFound from '../pages/NotFound.jsx'
import PageHead from './PageHead.jsx'

// Se muestra cuando falla una ruta: 404 (loader) o un error inesperado.
export default function RouteError() {
  const error = useRouteError()

  if (isRouteErrorResponse(error) && error.status === 404) return <NotFound />

  console.error(error)
  return (
    <>
      <PageHead eyebrow="TF / ERROR" titulo="Algo salió mal" />
      <section className="section wrap">
        <p>Ocurrió un error inesperado. Intenta recargar la página.</p>
      </section>
    </>
  )
}

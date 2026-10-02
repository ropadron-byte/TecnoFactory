import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead.jsx'
import usePageTitle from '../hooks/usePageTitle'

export default function NotFound() {
  usePageTitle('Página no encontrada')
  return (
    <>
      <PageHead eyebrow="TF / 404" titulo="Página no encontrada" />
      <section className="section wrap">
        <p>
          La página que buscas no existe. <Link to="/">Volver al inicio</Link>.
        </p>
      </section>
    </>
  )
}

import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import PageHead from '../components/PageHead.jsx'
import OrdenResumen from '../components/OrdenResumen.jsx'
import usePageTitle from '../hooks/usePageTitle'

// Pantalla "no se pudo realizar el pago". El carrito sigue intacto, así que
// se puede reintentar: los datos del intento se devuelven al checkout.
export default function CompraError() {
  const orden = useLoaderData()
  usePageTitle('Error en el pago')
  const navigate = useNavigate()

  function reintentar() {
    const { cliente, entrega } = orden
    navigate('/checkout', {
      state: { datos: { ...cliente, ...entrega, entrega: entrega.tipo } },
    })
  }

  return (
    <>
      <PageHead eyebrow="Detalle de la compra" titulo={`❌ No se pudo realizar el pago. nro #${orden.numero}`}>
        No se realizó ningún cobro y tus productos siguen en el carrito.
      </PageHead>

      <section className="container py-4">
        <div className="card card-body mb-3">
          <p className="text-center mb-4">
            <button type="button" className="btn btn-warning" onClick={reintentar}>
              Volver a realizar el pago
            </button>
          </p>
          <OrdenResumen orden={orden} />
        </div>
        <p>
          <Link className="btn btn-outline-primary" to="/carrito">
            Volver al carrito
          </Link>
        </p>
      </section>
    </>
  )
}

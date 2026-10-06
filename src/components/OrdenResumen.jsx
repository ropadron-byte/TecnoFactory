import { formatCLP } from '../utils/formato'
import ListaDatos from './ListaDatos.jsx'
import ResumenCarrito from './ResumenCarrito.jsx'

// Datos de una orden de solo lectura: cliente, entrega, productos y total.
// Se usa en la compra exitosa, en el pago con error y en la boleta del admin.
export default function OrdenResumen({ orden }) {
  const { cliente, entrega } = orden
  const retiro = entrega.tipo === 'retiro'

  return (
    <div>
      <h2 className="h5">Información del cliente</h2>
      <ListaDatos
        filas={[
          ['Nombre', `${cliente.nombre} ${cliente.apellidos}`],
          ['Correo', cliente.correo],
        ]}
      />

      <h2 className="h5 mt-4">Entrega</h2>
      <ListaDatos
        filas={
          retiro
            ? [['Opción', 'Retiro en tienda'], ['Indicaciones', entrega.indicaciones]]
            : [
                ['Opción', 'Despacho a domicilio'],
                ['Calle', entrega.calle],
                ['Departamento', entrega.departamento],
                ['Región', entrega.region],
                ['Comuna', entrega.comuna],
                ['Indicaciones', entrega.indicaciones],
              ]
        }
      />

      <h2 className="h5 mt-4">Detalle de la compra</h2>
      <ResumenCarrito items={orden.items} />

      <p className="bg-body-secondary rounded p-3 text-center fw-bold fs-5 mb-0 orden-total">
        Total {orden.estado === 'Pagada' ? 'pagado' : 'a pagar'}: {formatCLP(orden.total)}
      </p>
    </div>
  )
}

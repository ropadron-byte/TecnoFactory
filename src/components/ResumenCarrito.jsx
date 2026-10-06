import { formatCLP } from '../utils/formato'

// Tabla de solo lectura con los productos que se van a comprar.
export default function ResumenCarrito({ items }) {
  return (
    <div className="table-responsive">
      <table className="table table-sm align-middle">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.codigo}>
              <td>{i.nombre}</td>
              <td>{formatCLP(i.precio)}</td>
              <td>{i.qty}</td>
              <td>{formatCLP(i.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

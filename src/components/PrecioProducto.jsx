import { Badge } from 'react-bootstrap'
import { formatCLP } from '../utils/formato'
import { descuentoDe, precioFinal, tieneOferta } from '../utils/precios'

// Precio de un producto: si está en oferta muestra el precio normal tachado,
// el precio final y (si `etiqueta`) el porcentaje de descuento.
export default function PrecioProducto({ producto, className = 'fw-bold fs-5 mb-2', etiqueta = true }) {
  if (!tieneOferta(producto)) return <p className={className}>{formatCLP(producto.precio)}</p>

  return (
    <p className={className}>
      {formatCLP(precioFinal(producto))}
      <s className="price-old text-body-secondary fs-6 fw-normal ms-2">{formatCLP(producto.precio)}</s>
      {etiqueta && (
        <Badge bg="danger" className="ms-2 align-middle">
          -{descuentoDe(producto)}%
        </Badge>
      )}
    </p>
  )
}

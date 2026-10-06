import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import ProductImage from './ProductImage.jsx'
import { slugify } from '../utils/texto'

// Tarjeta de una categoría (imagen o ícono, nombre y cantidad de productos).
export default function CategoriaCard({ categoria, cantidad }) {
  return (
    <Card as={Link} to={`/categorias/${slugify(categoria.nombre)}`} className="h-100 text-center text-decoration-none text-body shadow-sm">
      <div className="ratio ratio-3x2 bg-body-secondary rounded-top overflow-hidden">
        <ProductImage url={categoria.imagen} alt={categoria.nombre} categoria={categoria.nombre} iconSize="2.6rem" />
      </div>
      <Card.Body className="p-2">
        <strong>{categoria.nombre}</strong>
        {cantidad != null && (
          <div className="small text-body-secondary">
            {cantidad} {cantidad === 1 ? 'producto' : 'productos'}
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

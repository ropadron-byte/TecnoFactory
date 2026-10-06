import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Button, Card } from 'react-bootstrap'
import { imagenesProducto } from '../services/productosService'
import { useCart } from '../context/CartContext.jsx'
import { descuentoDe, tieneOferta } from '../utils/precios'
import ProductImage from './ProductImage.jsx'
import PrecioProducto from './PrecioProducto.jsx'

// Tarjeta de producto del catálogo (Productos, Categorías y Ofertas).
export default function ProductCard({ producto }) {
  const { addToCart } = useCart()
  const [texto, setTexto] = useState(null)
  const [imagen] = imagenesProducto(producto)
  const enlace = `/productos/${encodeURIComponent(producto.codigo)}`

  function agregar() {
    const resultado = addToCart(producto.codigo, 1)
    setTexto(resultado.ok ? '¡Añadido!' : resultado.message)
    setTimeout(() => setTexto(null), 1500)
  }

  return (
    <Card as="article" className="h-100 shadow-sm">
      <Link to={enlace} className="position-relative d-block">
        <div className="ratio ratio-4x3 bg-body-secondary rounded-top overflow-hidden">
          <ProductImage url={imagen} alt={producto.nombre} categoria={producto.categoria} />
        </div>
        {tieneOferta(producto) && (
          <Badge bg="danger" className="position-absolute top-0 start-0 m-2 offer-ribbon">
            -{descuentoDe(producto)}%
          </Badge>
        )}
      </Link>
      <Card.Body className="d-flex flex-column">
        <small className="text-body-secondary">{producto.categoria}</small>
        <Card.Title as="h3" className="h6">
          <Link to={enlace} className="text-decoration-none text-body">
            {producto.nombre}
          </Link>
        </Card.Title>
        {/* el % ya se ve en la cinta sobre la imagen */}
        <PrecioProducto producto={producto} etiqueta={false} />
        {producto.stock > 0 ? (
          <Button variant="warning" size="sm" className="mt-auto" onClick={agregar}>
            {texto ?? 'Añadir al carrito'}
          </Button>
        ) : (
          <Badge bg="secondary" className="mt-auto align-self-start">
            Sin stock
          </Badge>
        )}
      </Card.Body>
    </Card>
  )
}

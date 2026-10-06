import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { imagenesProducto, obtenerProductos } from '../services/productosService'
import { useCart } from '../context/CartContext.jsx'
import { tieneOferta } from '../utils/precios'
import ProductImage from './ProductImage.jsx'
import PrecioProducto from './PrecioProducto.jsx'

const MAXIMO = 5

// Productos con stock que todavía no están en el carrito (primero las ofertas).
export function productosSugeridos(cart, productos = obtenerProductos(), maximo = MAXIMO) {
  const enCarrito = new Set(cart.map((i) => i.codigo))
  return productos
    .filter((p) => p.stock > 0 && !enCarrito.has(p.codigo))
    .sort((a, b) => Number(tieneOferta(b)) - Number(tieneOferta(a)))
    .slice(0, maximo)
}

function Sugerido({ producto }) {
  const { addToCart } = useCart()
  const [texto, setTexto] = useState(null)
  const [imagen] = imagenesProducto(producto)

  function agregar() {
    const r = addToCart(producto.codigo, 1)
    setTexto(r.ok ? '¡Añadido!' : r.message)
    setTimeout(() => setTexto(null), 1500)
  }

  return (
    <li className="d-flex gap-2 align-items-center py-2 border-bottom">
      <div className="ratio ratio-1x1 bg-body-secondary rounded overflow-hidden flex-shrink-0" style={{ width: 64 }}>
        <ProductImage url={imagen} alt={producto.nombre} categoria={producto.categoria} />
      </div>
      <div className="flex-grow-1 small">
        <Link to={`/productos/${encodeURIComponent(producto.codigo)}`} className="text-decoration-none text-body fw-semibold">
          {producto.nombre}
        </Link>
        <PrecioProducto producto={producto} etiqueta={false} className="mb-1" />
        <Button variant="warning" size="sm" onClick={agregar} aria-label={`Añadir ${producto.nombre} al carrito`}>
          {texto ?? 'Añadir'}
        </Button>
      </div>
    </li>
  )
}

// Lista lateral del carrito para incentivar la compra de más productos.
export default function ProductosSugeridos() {
  const { cart } = useCart()
  const lista = productosSugeridos(cart)
  if (lista.length === 0) return null

  return (
    <aside className="card card-body mt-3" aria-label="Productos disponibles">
      <h2 className="h6 fw-bold mb-1">Productos disponibles</h2>
      <p className="small text-body-secondary mb-2">Aprovecha y suma más a tu compra.</p>
      <ul className="list-unstyled mb-2">
        {lista.map((p) => (
          <Sugerido key={p.codigo} producto={p} />
        ))}
      </ul>
      <Link to="/productos" className="small">
        Ver todo el catálogo
      </Link>
    </aside>
  )
}

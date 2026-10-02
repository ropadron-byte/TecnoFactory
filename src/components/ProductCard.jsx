import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatCLP } from '../utils/formato'
import { imagenesProducto } from '../services/productosService'
import { useCart } from '../context/CartContext.jsx'
import ProductImage from './ProductImage.jsx'

// Tarjeta de producto del catálogo (página Productos).
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
    <article className="card">
      <Link to={enlace}>
        <div
          className="media media--card"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
        >
          <ProductImage url={imagen} alt={producto.nombre} categoria={producto.categoria} />
        </div>
      </Link>
      <div className="card-body">
        <span className="card-meta">{producto.categoria}</span>
        <h3>
          <Link to={enlace}>{producto.nombre}</Link>
        </h3>
        <p className="price">{formatCLP(producto.precio)}</p>
        {producto.stock > 0 ? (
          <button type="button" className="btn accent small" onClick={agregar}>
            {texto ?? 'Añadir al carrito'}
          </button>
        ) : (
          <span className="stock-tag">Sin stock</span>
        )}
      </div>
    </article>
  )
}

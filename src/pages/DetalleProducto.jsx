import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import PageHead from '../components/PageHead.jsx'
import ProductImage from '../components/ProductImage.jsx'
import QuantitySelector from '../components/QuantitySelector.jsx'
import { formatCLP } from '../utils/formato'
import { imagenesProducto } from '../services/productosService'
import { useCart } from '../context/CartContext.jsx'
import usePageTitle from '../hooks/usePageTitle'

export default function DetalleProducto() {
  // El loader de la ruta (router.jsx) ya validó que el producto existe.
  const producto = useLoaderData()
  usePageTitle(producto.nombre)

  // `key` reinicia el estado interno (cantidad, imagen activa) al cambiar de producto.
  return <FichaProducto key={producto.codigo} producto={producto} />
}

function FichaProducto({ producto }) {
  const { addToCart } = useCart()
  const imagenes = imagenesProducto(producto)
  const [indice, setIndice] = useState(0)
  const [cantidad, setCantidad] = useState(1)
  const [mensaje, setMensaje] = useState(null)

  const sinStock = producto.stock <= 0
  const stockTexto = sinStock
    ? 'Sin stock'
    : producto.stock <= producto.stockCritico
      ? `¡Quedan solo ${producto.stock} unidades!`
      : `${producto.stock} unidades disponibles`

  const specs = [
    { label: 'Código', value: producto.codigo },
    { label: 'Categoría', value: producto.categoria },
    { label: 'Stock disponible', value: `${producto.stock} unidades` },
  ]

  function agregar() {
    setMensaje(addToCart(producto.codigo, cantidad))
  }

  return (
    <>
      <PageHead eyebrow={<Link to="/productos">← Volver al catálogo</Link>} titulo={producto.nombre} />

      <section className="section wrap">
        <div className="product-detail">
          <div className="product-gallery">
            <div className="media media--square">
              <ProductImage
                key={imagenes[indice]}
                url={imagenes[indice]}
                alt={producto.nombre}
                categoria={producto.categoria}
                iconSize="6rem"
              />
            </div>
            {imagenes.length > 1 && (
              <div className="product-thumbs">
                {imagenes.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    className={'product-thumb' + (i === indice ? ' active' : '')}
                    onClick={() => setIndice(i)}
                  >
                    <img src={url} alt={`Miniatura ${i + 1} de ${producto.nombre}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <span className="card-meta">{producto.categoria}</span>
            <h1 style={{ marginTop: '.2em' }}>{producto.nombre}</h1>
            <p>{producto.descripcion}</p>

            <p className="price">{formatCLP(producto.precio)}</p>
            <span className="stock-tag">{stockTexto}</span>

            <div style={{ marginTop: 20 }}>
              <QuantitySelector
                value={cantidad}
                max={producto.stock || 1}
                onChange={setCantidad}
                disabled={sinStock}
              />
            </div>

            <button className="btn accent" style={{ marginTop: 16 }} onClick={agregar} disabled={sinStock}>
              Agregar al carrito
            </button>
            {mensaje && (
              <p className={mensaje.ok ? 'msg-ok' : 'msg-error'} style={{ marginTop: 10 }}>
                {mensaje.message}
              </p>
            )}

            <div className="spec-list">
              {specs.map((s) => (
                <div className="spec-row" key={s.label}>
                  <span>{s.label}</span>
                  <span>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

import { useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { Alert, Badge, Button, Col, Container, Row } from 'react-bootstrap'
import PageHead from '../components/PageHead.jsx'
import ListaDatos from '../components/ListaDatos.jsx'
import ProductImage from '../components/ProductImage.jsx'
import QuantitySelector from '../components/QuantitySelector.jsx'
import PrecioProducto from '../components/PrecioProducto.jsx'
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
    ['Código', producto.codigo],
    ['Categoría', producto.categoria],
    ['Stock disponible', `${producto.stock} unidades`],
  ]

  function agregar() {
    setMensaje(addToCart(producto.codigo, cantidad))
  }

  return (
    <>
      <PageHead eyebrow={<Link to="/productos">← Volver al catálogo</Link>} titulo={producto.nombre} />

      <Container className="py-4">
        <Row className="g-4">
          <Col md={6}>
            <div className="ratio ratio-1x1 bg-body-secondary rounded overflow-hidden">
              <ProductImage key={imagenes[indice]} url={imagenes[indice]} alt={producto.nombre} categoria={producto.categoria} iconSize="6rem" />
            </div>
            {imagenes.length > 1 && (
              <div className="d-flex flex-wrap gap-2 mt-3">
                {imagenes.map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    className={'btn p-1 border ' + (i === indice ? 'border-primary border-2' : '')}
                    style={{ width: 64, height: 64 }}
                    onClick={() => setIndice(i)}
                  >
                    <img src={url} alt={`Miniatura ${i + 1} de ${producto.nombre}`} className="w-100 h-100 object-fit-cover" />
                  </button>
                ))}
              </div>
            )}
          </Col>

          <Col md={6}>
            <small className="text-body-secondary">{producto.categoria}</small>
            <h2 className="h1 fw-bold">{producto.nombre}</h2>
            <p>{producto.descripcion}</p>

            <PrecioProducto producto={producto} className="fw-bold fs-3 mb-2" />
            <Badge bg={sinStock ? 'secondary' : 'success'}>{stockTexto}</Badge>

            <div className="mt-4">
              <QuantitySelector value={cantidad} max={producto.stock || 1} onChange={setCantidad} disabled={sinStock} />
            </div>

            <Button variant="warning" className="mt-3" onClick={agregar} disabled={sinStock}>
              Agregar al carrito
            </Button>
            {mensaje && (
              <Alert variant={mensaje.ok ? 'success' : 'danger'} className="mt-3 py-2">
                {mensaje.message}
              </Alert>
            )}

            <div className="mt-4">
              <ListaDatos filas={specs} />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}

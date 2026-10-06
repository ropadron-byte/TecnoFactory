import { Col, Row } from 'react-bootstrap'
import ProductCard from './ProductCard.jsx'

// Grilla de tarjetas de producto; muestra `vacio` si no hay productos.
export default function ProductGrid({ productos, vacio = 'No encontramos productos.' }) {
  if (productos.length === 0) return <p className="text-center text-body-secondary py-5">{vacio}</p>

  return (
    <Row xs={1} sm={2} lg={3} className="g-4">
      {productos.map((p) => (
        <Col key={p.codigo}>
          <ProductCard producto={p} />
        </Col>
      ))}
    </Row>
  )
}

import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import PageHead from '../components/PageHead.jsx'
import CategoriaCard from '../components/CategoriaCard.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import { obtenerCategorias } from '../services/categoriasService'
import { obtenerProductos } from '../services/productosService'
import { slugify } from '../utils/texto'
import usePageTitle from '../hooks/usePageTitle'

// Vista "Categorías": arriba las tarjetas de cada categoría y debajo los
// productos separados por categoría.
export default function Categorias() {
  usePageTitle('Categorías')
  const [categorias] = useState(obtenerCategorias)
  const [productos] = useState(obtenerProductos)

  const porCategoria = categorias.map((c) => ({
    categoria: c,
    productos: productos.filter((p) => p.categoria === c.nombre),
  }))

  return (
    <>
      <PageHead eyebrow="TF / CATEGORÍAS" titulo="Compra por categoría">
        Elige una categoría para ver solo los productos que te interesan.
      </PageHead>

      <Container as="section" className="py-4">
        <Row xs={2} md={3} lg={6} className="g-3">
          {porCategoria.map(({ categoria, productos }) => (
            <Col key={categoria.id}>
              <CategoriaCard categoria={categoria} cantidad={productos.length} />
            </Col>
          ))}
        </Row>
      </Container>

      {porCategoria
        .filter(({ productos }) => productos.length > 0)
        .map(({ categoria, productos }) => (
          <Container as="section" className="py-4" key={categoria.id} id={slugify(categoria.nombre)}>
            <h2>{categoria.nombre}</h2>
            <ProductGrid productos={productos} />
          </Container>
        ))}
    </>
  )
}

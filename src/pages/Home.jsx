import { Link } from 'react-router-dom'
import { Card, Carousel, Col, Container, Row } from 'react-bootstrap'
import usePageTitle from '../hooks/usePageTitle'
import ProductImage from '../components/ProductImage.jsx'
import PrecioProducto from '../components/PrecioProducto.jsx'
import { obtenerCategorias } from '../services/categoriasService'
import { slugify } from '../utils/texto'
import { iconoCategoria, imagenesProducto, obtenerProductos } from '../services/productosService'
import banner1 from '../assets/images/banners/banner1.jpeg'
import banner2 from '../assets/images/banners/banner2.jpeg'
import banner3 from '../assets/images/banners/banner3.jpeg'

const BANNERS = [
  { src: banner2, alt: 'Monitor 1' },
  { src: banner3, alt: 'Monitor 2' },
  { src: banner1, alt: 'Disco Duro' },
]

const BENEFICIOS = [
  { icono: '🚚', texto: 'Envíos a todo Chile' },
  { icono: '🛡️', texto: 'Garantía Asegurada' },
  { icono: '💳', texto: 'Pago Seguro' },
  { icono: '🎧', texto: 'Soporte Continuo' },
]

export default function Home() {
  usePageTitle('')

  const destacados = obtenerProductos().slice(0, 8) // hasta 8 productos
  const categorias = obtenerCategorias()

  return (
    <>
      {/* 1. HERO Y CARRUSEL */}
      <section className="hero-banner text-white py-5">
        <Container className="text-center mb-4">
          <h1 className="display-4 fw-bold mb-3">Bienvenido a Tecno Factory</h1>
          <p className="fs-5 mx-auto" style={{ maxWidth: 640 }}>
            Los mejores precios y una gran variedad de productos electrónicos
          </p>
        </Container>

        <Container>
          <Carousel className="mx-auto overflow-hidden" style={{ maxWidth: 1000 }} interval={5000}>
            {BANNERS.map((b) => (
              <Carousel.Item key={b.alt} className="p-4">
                <img src={b.src} alt={b.alt} className="d-block mx-auto img-fluid" style={{ maxHeight: 380, objectFit: 'contain' }} />
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>

      {/* 2. BARRA DE BENEFICIOS */}
      <section className="py-4 bg-body-tertiary border-bottom">
        <Container>
          <Row className="text-center g-3">
            {BENEFICIOS.map((b) => (
              <Col xs={6} md={3} key={b.texto}>
                <span className="fs-3" aria-hidden="true">
                  {b.icono}
                </span>
                <p className="mb-0 fw-semibold">{b.texto}</p>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 3. CATEGORÍAS */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-4 fw-bold">Categorías</h2>
          <Row xs={2} md={3} lg={6} className="g-3">
            {categorias.map((c) => (
              <Col key={c.id}>
                <Card as={Link} to={`/categorias/${slugify(c.nombre)}`} className="h-100 text-center text-decoration-none text-body shadow-sm py-3">
                  <span className="fs-2" aria-hidden="true">
                    {iconoCategoria(c.nombre)}
                  </span>
                  <span className="fw-semibold">{c.nombre}</span>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 4. PRODUCTOS MÁS VENDIDOS */}
      <section id="productos" className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-4 fw-bold">Productos Más Vendidos</h2>
          <Row xs={1} sm={2} md={4} className="g-4">
            {destacados.map((p) => (
              <Col key={p.codigo}>
                <Card className="h-100 text-center p-3 shadow-sm">
                  <div className="ratio ratio-4x3 bg-body-secondary rounded mb-3 overflow-hidden">
                    <ProductImage url={imagenesProducto(p)[0]} alt={p.nombre} categoria={p.categoria} />
                  </div>
                  <Card.Body className="d-flex flex-column p-0">
                    <Card.Title as="h6">{p.nombre}</Card.Title>
                    <p className="text-muted small mb-1">{p.categoria}</p>
                    <PrecioProducto producto={p} className="fw-bold mb-3" />
                    <Link to={`/productos/${encodeURIComponent(p.codigo)}`} className="btn btn-outline-primary mt-auto">
                      Ver producto
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  )
}

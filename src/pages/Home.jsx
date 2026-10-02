import { Link } from 'react-router-dom'
import Carousel from 'react-bootstrap/Carousel'
// El Home es la única página que usa Bootstrap (igual que el sitio
// original). `?inline` entrega el CSS como texto para inyectarlo solo
// mientras el Home está en pantalla, sin afectar al resto de la tienda.
import bootstrapCss from 'bootstrap/dist/css/bootstrap.min.css?inline'
import homeCss from '../styles/home.css?inline'
import useScopedStyles from '../hooks/useScopedStyles'
import usePageTitle from '../hooks/usePageTitle'
import ProductImage from '../components/ProductImage.jsx'
import { formatCLP } from '../utils/formato'
import { imagenesProducto, obtenerProductos } from '../services/productosService'
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
  useScopedStyles(bootstrapCss + '\n' + homeCss)

  const destacados = obtenerProductos().slice(0, 8) // hasta 8 productos

  return (
    <>
      {/* 1. HERO Y CARRUSEL */}
      <section className="hero-banner text-white py-5 position-relative">
        <div className="container text-center mb-4">
          <h1 className="display-4 hero-title mb-3">Bienvenido a Tecno Factory</h1>
          <p className="fs-5 hero-subtitle max-w-2xl mx-auto">
            Los mejores precios y una gran variedad de productos electrónicos
          </p>
        </div>

        <div className="container">
          <Carousel className="mx-auto" style={{ maxWidth: 1000, overflow: 'hidden' }} interval={5000}>
            {BANNERS.map((b) => (
              <Carousel.Item key={b.alt} className="hero-carousel-item p-4">
                <img
                  src={b.src}
                  alt={b.alt}
                  className="d-block mx-auto img-fluid"
                  style={{ maxHeight: 380, objectFit: 'contain' }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </section>

      {/* 2. BARRA DE BENEFICIOS */}
      <section className="py-4 bg-body-tertiary border-bottom">
        <div className="container">
          <div className="row text-center g-3">
            {BENEFICIOS.map((b) => (
              <div className="col-6 col-md-3" key={b.texto}>
                <span className="fs-3" aria-hidden="true">{b.icono}</span>
                <p className="mb-0 fw-semibold">{b.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PRODUCTOS MÁS VENDIDOS */}
      <section id="productos" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4 fw-bold">Productos Más Vendidos</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
            {destacados.map((p) => (
              <div className="col mb-2" key={p.codigo}>
                <div className="card h-100 text-center p-3">
                  <div className="media" style={{ height: 140, marginBottom: '.75rem' }}>
                    <ProductImage url={imagenesProducto(p)[0]} alt={p.nombre} categoria={p.categoria} />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title">{p.nombre}</h6>
                    <p className="text-muted small mb-1">{p.categoria}</p>
                    <p className="fw-bold mb-3">{formatCLP(p.precio)}</p>
                    <Link to={`/productos/${encodeURIComponent(p.codigo)}`} className="btn btn-outline-primary mt-auto">
                      Ver producto
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

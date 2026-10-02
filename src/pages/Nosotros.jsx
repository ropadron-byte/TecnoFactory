import PageHead from '../components/PageHead.jsx'
import usePageTitle from '../hooks/usePageTitle'

export default function Nosotros() {
  usePageTitle('Nosotros')
  return (
    <>
      <PageHead eyebrow="TF / NOSOTROS" titulo="Quiénes somos">
        Conoce la historia detrás de Tecno Factory y al equipo que la hace posible.
      </PageHead>

      <section className="section wrap">
        <article className="blog-body">
          <h2>Nuestra historia</h2>
          <p>
            Tecno Factory nació como un pequeño local de atención presencial dedicado a la venta de notebooks,
            accesorios y equipos tecnológicos. Con el tiempo, y gracias a la confianza de nuestros clientes,
            decidimos dar el salto al mundo online para llegar a más personas en todo Chile.
          </p>
          <iframe
            className="video-embed"
            src="https://www.youtube.com/embed/IXqosvy4YGE"
            title="Video institucional Tecno Factory"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

          <h2>Nuestra misión</h2>
          <p>
            Ofrecer tecnología de calidad a precios justos, con información clara sobre cada producto y un proceso
            de compra simple, para que encontrar el equipo que necesitas no te tome más de unos minutos.
          </p>

          <h2>Nuestro equipo</h2>
          <p>
            Somos un equipo pequeño y multidisciplinario, formado por estudiantes y profesionales apasionados por la
            tecnología y el desarrollo web:
          </p>
          <ul>
            <li>Desarrollo frontend y diseño de la tienda online.</li>
            <li>Gestión de catálogo e inventario de productos.</li>
            <li>Atención a clientes y soporte post-venta.</li>
          </ul>

          <h2>¿Por qué elegirnos?</h2>
          <ul>
            <li>Catálogo curado de notebooks, audio, accesorios, monitores y almacenamiento.</li>
            <li>Fichas de producto con la información que realmente importa.</li>
            <li>Despacho a todo Chile y múltiples medios de pago.</li>
          </ul>
        </article>
      </section>
    </>
  )
}

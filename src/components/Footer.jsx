import PaymentMethods from './PaymentMethods.jsx'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div>
          <h4>Tecno Factory</h4>
          <p>Tecnología pensada para acompañarte en el estudio, el trabajo y tus proyectos personales.</p>
        </div>

        <div>
          <h4>Contacto</h4>
          <ul>
            <li>hola@tecnofactory.cl</li>
            <li>+56 9 1234 5678</li>
            <li>Santiago, Chile</li>
          </ul>
        </div>

        <div>
          <h4>Medios de Pago</h4>
          <PaymentMethods />
        </div>
      </div>

      <div className="wrap footer-bottom">
        <span>© 2026 Tecno Factory.</span>
      </div>
    </footer>
  )
}

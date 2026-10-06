import { Col, Container, Row } from 'react-bootstrap'
import PaymentMethods from './PaymentMethods.jsx'

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-5 pt-5">
      <Container>
        <Row className="g-4 pb-4">
          <Col lg={5}>
            <h5>Tecno Factory</h5>
            <p className="text-white-50">Tecnología pensada para acompañarte en el estudio, el trabajo y tus proyectos personales.</p>
          </Col>
          <Col sm={6} lg={3}>
            <h5>Contacto</h5>
            <ul className="list-unstyled text-white-50">
              <li>hola@tecnofactory.cl</li>
              <li>+56 9 1234 5678</li>
              <li>Santiago, Chile</li>
            </ul>
          </Col>
          <Col sm={6} lg={4}>
            <h5>Medios de Pago</h5>
            <PaymentMethods />
          </Col>
        </Row>
        <div className="border-top border-light border-opacity-25 py-3 small text-white-50">© 2026 Tecno Factory.</div>
      </Container>
    </footer>
  )
}

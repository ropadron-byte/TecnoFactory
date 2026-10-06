import { Container } from 'react-bootstrap'

// Encabezado estándar de cada página interna: "eyebrow" + título + bajada.
export default function PageHead({ eyebrow, titulo, children }) {
  return (
    <section className="bg-white border-bottom">
      <Container className="py-4">
        {eyebrow && <p className="text-uppercase small fw-semibold text-primary mb-1">{eyebrow}</p>}
        <h1 className="display-6 fw-bold">{titulo}</h1>
        {children && <p className="lead text-secondary mb-0">{children}</p>}
      </Container>
    </section>
  )
}

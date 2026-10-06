import { Link } from 'react-router-dom'
import { Badge, Card, Col, Container, Row } from 'react-bootstrap'
import PageHead from '../components/PageHead.jsx'
import { BLOGS } from '../data/blogs'
import usePageTitle from '../hooks/usePageTitle'

export default function Blogs() {
  usePageTitle('Blogs')
  return (
    <>
      <PageHead eyebrow="TF / BLOG" titulo="Novedades y curiosidades tecno">
        Aquí podrás encontrar noticias de la tienda, lanzamientos y datos curiosos sobre tecnología, seleccionados
        por el equipo de Tecno Factory.
      </PageHead>

      <Container className="py-4">
        <Row xs={1} md={2} lg={3} className="g-4">
          {BLOGS.map((b) => (
            <Col key={b.slug}>
              <Card as="article" className="h-100 shadow-sm">
                <div className="position-relative">
                  <Card.Img variant="top" src={b.imagen} alt={b.alt} style={{ height: 180, objectFit: 'cover' }} />
                  <Badge bg="warning" text="dark" className="position-absolute top-0 start-0 m-2">
                    {b.etiqueta}
                  </Badge>
                </div>
                <Card.Body className="d-flex flex-column">
                  <small className="text-body-secondary">{b.meta}</small>
                  <Card.Title as="h3" className="h5">
                    {b.titulo}
                  </Card.Title>
                  <Card.Text>{b.resumen}</Card.Text>
                  {b.disponible ? (
                    <Link className="btn btn-outline-primary btn-sm mt-auto align-self-start" to={`/blogs/${b.slug}`}>
                      Leer más
                    </Link>
                  ) : (
                    <span className="btn btn-outline-primary btn-sm mt-auto align-self-start disabled">Próximamente</span>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  )
}

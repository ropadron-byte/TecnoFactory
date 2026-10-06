import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import PageHead from '../components/PageHead.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import { obtenerProductos } from '../services/productosService'
import { obtenerCategorias } from '../services/categoriasService'
import { precioFinal } from '../utils/precios'
import { normalizar } from '../utils/texto'
import usePageTitle from '../hooks/usePageTitle'

const ORDENES = {
  'precio-asc': (a, b) => precioFinal(a) - precioFinal(b),
  'precio-desc': (a, b) => precioFinal(b) - precioFinal(a),
  nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
}

export default function Productos() {
  usePageTitle('Productos')
  // Los filtros viven en la URL (?categoria=...&q=...&orden=...): así se pueden
  // compartir, y el botón "atrás" del navegador los respeta.
  const [params, setParams] = useSearchParams()
  const categoria = params.get('categoria') || 'todos'
  const busqueda = params.get('q') || ''
  const orden = params.get('orden') || ''

  const [productos] = useState(obtenerProductos)
  const [categorias] = useState(obtenerCategorias)

  function cambiarFiltro(clave, valor) {
    const siguiente = new URLSearchParams(params)
    if (!valor || valor === 'todos') siguiente.delete(clave)
    else siguiente.set(clave, valor)
    setParams(siguiente, { replace: true })
  }

  const texto = normalizar(busqueda.trim())
  const visibles = productos
    .filter((p) => categoria === 'todos' || p.categoria === categoria)
    .filter((p) => !texto || normalizar(`${p.nombre} ${p.codigo} ${p.categoria}`).includes(texto))
    .sort(ORDENES[orden] ?? (() => 0))

  return (
    <>
      <PageHead eyebrow="TF / CATÁLOGO" titulo="Todos nuestros productos">
        Notebooks, audio, accesorios, monitores y almacenamiento: todo lo que necesitas, en un solo catálogo.
      </PageHead>

      <Container className="py-4">
        <Row className="g-2 mb-3">
          <Col md={8}>
            <Form.Control
              type="search"
              placeholder="Buscar por nombre o código…"
              aria-label="Buscar productos"
              value={busqueda}
              onChange={(e) => cambiarFiltro('q', e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Select aria-label="Ordenar productos" value={orden} onChange={(e) => cambiarFiltro('orden', e.target.value)}>
              <option value="">Orden original</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="nombre">Nombre (A-Z)</option>
            </Form.Select>
          </Col>
        </Row>

        <div className="d-flex flex-wrap gap-2 mb-4">
          {['todos', ...categorias.map((c) => c.nombre)].map((c) => (
            <Button key={c} size="sm" className="rounded-pill" variant={categoria === c ? 'primary' : 'outline-primary'} onClick={() => cambiarFiltro('categoria', c)}>
              {c === 'todos' ? 'Todos' : c}
            </Button>
          ))}
        </div>

        <ProductGrid productos={visibles} vacio="No encontramos productos con esos filtros." />
      </Container>
    </>
  )
}

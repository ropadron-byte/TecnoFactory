import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Badge, Button, Container, Nav, Navbar } from 'react-bootstrap'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const ENLACES = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/productos', label: 'Productos' },
  { to: '/categorias', label: 'Categorías' },
  { to: '/ofertas', label: 'Ofertas' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/contacto', label: 'Contacto' },
]

export default function Header() {
  const [abierto, setAbierto] = useState(false)
  const { totalItems } = useCart()
  const { sesion, logout, esStaff } = useAuth()
  const navigate = useNavigate()

  const cerrarMenu = () => setAbierto(false)

  function salir(e) {
    e.preventDefault()
    logout()
    cerrarMenu()
    navigate('/')
  }

  return (
    <Navbar expand="xl" bg="white" sticky="top" className="border-bottom shadow-sm" expanded={abierto} onToggle={setAbierto}>
      <Container fluid="xxl">
        <Navbar.Brand as={Link} to="/" onClick={cerrarMenu} className="fw-bold me-0">
          <img src="/favicon.svg" width="28" height="28" className="me-2 align-text-bottom" alt="" />
          Tecno Factory
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir menú" />

        <Navbar.Collapse id="menu-principal">
          <Nav className="mx-auto text-nowrap">
            {ENLACES.map(({ to, label, end }) => (
              <Nav.Link key={to} as={NavLink} to={to} end={end} onClick={cerrarMenu}>
                {label}
              </Nav.Link>
            ))}
            {sesion ? (
              <>
                {esStaff && (
                  <Nav.Link as={NavLink} to="/admin" onClick={cerrarMenu}>
                    Panel admin
                  </Nav.Link>
                )}
                <Nav.Link href="#" onClick={salir} title={`Cerrar sesión de ${sesion.nombre}`}>
                  Cerrar sesión (<span className="d-inline-block text-truncate align-bottom" style={{ maxWidth: '6ch' }}>{sesion.nombre}</span>)
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/registro" onClick={cerrarMenu}>
                  Registrarme
                </Nav.Link>
                <Nav.Link as={NavLink} to="/iniciar-sesion" onClick={cerrarMenu}>
                  Iniciar sesión
                </Nav.Link>
              </>
            )}
          </Nav>

          <Button as={NavLink} to="/carrito" variant="outline-dark" size="sm" className="text-nowrap" aria-label="Ver carrito de compras" onClick={cerrarMenu}>
            🛒 Carrito{' '}
            <Badge bg="warning" text="dark" className="cart-count">
              {totalItems}
            </Badge>
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

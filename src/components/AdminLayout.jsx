import { useState } from 'react'
import { NavLink, Outlet, ScrollRestoration, useNavigate } from 'react-router-dom'
import { Nav, Offcanvas } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext.jsx'
import { AdminUIContext } from '../context/AdminUIContext.jsx'
import { ROLES } from '../data/constantes'

// Estructura del panel: barra lateral + contenido. En pantallas chicas la
// barra lateral es un Offcanvas (se abre con el botón ☰).
export default function AdminLayout() {
  const { sesion, logout } = useAuth()
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const esAdmin = sesion?.tipo === ROLES.admin

  const cerrarMenu = () => setMenuAbierto(false)

  function salir() {
    logout()
    navigate('/iniciar-sesion')
  }

  const enlace = (to, icono, texto, end = false) => (
    <Nav.Link as={NavLink} to={to} end={end} onClick={cerrarMenu}>
      <span className="me-2">{icono}</span>
      {texto}
    </Nav.Link>
  )

  return (
    <AdminUIContext.Provider value={{ alternarMenu: () => setMenuAbierto((v) => !v) }}>
      <div className="d-lg-flex min-vh-100">
        <Offcanvas show={menuAbierto} onHide={cerrarMenu} responsive="lg" className="admin-sidebar bg-dark" data-bs-theme="dark">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Panel Tecno Factory</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="d-flex flex-column p-3">
            <Nav variant="pills" className="flex-column mb-auto" as="nav">
              {enlace('/admin', '🏠', 'Inicio', true)}
              {enlace('/admin/ordenes', '🧾', 'Órdenes')}
              {enlace('/admin/productos', '📦', 'Productos')}
              {/* Estas secciones son solo para el Administrador */}
              {esAdmin && (
                <>
                  {enlace('/admin/categorias', '🏷️', 'Categorías')}
                  {enlace('/admin/usuarios', '👤', 'Usuarios')}
                  {enlace('/admin/reportes', '📊', 'Reportes')}
                </>
              )}
              {enlace('/admin/perfil', '🙍', 'Perfil')}
            </Nav>

            <div className="border-top border-secondary pt-3 mt-3">
              <p className="small text-body-secondary mb-2">
                Conectado como
                <br />
                <strong className="text-white">
                  {sesion.nombre} {sesion.apellidos || ''}
                </strong>
                <br />
                {sesion.tipo}
              </p>
              <Nav className="flex-column">
                {enlace('/', '🛍️', 'Ir a la tienda', true)}
                <Nav.Link as="button" type="button" className="text-start" onClick={salir}>
                  <span className="me-2">🚪</span>Cerrar sesión
                </Nav.Link>
              </Nav>
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        <main className="flex-grow-1 p-3 p-lg-4 d-flex flex-column" style={{ minWidth: 0 }}>
          <div className="flex-grow-1">
            <Outlet />
          </div>
          <footer className="border-top pt-3 mt-4 small text-body-secondary">© 2026 Tecno Factory — Panel de administración</footer>
        </main>
      </div>
      <ScrollRestoration />
    </AdminUIContext.Provider>
  )
}

import { useEffect, useState } from 'react'
import { NavLink, Outlet, ScrollRestoration, useNavigate } from 'react-router-dom'
import '../styles/admin.css'
import { useAuth } from '../context/AuthContext.jsx'
import { AdminUIContext } from '../context/AdminUIContext.jsx'
import { ROLES } from '../data/constantes'

// Estructura del panel: barra lateral + contenido. El menú lateral es
// "off-canvas" en pantallas angostas (≤ 880px).
export default function AdminLayout() {
  const { sesion, logout } = useAuth()
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const esAdmin = sesion?.tipo === ROLES.admin

  const cerrarMenu = () => setMenuAbierto(false)

  // Escape cierra el menú; al agrandar la ventana (vista escritorio) también.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setMenuAbierto(false)
    const onResize = () => window.innerWidth > 880 && setMenuAbierto(false)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  function salir() {
    logout()
    navigate('/iniciar-sesion')
  }

  return (
    <AdminUIContext.Provider value={{ alternarMenu: () => setMenuAbierto((v) => !v) }}>
      <div className="admin-wrap">
        <nav className={'admin-sidebar' + (menuAbierto ? ' open' : '')} onClick={(e) => e.target.closest('a') && cerrarMenu()}>
          <div className="admin-nav-top">
            <NavLink to="/admin" end>
              <span className="icon">🏠</span> Inicio
            </NavLink>
            {/* Solo el Administrador ve la gestión de usuarios */}
            {esAdmin && (
              <NavLink to="/admin/usuarios">
                <span className="icon">👤</span> Usuarios
              </NavLink>
            )}
            <NavLink to="/admin/productos">
              <span className="icon">📦</span> Productos
            </NavLink>
          </div>

          <div className="admin-nav-bottom">
            <div className="admin-session">
              Conectado como
              <br />
              <strong>
                {sesion.nombre} {sesion.apellidos || ''}
              </strong>
              <br />
              {sesion.tipo}
            </div>
            <NavLink to="/" end>
              <span className="icon">🛍️</span> Ir a la tienda
            </NavLink>
            <button type="button" className="admin-link" onClick={salir}>
              <span className="icon">🚪</span> Cerrar sesión
            </button>
          </div>
        </nav>

        <main className="admin-content">
          <Outlet />
          <footer className="admin-footer">
            <p>© 2026 Tecno Factory — Panel de administración</p>
          </footer>
        </main>

        <div className={'admin-overlay' + (menuAbierto ? ' show' : '')} onClick={cerrarMenu}></div>
      </div>
      <ScrollRestoration />
    </AdminUIContext.Provider>
  )
}

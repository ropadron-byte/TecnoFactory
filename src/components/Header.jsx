import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const ENLACES = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/productos', label: 'Productos' },
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
    <header className="site-header">
      <nav className="wrap nav">
        <Link to="/" className="logo" onClick={cerrarMenu}>
          <span className="logo-mark" aria-hidden="true"></span> Tecno Factory
        </Link>

        <button
          className="nav-toggle"
          aria-label="Abrir menú"
          aria-expanded={abierto}
          onClick={() => setAbierto((v) => !v)}
        >
          ☰
        </button>

        <ul className={'nav-links' + (abierto ? ' open' : '')}>
          {ENLACES.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                onClick={cerrarMenu}
              >
                {label}
              </NavLink>
            </li>
          ))}

          {sesion ? (
            <>
              {esStaff && (
                <li>
                  <NavLink to="/admin" onClick={cerrarMenu}>Panel admin</NavLink>
                </li>
              )}
              <li>
                <a href="#" onClick={salir}>
                  Cerrar sesión ({sesion.nombre})
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/registro" onClick={cerrarMenu}>Registrarme</NavLink>
              </li>
              <li>
                <NavLink to="/iniciar-sesion" onClick={cerrarMenu}>Iniciar sesión</NavLink>
              </li>
            </>
          )}
        </ul>

        <div className="nav-actions">
          <NavLink to="/carrito" className="cart-btn" aria-label="Ver carrito de compras" onClick={cerrarMenu}>
            🛒 Carrito <span className="cart-count">{totalItems}</span>
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

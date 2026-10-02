import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Protege rutas según el tipo de usuario (reemplaza a admin-guard.js).
 *
 *   <RequireRole roles={['Administrador', 'Vendedor']}>   -> solo esos roles
 *   children opcional: si no hay, renderiza las rutas hijas (<Outlet />).
 *
 * - Sin sesión (o rol no permitido y sin `redirectTo`) -> /iniciar-sesion
 * - Rol no permitido con `redirectTo`                   -> esa ruta
 */
export default function RequireRole({ roles, redirectTo, children }) {
  const { sesion } = useAuth()
  const location = useLocation()

  if (!sesion) {
    return <Navigate to="/iniciar-sesion" replace state={{ desde: location.pathname }} />
  }
  if (!roles.includes(sesion.tipo)) {
    return <Navigate to={redirectTo ?? '/iniciar-sesion'} replace />
  }
  return children ?? <Outlet />
}

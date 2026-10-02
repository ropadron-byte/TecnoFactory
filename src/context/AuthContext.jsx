import { createContext, useContext, useState } from 'react'
import * as usuarios from '../services/usuariosService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(() => usuarios.obtenerSesion())

  /** Devuelve la sesión si las credenciales son correctas, o null. */
  function login(correo, contrasena) {
    const nueva = usuarios.iniciarSesion(correo, contrasena)
    if (nueva) setSesion(nueva)
    return nueva
  }

  /** Vuelve a leer la sesión guardada (p. ej. tras editar al usuario actual). */
  function recargarSesion() {
    setSesion(usuarios.obtenerSesion())
  }

  function logout() {
    usuarios.cerrarSesion()
    setSesion(null)
  }

  const value = {
    sesion,
    login,
    logout,
    recargarSesion,
    esStaff: sesion?.tipo === 'Administrador' || sesion?.tipo === 'Vendedor',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}

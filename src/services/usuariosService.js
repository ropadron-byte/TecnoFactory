import { STORAGE_KEYS } from '../data/constantes'

// Usuario administrador que viene "de fábrica" para poder entrar al
// panel la primera vez. Credenciales: admin@duoc.cl / admin123
const USUARIO_ADMIN_BASE = {
  id: 1,
  run: '123456785',
  nombre: 'Admin',
  apellidos: 'Tecno Factory',
  correo: 'admin@duoc.cl',
  contrasena: 'admin123',
  fecha_nacimiento: '',
  tipo: 'Administrador',
  region: 'Región Metropolitana',
  comuna: 'Santiago',
  direccion: 'Casa Matriz Tecno Factory',
}

export function obtenerUsuarios() {
  const data = localStorage.getItem(STORAGE_KEYS.usuarios)
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify([USUARIO_ADMIN_BASE]))
    return [USUARIO_ADMIN_BASE]
  }
  const usuarios = JSON.parse(data)

  // Migración: versiones antiguas guardaron el admin con un correo
  // @tecnofactory.cl que el login rechaza; lo actualizamos.
  let seModifico = false
  usuarios.forEach((u) => {
    if (
      u.id === 1 &&
      u.tipo === 'Administrador' &&
      u.correo !== USUARIO_ADMIN_BASE.correo &&
      u.correo.toLowerCase().includes('@tecnofactory.cl')
    ) {
      u.correo = USUARIO_ADMIN_BASE.correo
      if (!u.contrasena) u.contrasena = USUARIO_ADMIN_BASE.contrasena
      seModifico = true
    }
  })

  // Siempre debe existir al menos un Administrador.
  if (!usuarios.some((u) => u.tipo === 'Administrador')) {
    usuarios.push(USUARIO_ADMIN_BASE)
    seModifico = true
  }

  if (seModifico) localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios))
  return usuarios
}

/** ¿Ya existe un usuario con ese correo? (sin distinguir mayúsculas) */
export function correoYaRegistrado(correo, idExcluir) {
  const normalizado = (correo || '').trim().toLowerCase()
  return obtenerUsuarios().some(
    (u) => u.correo.trim().toLowerCase() === normalizado && u.id !== idExcluir,
  )
}

export function guardarUsuario(usuario) {
  const usuarios = obtenerUsuarios()
  usuarios.push({ ...usuario, id: Date.now() })
  localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios))
}

/** Inicia sesión. Devuelve el usuario (sin contraseña) o null si no coincide. */
export function iniciarSesion(correo, contrasena) {
  const correoNormalizado = (correo || '').trim().toLowerCase()
  const contrasenaNormalizada = (contrasena || '').trim()
  const usuario = obtenerUsuarios().find(
    (u) =>
      u.correo.trim().toLowerCase() === correoNormalizado &&
      (u.contrasena || '').trim() === contrasenaNormalizada,
  )
  if (!usuario) return null
  const { contrasena: _omitida, ...sesion } = usuario
  localStorage.setItem(STORAGE_KEYS.sesion, JSON.stringify(sesion))
  return sesion
}

export function obtenerSesion() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.sesion)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function cerrarSesion() {
  localStorage.removeItem(STORAGE_KEYS.sesion)
}

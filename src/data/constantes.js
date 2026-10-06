// Constantes compartidas por toda la tienda (cliente).

// Un ícono simple por categoría, para cuando no hay imagen (o no carga).
// Las categorías nuevas usan el ícono genérico 📦.
export const ICONOS_CATEGORIA = {
  Notebooks: '💻',
  Audio: '🎧',
  Accesorios: '🖱️',
  Monitores: '🖥️',
  Almacenamiento: '💾',
  Smartphones: '📱',
}

// Solo se aceptan estos dominios de correo (criterio de la pauta).
export const DOMINIOS_PERMITIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com']

// Claves de localStorage. Son las MISMAS que usa el panel de
// administración (public/admin), así ambos comparten los datos.
export const STORAGE_KEYS = {
  productos: 'tf_productos',
  carrito: 'tf_cart',
  usuarios: 'tf_usuarios',
  sesion: 'tf_sesion',
  categorias: 'tf_categorias',
  ordenes: 'tf_ordenes',
}

// Tipos de usuario (roles) del sistema.
export const ROLES = {
  admin: 'Administrador',
  vendedor: 'Vendedor',
  cliente: 'Cliente',
}
export const TIPOS_USUARIO = [ROLES.admin, ROLES.vendedor, ROLES.cliente]

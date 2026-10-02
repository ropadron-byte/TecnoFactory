// Constantes compartidas por toda la tienda (cliente).

// Categorías disponibles: se usan en los filtros del catálogo.
export const CATEGORIAS = ['Notebooks', 'Audio', 'Accesorios', 'Monitores', 'Almacenamiento', 'Smartphones']

// Un ícono simple por categoría, para cuando un producto no tiene imagen
// (o su imagen no carga).
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
}

// Tipos de usuario (roles) del sistema.
export const ROLES = {
  admin: 'Administrador',
  vendedor: 'Vendedor',
  cliente: 'Cliente',
}
export const TIPOS_USUARIO = [ROLES.admin, ROLES.vendedor, ROLES.cliente]

import { PRODUCTOS_INICIALES } from '../data/productosIniciales'
import { ICONOS_CATEGORIA, STORAGE_KEYS } from '../data/constantes'

/** Devuelve el catálogo actual. La primera vez (sin nada guardado) lo
 * llena con PRODUCTOS_INICIALES. El panel de administración escribe en
 * la misma clave de localStorage, así que sus cambios se ven acá. */
export function obtenerProductos() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.productos)
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.productos, JSON.stringify(PRODUCTOS_INICIALES))
      return PRODUCTOS_INICIALES
    }
    return JSON.parse(data)
  } catch (e) {
    console.error('No se pudo leer el catálogo:', e)
    return PRODUCTOS_INICIALES
  }
}

/** Busca un producto por su código. */
export function obtenerProductoPorCodigo(codigo) {
  return obtenerProductos().find((p) => p.codigo === codigo)
}

/** Ícono asociado a una categoría (o uno genérico si no la reconoce). */
export function iconoCategoria(categoria) {
  return ICONOS_CATEGORIA[categoria] || '📦'
}

/** Arreglo de URLs de imágenes de un producto. Soporta el campo nuevo
 * "urls" (arreglo) y el antiguo "imagen" (una sola URL). */
export function imagenesProducto(producto) {
  if (Array.isArray(producto.urls)) {
    return producto.urls.filter((u) => u && u.trim().length > 0)
  }
  if (producto.imagen) return [producto.imagen]
  return []
}

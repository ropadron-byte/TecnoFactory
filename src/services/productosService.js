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
    return completarDescuentos(JSON.parse(data))
  } catch (e) {
    console.error('No se pudo leer el catálogo:', e)
    return PRODUCTOS_INICIALES
  }
}

function guardarProductos(productos) {
  localStorage.setItem(STORAGE_KEYS.productos, JSON.stringify(productos))
}

/** Migración: catálogos guardados antes de existir las ofertas no tienen el
 * campo "descuento". Se completa con el del catálogo inicial (o 0). */
function completarDescuentos(productos) {
  if (productos.every((p) => p.descuento !== undefined)) return productos
  const completos = productos.map((p) =>
    p.descuento !== undefined
      ? p
      : { ...p, descuento: PRODUCTOS_INICIALES.find((i) => i.codigo === p.codigo)?.descuento ?? 0 },
  )
  guardarProductos(completos)
  return completos
}

/** ¿El stock llegó al nivel crítico (o se agotó)? */
export function esStockCritico(producto) {
  return producto.stock <= (Number(producto.stockCritico) || 0)
}

/** Descuenta del inventario lo vendido. `items`: [{ codigo, qty }]. */
export function descontarStock(items) {
  const productos = obtenerProductos()
  guardarProductos(
    productos.map((p) => {
      const vendido = items.find((i) => i.codigo === p.codigo)
      return vendido ? { ...p, stock: Math.max(0, p.stock - vendido.qty) } : p
    }),
  )
}

/** Agrega un producto nuevo al catálogo. */
export function guardarProducto(producto) {
  guardarProductos([...obtenerProductos(), producto])
}

/** Actualiza un producto existente (se busca por su código, que no cambia). */
export function actualizarProducto(codigo, datosNuevos) {
  const productos = obtenerProductos()
  if (!productos.some((p) => p.codigo === codigo)) return
  guardarProductos(productos.map((p) => (p.codigo === codigo ? { ...p, ...datosNuevos } : p)))
}

/** Elimina un producto del catálogo por su código. */
export function eliminarProducto(codigo) {
  guardarProductos(obtenerProductos().filter((p) => p.codigo !== codigo))
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

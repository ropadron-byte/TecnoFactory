import { CATEGORIAS_INICIALES } from '../data/categoriasIniciales'
import { STORAGE_KEYS } from '../data/constantes'
import { slugify } from '../utils/texto'
import { obtenerProductos } from './productosService'

function guardarCategorias(categorias) {
  localStorage.setItem(STORAGE_KEYS.categorias, JSON.stringify(categorias))
}

/** Lista de categorías. La primera vez se llena con las iniciales. */
export function obtenerCategorias() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.categorias)
    if (!data) {
      guardarCategorias(CATEGORIAS_INICIALES)
      return CATEGORIAS_INICIALES
    }
    return JSON.parse(data)
  } catch (e) {
    console.error('No se pudieron leer las categorías:', e)
    return CATEGORIAS_INICIALES
  }
}

export const obtenerCategoriaPorId = (id) => obtenerCategorias().find((c) => c.id === id)
export const obtenerCategoriaPorSlug = (slug) => obtenerCategorias().find((c) => slugify(c.nombre) === slug)

/** ¿Ya existe otra categoría con ese nombre? (sin distinguir mayúsculas ni tildes) */
export function nombreCategoriaOcupado(nombre, idExcluir) {
  const buscado = slugify(nombre)
  return obtenerCategorias().some((c) => c.id !== idExcluir && slugify(c.nombre) === buscado)
}

export function contarProductosDeCategoria(nombre) {
  return obtenerProductos().filter((p) => p.categoria === nombre).length
}

export function guardarCategoria({ nombre, descripcion = '', imagen = '' }) {
  const categorias = obtenerCategorias()
  const id = categorias.reduce((max, c) => Math.max(max, c.id), 0) + 1
  guardarCategorias([...categorias, { id, nombre, descripcion, imagen }])
  return id
}

/** Actualiza una categoría. Si cambia el nombre, los productos que la usan
 * pasan al nombre nuevo (si no, quedarían "huérfanos"). */
export function actualizarCategoria(id, datos) {
  const categorias = obtenerCategorias()
  const existente = categorias.find((c) => c.id === id)
  if (!existente) return

  guardarCategorias(categorias.map((c) => (c.id === id ? { ...c, ...datos } : c)))

  if (datos.nombre && datos.nombre !== existente.nombre) {
    const productos = obtenerProductos().map((p) =>
      p.categoria === existente.nombre ? { ...p, categoria: datos.nombre } : p,
    )
    localStorage.setItem(STORAGE_KEYS.productos, JSON.stringify(productos))
  }
}

/** Elimina una categoría si no tiene productos. Devuelve { ok, message }. */
export function eliminarCategoria(id) {
  const categoria = obtenerCategoriaPorId(id)
  if (!categoria) return { ok: false, message: 'La categoría no existe.' }

  const cantidad = contarProductosDeCategoria(categoria.nombre)
  if (cantidad > 0) {
    return {
      ok: false,
      message: `No se puede eliminar "${categoria.nombre}": tiene ${cantidad} producto(s). Muévelos a otra categoría primero.`,
    }
  }
  guardarCategorias(obtenerCategorias().filter((c) => c.id !== id))
  return { ok: true, message: 'Categoría eliminada.' }
}

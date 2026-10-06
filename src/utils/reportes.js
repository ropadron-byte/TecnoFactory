import { esStockCritico } from '../services/productosService'
import { precioFinal, tieneOferta } from './precios'

// Cálculos de los reportes y del dashboard. Son funciones puras: reciben
// arreglos (productos, órdenes, usuarios) y devuelven números / filas.

export function resumenInventario(productos) {
  return {
    totalProductos: productos.length,
    unidades: productos.reduce((s, p) => s + p.stock, 0),
    valorInventario: productos.reduce((s, p) => s + precioFinal(p) * p.stock, 0),
    criticos: productos.filter(esStockCritico).length,
    sinStock: productos.filter((p) => p.stock <= 0).length,
    enOferta: productos.filter(tieneOferta).length,
  }
}

export function inventarioPorCategoria(productos, categorias) {
  return categorias.map((c) => {
    const delGrupo = productos.filter((p) => p.categoria === c.nombre)
    return {
      categoria: c.nombre,
      productos: delGrupo.length,
      unidades: delGrupo.reduce((s, p) => s + p.stock, 0),
      valor: delGrupo.reduce((s, p) => s + precioFinal(p) * p.stock, 0),
    }
  })
}

export const ordenesPagadas = (ordenes) => ordenes.filter((o) => o.estado === 'Pagada')

export function resumenVentas(ordenes) {
  const pagadas = ordenesPagadas(ordenes)
  const totalVendido = pagadas.reduce((s, o) => s + o.total, 0)
  return {
    pagadas: pagadas.length,
    fallidas: ordenes.filter((o) => o.estado === 'Fallida').length,
    totalVendido,
    ticketPromedio: pagadas.length ? Math.round(totalVendido / pagadas.length) : 0,
    unidades: pagadas.reduce((s, o) => s + o.items.reduce((u, i) => u + i.qty, 0), 0),
  }
}

/** Productos vendidos (solo órdenes pagadas), de más a menos unidades. */
export function ventasPorProducto(ordenes) {
  const mapa = new Map()
  for (const orden of ordenesPagadas(ordenes)) {
    for (const item of orden.items) {
      const actual = mapa.get(item.codigo) ?? { codigo: item.codigo, nombre: item.nombre, unidades: 0, total: 0 }
      actual.unidades += item.qty
      actual.total += item.subtotal
      mapa.set(item.codigo, actual)
    }
  }
  return [...mapa.values()].sort((a, b) => b.unidades - a.unidades || b.total - a.total)
}

export function usuariosPorTipo(usuarios) {
  return usuarios.reduce((acc, u) => ({ ...acc, [u.tipo]: (acc[u.tipo] ?? 0) + 1 }), {})
}

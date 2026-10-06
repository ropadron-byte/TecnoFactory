import { STORAGE_KEYS } from '../data/constantes'
import { precioFinal } from '../utils/precios'
import { obtenerUsuarioPorId } from './usuariosService'
import { imagenesProducto, obtenerProductoPorCodigo, obtenerProductos, descontarStock } from './productosService'

// Órdenes de compra (boletas). Cada orden guarda una "foto" de lo comprado
// (nombre y precio al momento de la compra), así el historial no cambia si
// después se edita o elimina el producto.

export function obtenerOrdenes() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ordenes)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const obtenerOrdenPorId = (id) => obtenerOrdenes().find((o) => o.id === id)

function guardarOrdenes(ordenes) {
  localStorage.setItem(STORAGE_KEYS.ordenes, JSON.stringify(ordenes))
}

/** Órdenes de un usuario: las hechas con su sesión o con su mismo correo. */
export function ordenesDeUsuario(usuario) {
  const correo = (usuario.correo || '').trim().toLowerCase()
  return obtenerOrdenes().filter(
    (o) => o.usuarioId === usuario.id || o.cliente.correo.trim().toLowerCase() === correo,
  )
}

const dosDigitos = (n) => String(n).padStart(2, '0')

/** Número de boleta tipo 2026100201 = fecha (aaaammdd) + correlativo del día. */
function generarNumero(fecha, ordenes) {
  const base = `${fecha.getFullYear()}${dosDigitos(fecha.getMonth() + 1)}${dosDigitos(fecha.getDate())}`
  const delDia = ordenes.filter((o) => String(o.numero).startsWith(base)).length
  return `${base}${dosDigitos(delDia + 1)}`
}

/** Convierte el carrito en líneas de orden (con el precio final de hoy). */
export function itemsDeCarrito(carrito) {
  return carrito
    .map(({ codigo, qty }) => {
      const p = obtenerProductoPorCodigo(codigo)
      if (!p) return null
      const precio = precioFinal(p)
      return { codigo, nombre: p.nombre, imagen: imagenesProducto(p)[0] ?? '', precio, qty, subtotal: precio * qty }
    })
    .filter(Boolean)
}

/**
 * Si hay un usuario con sesión, completa automáticamente (solo lo que falte)
 * los datos del cliente y de la dirección de entrega con los de su cuenta.
 */
export function completarConUsuario(usuarioId, cliente, entrega) {
  const u = usuarioId == null ? null : obtenerUsuarioPorId(usuarioId)
  if (!u) return { cliente, entrega }
  const vacio = (v) => !String(v ?? '').trim()
  const conDireccion = entrega.tipo === 'domicilio'
  return {
    cliente: {
      nombre: vacio(cliente.nombre) ? u.nombre || '' : cliente.nombre,
      apellidos: vacio(cliente.apellidos) ? u.apellidos || '' : cliente.apellidos,
      correo: vacio(cliente.correo) ? u.correo || '' : cliente.correo,
    },
    entrega: {
      ...entrega,
      calle: conDireccion && vacio(entrega.calle) ? u.direccion || '' : entrega.calle,
      region: conDireccion && vacio(entrega.region) ? u.region || '' : entrega.region,
      comuna: conDireccion && vacio(entrega.comuna) ? u.comuna || '' : entrega.comuna,
    },
  }
}

/**
 * Procesa la compra (simulada: no hay pasarela de pago real).
 *  - Verifica el stock de cada producto.
 *  - `resultadoPago`: 'exitoso' | 'rechazado' (lo elige el cliente en la demo).
 *  - Siempre registra la orden; solo si el pago es exitoso descuenta el stock.
 * Devuelve { ok:true, orden } o { ok:false, motivo:'stock'|'vacio', message }.
 */
export function procesarCompra({ carrito, cliente: clienteForm, entrega: entregaForm, usuarioId = null, resultadoPago = 'exitoso' }) {
  const { cliente, entrega } = completarConUsuario(usuarioId, clienteForm, entregaForm)
  const items = itemsDeCarrito(carrito)
  if (items.length === 0) return { ok: false, motivo: 'vacio', message: 'Tu carrito está vacío.' }

  const productos = obtenerProductos()
  for (const item of items) {
    const stock = productos.find((p) => p.codigo === item.codigo)?.stock ?? 0
    if (item.qty > stock) {
      return {
        ok: false,
        motivo: 'stock',
        message: `No hay stock suficiente de "${item.nombre}" (disponible: ${stock}). Ajusta la cantidad en tu carrito.`,
      }
    }
  }

  const ordenes = obtenerOrdenes()
  const ahora = new Date()
  const id = ordenes.reduce((max, o) => Math.max(max, o.id), 0) + 1
  const pagada = resultadoPago !== 'rechazado'

  const orden = {
    id,
    numero: generarNumero(ahora, ordenes),
    codigo: `ORDER${String(id).padStart(5, '0')}`,
    fecha: ahora.toISOString(),
    estado: pagada ? 'Pagada' : 'Fallida',
    usuarioId,
    cliente,
    entrega,
    items,
    total: items.reduce((s, i) => s + i.subtotal, 0),
  }

  guardarOrdenes([...ordenes, orden])
  if (pagada) descontarStock(items)
  return { ok: true, orden }
}

import { DOMINIOS_PERMITIDOS } from '../data/constantes'

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Valida un RUN chileno (con o sin puntos/guion) usando el dígito verificador. */
export function validarRun(run) {
  run = String(run ?? '').replace(/[^0-9kK]/g, '').toUpperCase()
  if (run.length < 7 || run.length > 9) return false
  const cuerpo = run.slice(0, -1)
  const dv = run.slice(-1)
  let suma = 0
  let multiplo = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += multiplo * parseInt(cuerpo[i], 10)
    multiplo = multiplo < 7 ? multiplo + 1 : 2
  }
  const resto = 11 - (suma % 11)
  const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto)
  return dv === dvEsperado
}

/** ¿El correo tiene formato válido y un dominio permitido? (máx. 100 caracteres) */
export function correoValido(valor) {
  const correo = String(valor ?? '').trim()
  if (correo.length > 100 || !FORMATO_CORREO.test(correo)) return false
  const dominio = correo.split('@')[1].toLowerCase()
  return DOMINIOS_PERMITIDOS.includes(dominio)
}

/** La contraseña debe tener entre 4 y 10 caracteres. */
export function contrasenaValida(valor) {
  const largo = String(valor ?? '').length
  return largo >= 4 && largo <= 10
}

// ---------- Productos (panel de administración) ----------

/**
 * Valida los datos de un producto tal como vienen del formulario
 * (todo como texto). Devuelve un objeto { campo: true/false }.
 * `codigoDisponible` indica si el código no está ya en uso.
 */
export function validarProducto(v, { codigoDisponible = true, validarCodigo = true } = {}) {
  const precio = parseFloat(v.precio)
  const stock = Number(v.stock)
  const critico = Number(v.stockCritico)
  const vacio = (x) => String(x ?? '').trim() === ''

  const resultado = {
    nombre: v.nombre.trim().length > 0 && v.nombre.trim().length <= 100,
    descripcion: v.descripcion.trim().length <= 500,
    precio: !vacio(v.precio) && !Number.isNaN(precio) && precio >= 0,
    stock: !vacio(v.stock) && Number.isInteger(stock) && stock >= 0,
    stockCritico: vacio(v.stockCritico) || (Number.isInteger(critico) && critico >= 0),
    categoria: v.categoria.length > 0,
    // Opcional: porcentaje entero entre 0 y 100 (0 = sin oferta)
    descuento: vacio(v.descuento) || (Number.isInteger(Number(v.descuento)) && Number(v.descuento) >= 0 && Number(v.descuento) <= 100),
  }
  if (validarCodigo) resultado.codigo = v.codigo.trim().length >= 3 && codigoDisponible
  return resultado
}

// ---------- Checkout ----------

/**
 * Valida el formulario de compra. Si la entrega es "retiro en tienda" no se
 * exige dirección. Devuelve un objeto { campo: true/false }.
 */
export function validarCheckout(v) {
  const conDireccion = v.entrega === 'domicilio'
  const largo = (texto, max) => texto.trim().length > 0 && texto.trim().length <= max
  return {
    nombre: largo(v.nombre, 50),
    apellidos: largo(v.apellidos, 100),
    correo: correoValido(v.correo),
    calle: !conDireccion || largo(v.calle, 150),
    departamento: v.departamento.trim().length <= 30,
    region: !conDireccion || v.region.length > 0,
    comuna: !conDireccion || v.comuna.length > 0,
    indicaciones: v.indicaciones.trim().length <= 300,
  }
}

// ---------- Categorías ----------

export function validarCategoria(v, { nombreDisponible = true } = {}) {
  return {
    nombre: v.nombre.trim().length > 0 && v.nombre.trim().length <= 40 && nombreDisponible,
    descripcion: v.descripcion.trim().length <= 200,
    imagen: v.imagen.trim().length <= 500,
  }
}

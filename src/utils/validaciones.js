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

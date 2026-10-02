import { describe, expect, it } from 'vitest'
import { contrasenaValida, correoValido, validarRun } from '../utils/validaciones'
import { formatCLP } from '../utils/formato'

describe('validaciones', () => {
  it('valida el RUN con dígito verificador', () => {
    expect(validarRun('190110222')).toBe(true)
    expect(validarRun('19011022-2')).toBe(true)
    expect(validarRun('190110228')).toBe(false)
    expect(validarRun('123')).toBe(false)
  })

  it('solo acepta dominios permitidos', () => {
    expect(correoValido('ana@gmail.com')).toBe(true)
    expect(correoValido('ana@duoc.cl')).toBe(true)
    expect(correoValido('ana@profesor.duoc.cl')).toBe(true)
    expect(correoValido('ana@hotmail.com')).toBe(false)
    expect(correoValido('sin-arroba')).toBe(false)
  })

  it('la contraseña debe tener entre 4 y 10 caracteres', () => {
    expect(contrasenaValida('abc')).toBe(false)
    expect(contrasenaValida('abcd')).toBe(true)
    expect(contrasenaValida('12345678901')).toBe(false)
  })

  it('formatea pesos chilenos', () => {
    expect(formatCLP(549990)).toMatch(/^\$549\.990$/)
  })
})

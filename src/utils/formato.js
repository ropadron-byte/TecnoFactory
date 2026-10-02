/** Formatea un número como precio en pesos chilenos: 549990 -> $549.990 */
export function formatCLP(valor) {
  return '$' + Number(valor).toLocaleString('es-CL')
}

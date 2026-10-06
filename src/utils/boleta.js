import { formatCLP } from './formato'

/** Texto plano de la boleta (para el cuerpo del correo). */
export function textoBoleta(orden) {
  const lineas = [
    `Boleta de compra N° ${orden.numero} (${orden.codigo})`,
    `Fecha: ${new Date(orden.fecha).toLocaleString('es-CL')}`,
    '',
    `Cliente: ${orden.cliente.nombre} ${orden.cliente.apellidos}`,
    orden.entrega.tipo === 'retiro'
      ? 'Entrega: Retiro en tienda'
      : `Entrega: ${orden.entrega.calle}${orden.entrega.departamento ? ', ' + orden.entrega.departamento : ''}, ${orden.entrega.comuna}, ${orden.entrega.region}`,
    '',
    'Detalle:',
    ...orden.items.map((i) => `- ${i.nombre} x${i.qty}: ${formatCLP(i.subtotal)}`),
    '',
    `Total pagado: ${formatCLP(orden.total)}`,
    '',
    'Gracias por comprar en Tecno Factory.',
  ]
  return lineas.join('\n')
}

/** Enlace mailto: que abre el correo del usuario con la boleta ya escrita. */
export function mailtoBoleta(orden) {
  const asunto = `Boleta de compra N° ${orden.numero} - Tecno Factory`
  // El correo ya fue validado en el checkout, por eso va tal cual.
  return `mailto:${orden.cliente.correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(textoBoleta(orden))}`
}

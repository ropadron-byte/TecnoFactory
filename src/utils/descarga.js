// Utilidades para exportar reportes a CSV desde el navegador.

const comillas = (valor) => `"${String(valor ?? '').replace(/"/g, '""')}"`

/** Convierte filas (arreglo de objetos) a texto CSV. `columnas`: [{ clave, titulo }]. */
export function aCSV(filas, columnas) {
  const encabezado = columnas.map((c) => comillas(c.titulo)).join(',')
  const cuerpo = filas.map((f) => columnas.map((c) => comillas(f[c.clave])).join(','))
  return [encabezado, ...cuerpo].join('\n')
}

/** Descarga un texto como archivo (con BOM para que Excel respete las tildes). */
export function descargarArchivo(nombre, contenido, tipo = 'text/csv;charset=utf-8') {
  const blob = new Blob(['\uFEFF' + contenido], { type: tipo })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombre
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

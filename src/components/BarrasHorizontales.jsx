import { ProgressBar } from 'react-bootstrap'

// Barras horizontales con ProgressBar de Bootstrap.
// filas: [{ etiqueta, valor, texto }]  (texto = lo que se muestra al final de la barra)
export default function BarrasHorizontales({ filas, vacio = 'Sin datos para mostrar.' }) {
  const maximo = Math.max(...filas.map((f) => f.valor), 0)
  if (filas.length === 0 || maximo === 0) return <p className="text-body-secondary mb-0">{vacio}</p>

  return (
    <div className="vstack gap-2">
      {filas.map((f) => (
        <div className="row align-items-center g-2 small bars__row" key={f.etiqueta}>
          <div className="col-12 col-sm-3 text-truncate">{f.etiqueta}</div>
          <div className="col">
            <ProgressBar now={(f.valor / maximo) * 100} style={{ height: 14 }} aria-label={f.etiqueta} />
          </div>
          <div className="col-12 col-sm-3 text-sm-end text-body-secondary">{f.texto ?? f.valor}</div>
        </div>
      ))}
    </div>
  )
}

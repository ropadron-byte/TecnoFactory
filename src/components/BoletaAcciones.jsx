import { mailtoBoleta } from '../utils/boleta'

// Botones de la boleta: imprimir / guardar en PDF y enviar por correo.
// "Imprimir" abre el diálogo del navegador (ahí se elige "Guardar como PDF").
// "Enviar por email" abre el cliente de correo con la boleta ya escrita.
export default function BoletaAcciones({ orden }) {
  return (
    <div className="d-flex flex-wrap justify-content-center gap-2 mt-3 no-print">
      <button type="button" className="btn btn-danger btn-sm" onClick={() => window.print()}>
        Imprimir boleta en PDF
      </button>
      <a className="btn btn-warning btn-sm" href={mailtoBoleta(orden)}>
        Enviar boleta por email
      </a>
    </div>
  )
}

import { Fragment } from 'react'

// Lista de pares etiqueta / valor ( [['Nombre', 'Ana'], ...] ).
export default function ListaDatos({ filas }) {
  return (
    <dl className="row mb-0">
      {filas.map(([etiqueta, valor]) => (
        <Fragment key={etiqueta}>
          <dt className="col-sm-4 fw-normal text-body-secondary">{etiqueta}</dt>
          <dd className="col-sm-8">{valor === '' || valor == null ? '—' : valor}</dd>
        </Fragment>
      ))}
    </dl>
  )
}

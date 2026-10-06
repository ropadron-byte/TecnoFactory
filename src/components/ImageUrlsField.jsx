import { useState } from 'react'

// Vista previa chica: no se muestra si la URL está vacía o la imagen falla.
function Preview({ url }) {
  const [fallo, setFallo] = useState(false)
  if (url.trim() === '' || fallo) return null
  return (
    <span className="input-group-text p-1">
      <img src={url.trim()} alt="Vista previa" width="36" height="36" className="object-fit-cover rounded" onError={() => setFallo(true)} />
    </span>
  )
}

/**
 * Campo de una o varias URLs de imagen, con vista previa y botón para
 * quitar cada fila. `value` es un arreglo de strings (una fila por URL).
 */
export default function ImageUrlsField({ value, onChange }) {
  const filas = value.length > 0 ? value : ['']

  const cambiar = (i, url) => onChange(filas.map((f, idx) => (idx === i ? url : f)))
  const quitar = (i) => onChange(filas.filter((_, idx) => idx !== i))
  const agregar = () => onChange([...filas, ''])

  return (
    <div className="mb-3">
      <label htmlFor="imagen-0" className="form-label fw-semibold">
        Imágenes del producto
      </label>
      <div className="form-text mt-0 mb-2">Opcional. Pega la URL de cada imagen; puedes añadir una o varias.</div>
      {filas.map((url, i) => (
        <div className="input-group mb-2" key={i}>
          <input
            id={'imagen-' + i}
            type="text"
            className="form-control"
            placeholder="https://..."
            value={url}
            onChange={(e) => cambiar(i, e.target.value)}
          />
          {/* `key={url}` reinicia el estado de error al cambiar la URL */}
          <Preview key={url} url={url} />
          <button type="button" className="btn btn-outline-danger" aria-label="Quitar esta imagen" onClick={() => quitar(i)}>
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-outline-primary btn-sm" onClick={agregar}>
        + Añadir otra imagen
      </button>
    </div>
  )
}

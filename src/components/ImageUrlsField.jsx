import { useState } from 'react'

// Vista previa chica: se oculta si la URL está vacía o la imagen falla.
function Preview({ url }) {
  const [fallo, setFallo] = useState(false)
  const visible = url.trim() !== '' && !fallo
  return (
    <img
      className={'image-preview' + (visible ? ' show' : '')}
      src={url.trim() || undefined}
      alt="Vista previa"
      onError={() => setFallo(true)}
    />
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
    <div className="field" id="field-imagenes">
      <label htmlFor="imagen-0">Imágenes del producto</label>
      <span className="hint">Opcional. Pega la URL de cada imagen; puedes añadir una o varias.</span>
      <div className="image-inputs">
        {filas.map((url, i) => (
          <div className="image-input-row" key={i}>
            <input
              id={'imagen-' + i}
              type="text"
              className="imagen-url"
              placeholder="https://..."
              value={url}
              onChange={(e) => cambiar(i, e.target.value)}
            />
            {/* `key={url}` reinicia el estado de error al cambiar la URL */}
            <Preview key={url} url={url} />
            <button type="button" className="btn ghost small btn-quitar-imagen" aria-label="Quitar esta imagen" onClick={() => quitar(i)}>
              ✕
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="btn ghost small" onClick={agregar}>
        + Añadir otra imagen
      </button>
    </div>
  )
}

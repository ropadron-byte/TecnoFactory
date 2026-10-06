import { useState } from 'react'
import { iconoCategoria } from '../services/productosService'

// Muestra una imagen de producto; si no hay URL o falla la carga, cae
// al ícono de la categoría (en vez del ícono roto del navegador).
export default function ProductImage({ url, alt, categoria, iconSize = '3rem' }) {
  const [fallo, setFallo] = useState(false)

  if (!url || fallo) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ fontSize: iconSize }}>
        {iconoCategoria(categoria)}
      </div>
    )
  }
  return <img src={url} alt={alt} loading="lazy" className="object-fit-contain p-2" onError={() => setFallo(true)} />
}

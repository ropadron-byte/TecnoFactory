import { useState } from 'react'
import { iconoCategoria } from '../services/productosService'

// Muestra una imagen de producto; si no hay URL o falla la carga, cae
// al ícono de la categoría (en vez del ícono roto del navegador).
export default function ProductImage({ url, alt, categoria, iconSize = '3rem' }) {
  const [fallo, setFallo] = useState(false)

  if (!url || fallo) {
    return (
      <div
        style={{
          fontSize: iconSize,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {iconoCategoria(categoria)}
      </div>
    )
  }
  return <img src={url} alt={alt} loading="lazy" onError={() => setFallo(true)} />
}

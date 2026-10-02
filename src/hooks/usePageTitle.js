import { useEffect } from 'react'

/** Cambia el título de la pestaña: "Título — Tecno Factory" (el sufijo se puede cambiar). */
export default function usePageTitle(titulo, sufijo = 'Tecno Factory') {
  useEffect(() => {
    document.title = titulo ? `${titulo} — ${sufijo}` : sufijo
  }, [titulo, sufijo])
}

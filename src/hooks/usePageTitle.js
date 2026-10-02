import { useEffect } from 'react'

/** Cambia el título de la pestaña: "Título — Tecno Factory". */
export default function usePageTitle(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} — Tecno Factory` : 'Tecno Factory'
  }, [titulo])
}

import { useAdminUI } from '../context/AdminUIContext.jsx'

// Encabezado de cada página del panel: botón "☰" (solo mobile) + título.
export default function AdminHeader({ titulo, children }) {
  const { alternarMenu } = useAdminUI()
  return (
    <header className="d-flex align-items-center gap-3 mb-4">
      <button type="button" className="btn btn-outline-secondary d-lg-none" aria-label="Abrir menú del panel" onClick={alternarMenu}>
        ☰
      </button>
      <h1 className="h2 fw-bold mb-0 me-auto">{titulo}</h1>
      {children}
    </header>
  )
}

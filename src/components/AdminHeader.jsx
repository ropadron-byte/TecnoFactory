import { useAdminUI } from '../context/AdminUIContext.jsx'

// Encabezado de cada página del panel: botón "☰" (solo mobile) + título.
export default function AdminHeader({ titulo, children }) {
  const { alternarMenu } = useAdminUI()
  return (
    <header className="admin-header">
      <button type="button" className="admin-toggle" aria-label="Abrir menú del panel" onClick={alternarMenu}>
        ☰
      </button>
      <h1>{titulo}</h1>
      {children}
    </header>
  )
}

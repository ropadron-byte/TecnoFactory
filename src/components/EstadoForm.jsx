import { Alert } from 'react-bootstrap'

// Mensaje de resultado de un formulario: { tipo: 'success' | 'error', texto }.
export default function EstadoForm({ estado, className = 'mt-3' }) {
  if (!estado) return null
  return (
    <Alert variant={estado.tipo === 'success' ? 'success' : 'danger'} className={`${className} mb-0`}>
      {estado.texto}
    </Alert>
  )
}

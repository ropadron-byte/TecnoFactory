import { Children, cloneElement } from 'react'

// Campo de formulario con etiqueta, ayuda y mensaje de error (clases de Bootstrap).
// `estado`: 'valid' | 'invalid' | undefined. Se le agregan al control las clases
// form-control / form-select e is-valid / is-invalid.
export default function FormField({ id, label, hint, error, estado, children }) {
  const control = Children.only(children)
  const base = control.type === 'select' ? 'form-select' : 'form-control'
  const className = [base, estado === 'valid' && 'is-valid', estado === 'invalid' && 'is-invalid'].filter(Boolean).join(' ')

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">
        {label}
      </label>
      {hint && <div className="form-text mt-0 mb-1">{hint}</div>}
      {cloneElement(control, { className })}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  )
}

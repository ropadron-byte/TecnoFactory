// Campo de formulario con etiqueta, ayuda y mensaje de error.
// `estado` puede ser 'valid' | 'invalid' | undefined y aplica las clases
// que ya estilizan .field.valid / .field.invalid en tienda.css.
export default function FormField({ id, label, hint, error, estado, children }) {
  return (
    <div className={'field' + (estado ? ' ' + estado : '')} id={'field-' + id}>
      <label htmlFor={id}>{label}</label>
      {hint && <span className="hint">{hint}</span>}
      {children}
      {error && <span className="error-msg">{error}</span>}
    </div>
  )
}

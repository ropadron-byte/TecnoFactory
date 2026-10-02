// Selector de cantidad  [−] [n] [+]  usado en la ficha y en el carrito.
export default function QuantitySelector({ value, min = 1, max, onChange, disabled = false }) {
  const limitar = (n) => {
    if (Number.isNaN(n) || n < min) return min
    return max != null ? Math.min(max, n) : n
  }

  return (
    <div className="qty">
      <button type="button" aria-label="Restar unidad" disabled={disabled} onClick={() => onChange(limitar(value - 1))}>
        −
      </button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => onChange(limitar(parseInt(e.target.value, 10)))}
      />
      <button type="button" aria-label="Sumar unidad" disabled={disabled} onClick={() => onChange(limitar(value + 1))}>
        +
      </button>
    </div>
  )
}

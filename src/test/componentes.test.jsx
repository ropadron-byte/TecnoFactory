import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PrecioProducto from '../components/PrecioProducto.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import QuantitySelector from '../components/QuantitySelector.jsx'
import { CartProvider, useCart } from '../context/CartContext.jsx'

const base = { codigo: 'TF-NB-004', nombre: 'Teclado', categoria: 'Accesorios', precio: 20000, stock: 4, stockCritico: 1 }
const conProveedores = (ui) => (
  <MemoryRouter>
    <CartProvider>{ui}</CartProvider>
  </MemoryRouter>
)

describe('componentes', () => {
  it('renderizado: la grilla muestra todos los elementos de la lista', () => {
    const productos = [base, { ...base, codigo: 'B', nombre: 'Mouse' }, { ...base, codigo: 'C', nombre: 'Parlante' }]
    render(conProveedores(<ProductGrid productos={productos} />))
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.getByText('Parlante')).toBeInTheDocument()
  })

  it('renderizado condicional: el precio tachado y el % aparecen solo con oferta', () => {
    const { rerender, container } = render(<PrecioProducto producto={{ ...base, descuento: 25 }} />)
    expect(screen.getByText('-25%')).toBeInTheDocument()
    expect(container.querySelector('s')).toHaveTextContent('$20.000')
    expect(container.querySelector('p')).toHaveTextContent('$15.000')

    rerender(<PrecioProducto producto={base} />)
    expect(screen.queryByText(/%/)).not.toBeInTheDocument()
    expect(container.querySelector('s')).toBeNull()
  })

  it('renderizado condicional: sin stock no hay botón de compra', () => {
    const { rerender } = render(conProveedores(<ProductCard producto={base} />))
    expect(screen.getByRole('button', { name: 'Añadir al carrito' })).toBeInTheDocument()
    rerender(conProveedores(<ProductCard producto={{ ...base, stock: 0 }} />))
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByText('Sin stock')).toBeInTheDocument()
  })

  it('props: el selector de cantidad respeta el mínimo, el máximo y disabled', () => {
    const onChange = vi.fn()
    const { rerender } = render(<QuantitySelector value={2} max={3} onChange={onChange} />)
    expect(screen.getByRole('spinbutton')).toHaveValue(2)

    fireEvent.click(screen.getByRole('button', { name: 'Sumar unidad' }))
    expect(onChange).toHaveBeenLastCalledWith(3)

    rerender(<QuantitySelector value={3} max={3} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Sumar unidad' }))
    expect(onChange).toHaveBeenLastCalledWith(3) // no pasa del máximo

    rerender(<QuantitySelector value={1} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Restar unidad' }))
    expect(onChange).toHaveBeenLastCalledWith(1) // no baja del mínimo

    rerender(<QuantitySelector value={1} onChange={onChange} disabled />)
    expect(screen.getByRole('button', { name: 'Sumar unidad' })).toBeDisabled()
  })

  it('eventos: el clic en "Añadir al carrito" agrega el producto y actualiza el carrito', () => {
    function Contador() {
      const { totalItems } = useCart()
      return <span data-testid="total">{totalItems}</span>
    }
    render(
      conProveedores(
        <>
          <ProductCard producto={{ ...base, stock: 40 }} />
          <Contador />
        </>,
      ),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }))
    expect(screen.getByRole('button', { name: '¡Añadido!' })).toBeInTheDocument()
    expect(screen.getByTestId('total')).toHaveTextContent('1')
  })
})

import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHead from '../components/PageHead.jsx'
import QuantitySelector from '../components/QuantitySelector.jsx'
import { formatCLP } from '../utils/formato'
import { obtenerProductoPorCodigo } from '../services/productosService'
import { useCart } from '../context/CartContext.jsx'
import usePageTitle from '../hooks/usePageTitle'

export default function Carrito() {
  usePageTitle('Mi carrito')
  const { cart, totalPrice, updateCartQty, removeFromCart, clearCart } = useCart()
  const [pagado, setPagado] = useState(false)

  // Combinamos cada ítem del carrito con los datos actuales del producto.
  const lineas = cart
    .map((item) => ({ item, producto: obtenerProductoPorCodigo(item.codigo) }))
    .filter((l) => l.producto)

  function pagar() {
    // Simulación: no hay pasarela de pago real.
    setPagado(true)
    setTimeout(() => {
      clearCart()
      setPagado(false)
    }, 1200)
  }

  return (
    <>
      <PageHead eyebrow="TF / MI CARRITO" titulo="Mi carrito de compras" />

      <section className="section wrap">
        {lineas.length === 0 && !pagado ? (
          <p style={{ color: 'var(--ink-soft)' }}>
            Tu carrito está vacío. <Link to="/productos">Ver catálogo</Link>.
          </p>
        ) : (
          <div className="product-detail">
            <div className="table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {lineas.map(({ item, producto }) => (
                    <tr key={item.codigo}>
                      <td>{producto.nombre}</td>
                      <td>{formatCLP(producto.precio)}</td>
                      <td>
                        <QuantitySelector
                          value={item.qty}
                          max={producto.stock}
                          onChange={(n) => updateCartQty(item.codigo, n)}
                        />
                      </td>
                      <td>{formatCLP(producto.precio * item.qty)}</td>
                      <td>
                        <button type="button" className="btn ghost small" onClick={() => removeFromCart(item.codigo)}>
                          Quitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="product-info">
              <div className="admin-panel">
                <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 700 }}>
                  <span>Total</span>
                  <span>{formatCLP(totalPrice)}</span>
                </p>
                <button type="button" className="btn accent" style={{ width: '100%', marginTop: 12 }} onClick={pagar}>
                  Pagar
                </button>
                {pagado && (
                  <p className="msg-ok" style={{ marginTop: 10 }}>
                    ¡Gracias por tu compra! (simulación, sin pasarela de pago real)
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  )
}

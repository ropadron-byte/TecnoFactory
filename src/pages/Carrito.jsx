import { Link } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'
import PageHead from '../components/PageHead.jsx'
import QuantitySelector from '../components/QuantitySelector.jsx'
import PrecioProducto from '../components/PrecioProducto.jsx'
import ProductosSugeridos from '../components/ProductosSugeridos.jsx'
import { formatCLP } from '../utils/formato'
import { precioFinal } from '../utils/precios'
import { obtenerProductoPorCodigo } from '../services/productosService'
import { useCart } from '../context/CartContext.jsx'
import usePageTitle from '../hooks/usePageTitle'

export default function Carrito() {
  usePageTitle('Mi carrito')
  const { cart, totalPrice, updateCartQty, removeFromCart, clearCart } = useCart()

  // Combinamos cada ítem del carrito con los datos actuales del producto.
  const lineas = cart
    .map((item) => ({ item, producto: obtenerProductoPorCodigo(item.codigo) }))
    .filter((l) => l.producto)

  return (
    <>
      <PageHead eyebrow="TF / MI CARRITO" titulo="Mi carrito de compras" />

      <Container className="py-4">
        {lineas.length === 0 ? (
          <p className="text-body-secondary">
            Tu carrito está vacío. <Link to="/productos">Ver catálogo</Link>.
          </p>
        ) : (
          <Row className="g-4">
            <Col lg={8}>
              <div className="table-responsive">
                <table className="table align-middle bg-white">
                  <thead className="table-light">
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
                        <td>
                          <PrecioProducto producto={producto} className="mb-0" />
                        </td>
                        <td>
                          <QuantitySelector value={item.qty} max={producto.stock} onChange={(n) => updateCartQty(item.codigo, n)} />
                        </td>
                        <td>{formatCLP(precioFinal(producto) * item.qty)}</td>
                        <td>
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeFromCart(item.codigo)}>
                            Quitar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Col>

            <Col lg={4}>
              <div className="card card-body">
                <p className="d-flex justify-content-between fs-4 fw-bold">
                  <span>Total</span>
                  <span>{formatCLP(totalPrice)}</span>
                </p>
                <Link to="/checkout" className="btn btn-warning w-100">
                  Comprar ahora
                </Link>
                <button type="button" className="btn btn-outline-secondary btn-sm w-100 mt-2" onClick={clearCart}>
                  Limpiar carrito
                </button>
              </div>
              <ProductosSugeridos />
            </Col>
          </Row>
        )}
      </Container>
    </>
  )
}

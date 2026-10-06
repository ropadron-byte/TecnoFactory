import { Link } from 'react-router-dom'
import { Alert, Card, Col, Row } from 'react-bootstrap'
import AdminHeader from '../../components/AdminHeader.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { ROLES } from '../../data/constantes'
import { formatCLP } from '../../utils/formato'
import { resumenInventario, resumenVentas, usuariosPorTipo } from '../../utils/reportes'
import { obtenerProductos } from '../../services/productosService'
import { obtenerOrdenes } from '../../services/ordenesService'
import { obtenerUsuarios } from '../../services/usuariosService'
import usePageTitle from '../../hooks/usePageTitle'

// Accesos rápidos a cada sección del panel. `soloAdmin` los oculta al Vendedor.
const ACCESOS = [
  { to: '/admin/ordenes', icono: '🧾', titulo: 'Órdenes', texto: 'Seguimiento de las compras realizadas y sus boletas.' },
  { to: '/admin/productos', icono: '📦', titulo: 'Productos', texto: 'Inventario y detalle de los productos disponibles.' },
  { to: '/admin/categorias', icono: '🏷️', titulo: 'Categorías', texto: 'Organiza los productos en categorías.', soloAdmin: true },
  { to: '/admin/usuarios', icono: '👤', titulo: 'Usuarios', texto: 'Cuentas de usuario y sus roles dentro del sistema.', soloAdmin: true },
  { to: '/admin/reportes', icono: '📊', titulo: 'Reportes', texto: 'Informes de ventas y de usuarios del sistema.', soloAdmin: true },
  { to: '/admin/perfil', icono: '🙍', titulo: 'Perfil', texto: 'Tus datos personales y tu contraseña.' },
  { to: '/', icono: '🏪', titulo: 'Tienda', texto: 'Visita la tienda tal como la ven tus clientes.' },
]

function StatCard({ variante, titulo, valor, detalle }) {
  return (
    <Card bg={variante} text={variante === 'warning' ? 'dark' : 'white'} className="h-100 border-0">
      <Card.Body>
        <Card.Subtitle className="mb-1">{titulo}</Card.Subtitle>
        <Card.Title as="p" className="display-6 fw-bold mb-1">
          {valor}
        </Card.Title>
        <small>{detalle}</small>
      </Card.Body>
    </Card>
  )
}

// Dashboard: métricas reales calculadas con los datos guardados.
export default function AdminHome() {
  usePageTitle('Panel de administración')
  const { sesion } = useAuth()
  const esAdmin = sesion?.tipo === ROLES.admin

  const inventario = resumenInventario(obtenerProductos())
  const ventas = resumenVentas(obtenerOrdenes())
  const usuarios = obtenerUsuarios()
  const porTipo = usuariosPorTipo(usuarios)

  return (
    <>
      <AdminHeader titulo={sesion ? `¡Hola, ${sesion.nombre}!` : '¡Hola!'}>
        <span className="fs-4" aria-hidden="true">
          🔔
        </span>
      </AdminHeader>

      <section>
        <h2 className="h5 mb-0">Dashboard</h2>
        <p className="text-body-secondary">Resumen de las actividades diarias</p>

        <Row xs={1} md={3} className="g-3 mb-4">
          <Col>
            <StatCard variante="primary" titulo="Compras" valor={ventas.pagadas} detalle={`Total vendido: ${formatCLP(ventas.totalVendido)}`} />
          </Col>
          <Col>
            <StatCard
              variante="success"
              titulo="Productos"
              valor={inventario.totalProductos}
              detalle={`Inventario actual: ${inventario.unidades} unidades`}
            />
          </Col>
          <Col>
            {esAdmin ? (
              <StatCard
                variante="warning"
                titulo="Usuarios"
                valor={usuarios.length}
                detalle={`Clientes: ${porTipo[ROLES.cliente] ?? 0} · Vendedores: ${porTipo[ROLES.vendedor] ?? 0}`}
              />
            ) : (
              <StatCard variante="warning" titulo="Stock crítico" valor={inventario.criticos} detalle="Productos que necesitan reposición" />
            )}
          </Col>
        </Row>

        {inventario.criticos > 0 && (
          <Alert variant="warning">
            ⚠️ Hay {inventario.criticos} producto(s) con stock crítico. <Link to="/admin/productos/criticos">Ver listado</Link>
          </Alert>
        )}

        <Row xs={1} sm={2} xl={4} className="g-3">
          {ACCESOS.filter((a) => esAdmin || !a.soloAdmin).map((a) => (
            <Col key={a.to}>
              <Card as={Link} to={a.to} className="h-100 text-center text-decoration-none text-body shadow-sm">
                <Card.Body>
                  <div className="fs-2" aria-hidden="true">
                    {a.icono}
                  </div>
                  <Card.Title as="strong" className="d-block">
                    {a.titulo}
                  </Card.Title>
                  <small className="text-body-secondary">{a.texto}</small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </>
  )
}

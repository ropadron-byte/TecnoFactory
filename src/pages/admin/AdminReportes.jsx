import AdminHeader from '../../components/AdminHeader.jsx'
import BarrasHorizontales from '../../components/BarrasHorizontales.jsx'
import { formatCLP } from '../../utils/formato'
import { aCSV, descargarArchivo } from '../../utils/descarga'
import { resumenVentas, usuariosPorTipo, ventasPorProducto } from '../../utils/reportes'
import { TIPOS_USUARIO } from '../../data/constantes'
import { obtenerOrdenes } from '../../services/ordenesService'
import { obtenerUsuarios } from '../../services/usuariosService'
import usePageTitle from '../../hooks/usePageTitle'
import ListaDatos from '../../components/ListaDatos.jsx'

// Reportes generales: ventas, productos más vendidos y usuarios por tipo.
export default function AdminReportes() {
  usePageTitle('Reportes', 'Panel Tecno Factory')
  const ordenes = obtenerOrdenes()
  const ventas = resumenVentas(ordenes)
  const masVendidos = ventasPorProducto(ordenes).slice(0, 8)
  const porTipo = usuariosPorTipo(obtenerUsuarios())

  function descargar() {
    descargarArchivo(
      'reporte-ordenes.csv',
      aCSV(
        ordenes.map((o) => ({
          numero: o.numero,
          codigo: o.codigo,
          fecha: o.fecha,
          cliente: `${o.cliente.nombre} ${o.cliente.apellidos}`,
          correo: o.cliente.correo,
          estado: o.estado,
          total: o.total,
        })),
        [
          { clave: 'numero', titulo: 'N° boleta' },
          { clave: 'codigo', titulo: 'Código' },
          { clave: 'fecha', titulo: 'Fecha' },
          { clave: 'cliente', titulo: 'Cliente' },
          { clave: 'correo', titulo: 'Correo' },
          { clave: 'estado', titulo: 'Estado' },
          { clave: 'total', titulo: 'Total' },
        ],
      ),
    )
  }

  const datos = [
    ['Órdenes pagadas', ventas.pagadas],
    ['Órdenes con error de pago', ventas.fallidas],
    ['Unidades vendidas', ventas.unidades],
    ['Total vendido', formatCLP(ventas.totalVendido)],
    ['Ticket promedio', formatCLP(ventas.ticketPromedio)],
  ]

  return (
    <>
      <AdminHeader titulo="Reportes" />

      <section>
        <div className="card card-body mb-3">
          <h2 className="h5">Ventas</h2>
          <ListaDatos filas={datos} />
        </div>

        <div className="card card-body mb-3">
          <h2 className="h5">Productos más vendidos</h2>
          <BarrasHorizontales
            vacio="Todavía no hay ventas registradas."
            filas={masVendidos.map((p) => ({ etiqueta: p.nombre, valor: p.unidades, texto: `${p.unidades} u. · ${formatCLP(p.total)}` }))}
          />
        </div>

        <div className="card card-body mb-3">
          <h2 className="h5">Usuarios por tipo</h2>
          <BarrasHorizontales filas={TIPOS_USUARIO.map((t) => ({ etiqueta: t, valor: porTipo[t] ?? 0 }))} />
        </div>

        <p>
          <button type="button" className="btn btn-warning btn-sm" onClick={descargar}>
            Descargar órdenes en CSV
          </button>
        </p>
      </section>
    </>
  )
}

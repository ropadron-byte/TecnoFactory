import { Link } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader.jsx'
import BarrasHorizontales from '../../components/BarrasHorizontales.jsx'
import { formatCLP } from '../../utils/formato'
import { aCSV, descargarArchivo } from '../../utils/descarga'
import { inventarioPorCategoria, resumenInventario } from '../../utils/reportes'
import { precioFinal } from '../../utils/precios'
import { obtenerProductos } from '../../services/productosService'
import { obtenerCategorias } from '../../services/categoriasService'
import usePageTitle from '../../hooks/usePageTitle'
import ListaDatos from '../../components/ListaDatos.jsx'

// Reporte de inventario: totales, valor por categoría y descarga en CSV.
export default function AdminReportesProductos() {
  usePageTitle('Reporte de productos', 'Panel Tecno Factory')
  const productos = obtenerProductos()
  const resumen = resumenInventario(productos)
  const porCategoria = inventarioPorCategoria(productos, obtenerCategorias())

  function descargar() {
    const filas = productos.map((p) => ({ ...p, precioFinal: precioFinal(p), valor: precioFinal(p) * p.stock }))
    descargarArchivo(
      'reporte-productos.csv',
      aCSV(filas, [
        { clave: 'codigo', titulo: 'Código' },
        { clave: 'nombre', titulo: 'Nombre' },
        { clave: 'categoria', titulo: 'Categoría' },
        { clave: 'precio', titulo: 'Precio' },
        { clave: 'descuento', titulo: 'Descuento %' },
        { clave: 'precioFinal', titulo: 'Precio final' },
        { clave: 'stock', titulo: 'Stock' },
        { clave: 'stockCritico', titulo: 'Stock crítico' },
        { clave: 'valor', titulo: 'Valor en inventario' },
      ]),
    )
  }

  const datos = [
    ['Productos', resumen.totalProductos],
    ['Unidades en inventario', resumen.unidades],
    ['Valor del inventario', formatCLP(resumen.valorInventario)],
    ['Productos en oferta', resumen.enOferta],
    ['Con stock crítico', resumen.criticos],
    ['Sin stock', resumen.sinStock],
  ]

  return (
    <>
      <AdminHeader titulo="Reporte de productos" />

      <section>
        <div className="card card-body mb-3">
          <ListaDatos filas={datos} />
        </div>

        <div className="card card-body mb-3">
          <h2 className="h5">Valor del inventario por categoría</h2>
          <BarrasHorizontales
            filas={porCategoria.map((c) => ({ etiqueta: c.categoria, valor: c.valor, texto: `${formatCLP(c.valor)} · ${c.unidades} u.` }))}
          />
        </div>

        <p className="d-flex flex-wrap gap-2">
          <button type="button" className="btn btn-warning btn-sm" onClick={descargar}>
            Descargar CSV
          </button>
          <Link className="btn btn-outline-primary btn-sm" to="/admin/productos/criticos">
            Ver productos críticos
          </Link>
          <Link className="btn btn-outline-primary btn-sm" to="/admin/productos">
            ← Volver a productos
          </Link>
        </p>
      </section>
    </>
  )
}

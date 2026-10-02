import { useLoaderData, useNavigate } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader.jsx'
import ProductoForm from '../../components/ProductoForm.jsx'
import { actualizarProducto } from '../../services/productosService'
import usePageTitle from '../../hooks/usePageTitle'

export default function AdminEditarProducto() {
  const producto = useLoaderData()
  usePageTitle('Editar producto', 'Panel Tecno Factory')
  const navigate = useNavigate()

  function guardar({ codigo: _codigo, ...cambios }) {
    actualizarProducto(producto.codigo, cambios) // el código no se modifica
    setTimeout(() => navigate('/admin/productos'), 1200)
  }

  return (
    <>
      <AdminHeader titulo="Editar producto" />
      <section>
        <ProductoForm key={producto.codigo} producto={producto} onGuardar={guardar} mensajeExito="Producto actualizado correctamente." />
      </section>
    </>
  )
}

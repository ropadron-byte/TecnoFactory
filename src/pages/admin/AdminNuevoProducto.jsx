import { useNavigate } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader.jsx'
import ProductoForm from '../../components/ProductoForm.jsx'
import { guardarProducto } from '../../services/productosService'
import usePageTitle from '../../hooks/usePageTitle'

export default function AdminNuevoProducto() {
  usePageTitle('Nuevo producto', 'Panel Tecno Factory')
  const navigate = useNavigate()

  function guardar(producto) {
    guardarProducto(producto)
    setTimeout(() => navigate('/admin/productos'), 1200)
  }

  return (
    <>
      <AdminHeader titulo="Nuevo producto" />
      <section>
        <ProductoForm onGuardar={guardar} mensajeExito="Producto guardado correctamente." />
      </section>
    </>
  )
}

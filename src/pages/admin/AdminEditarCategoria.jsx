import { useLoaderData, useNavigate } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader.jsx'
import CategoriaForm from '../../components/CategoriaForm.jsx'
import { actualizarCategoria } from '../../services/categoriasService'
import usePageTitle from '../../hooks/usePageTitle'

export default function AdminEditarCategoria() {
  const categoria = useLoaderData()
  usePageTitle('Editar categoría', 'Panel Tecno Factory')
  const navigate = useNavigate()

  function guardar(datos) {
    actualizarCategoria(categoria.id, datos)
    setTimeout(() => navigate('/admin/categorias'), 1200)
  }

  return (
    <>
      <AdminHeader titulo="Editar categoría" />
      <section>
        <CategoriaForm key={categoria.id} categoria={categoria} onGuardar={guardar} mensajeExito="Categoría actualizada correctamente." />
      </section>
    </>
  )
}

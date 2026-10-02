import { useNavigate } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader.jsx'
import UsuarioForm from '../../components/UsuarioForm.jsx'
import { guardarUsuario } from '../../services/usuariosService'
import usePageTitle from '../../hooks/usePageTitle'

export default function AdminNuevoUsuario() {
  usePageTitle('Nuevo usuario', 'Panel Tecno Factory')
  const navigate = useNavigate()

  function guardar(usuario) {
    guardarUsuario(usuario)
    setTimeout(() => navigate('/admin/usuarios'), 1200)
  }

  return (
    <>
      <AdminHeader titulo="Nuevo usuario" />
      <section>
        <UsuarioForm onGuardar={guardar} mensajeExito="Usuario guardado correctamente." />
      </section>
    </>
  )
}

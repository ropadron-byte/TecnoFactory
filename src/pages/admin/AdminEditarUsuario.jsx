import { useLoaderData, useNavigate } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader.jsx'
import UsuarioForm from '../../components/UsuarioForm.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { actualizarUsuario } from '../../services/usuariosService'
import usePageTitle from '../../hooks/usePageTitle'

export default function AdminEditarUsuario() {
  const usuario = useLoaderData()
  usePageTitle('Editar usuario', 'Panel Tecno Factory')
  const navigate = useNavigate()
  const { sesion, recargarSesion } = useAuth()

  function guardar(datos) {
    actualizarUsuario(usuario.id, datos)
    // Si el administrador se edita a sí mismo, refrescamos su sesión.
    if (sesion?.id === usuario.id) recargarSesion()
    setTimeout(() => navigate('/admin/usuarios'), 1200)
  }

  return (
    <>
      <AdminHeader titulo="Editar usuario" />
      <section>
        <UsuarioForm key={usuario.id} usuario={usuario} onGuardar={guardar} mensajeExito="Usuario actualizado correctamente." />
      </section>
    </>
  )
}

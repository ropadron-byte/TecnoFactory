import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader.jsx'
import { eliminarUsuario, obtenerUsuarios } from '../../services/usuariosService'
import usePageTitle from '../../hooks/usePageTitle'
import EstadoForm from '../../components/EstadoForm.jsx'

export default function AdminUsuarios() {
  usePageTitle('Usuarios', 'Panel Tecno Factory')
  const [usuarios, setUsuarios] = useState(obtenerUsuarios)
  const [aviso, setAviso] = useState(null)

  function eliminar(u) {
    if (!window.confirm(`¿Eliminar al usuario "${u.nombre} ${u.apellidos}"? Esta acción no se puede deshacer.`)) return
    const resultado = eliminarUsuario(u.id)
    setAviso({ tipo: resultado.ok ? 'success' : 'error', texto: resultado.message })
    setUsuarios(obtenerUsuarios())
  }

  return (
    <>
      <AdminHeader titulo="Usuarios" />

      <section>
        <p>
          <Link className="btn btn-warning btn-sm" to="/admin/usuarios/nuevo">
            + Nuevo usuario
          </Link>
        </p>

        <EstadoForm estado={aviso} className="mb-3" />

        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white">
            <thead className="table-light">
              <tr>
                <th>RUN</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Tipo</th>
                <th>Comuna</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan={6}>Aún no hay usuarios registrados.</td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.run}</td>
                    <td>
                      {u.nombre} {u.apellidos}
                    </td>
                    <td>{u.correo}</td>
                    <td>
                      <span className={'badge ' + ({ Administrador: 'text-bg-dark', Vendedor: 'text-bg-info', Cliente: 'text-bg-secondary' }[u.tipo] ?? 'text-bg-light')}>{u.tipo}</span>
                    </td>
                    <td>{u.comuna}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        <Link className="btn btn-outline-primary btn-sm" to={`/admin/usuarios/${u.id}`}>
                          Ver
                        </Link>
                        <Link className="btn btn-outline-primary btn-sm" to={`/admin/usuarios/${u.id}/editar`}>
                          Editar
                        </Link>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => eliminar(u)}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

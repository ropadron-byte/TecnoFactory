import { useState } from 'react'
import { Link } from 'react-router-dom'
import AdminHeader from '../../components/AdminHeader.jsx'
import { eliminarUsuario, obtenerUsuarios } from '../../services/usuariosService'
import usePageTitle from '../../hooks/usePageTitle'

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
          <Link className="btn accent small" to="/admin/usuarios/nuevo">
            + Nuevo usuario
          </Link>
        </p>

        {aviso && <div className={`form-status show admin-flash ${aviso.tipo}`}>{aviso.texto}</div>}

        <div className="table-scroll">
          <table className="admin-table">
            <thead>
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
                      <span className={'badge ' + u.tipo.toLowerCase()}>{u.tipo}</span>
                    </td>
                    <td>{u.comuna}</td>
                    <td className="admin-actions">
                      <Link className="btn ghost small" to={`/admin/usuarios/${u.id}`}>
                        Ver
                      </Link>
                      <Link className="btn ghost small" to={`/admin/usuarios/${u.id}/editar`}>
                        Editar
                      </Link>
                      <button type="button" className="btn ghost small danger" onClick={() => eliminar(u)}>
                        Eliminar
                      </button>
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

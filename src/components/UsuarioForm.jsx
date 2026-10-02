import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from './FormField.jsx'
import RegionComunaFields from './RegionComunaFields.jsx'
import { TIPOS_USUARIO } from '../data/constantes'
import { contrasenaValida, correoValido, validarRun } from '../utils/validaciones'
import { correoYaRegistrado } from '../services/usuariosService'

function valoresIniciales(u) {
  return {
    run: u?.run ?? '',
    nombre: u?.nombre ?? '',
    apellidos: u?.apellidos ?? '',
    correo: u?.correo ?? '',
    contrasena: '',
    fecha_nacimiento: u?.fecha_nacimiento ?? '',
    tipo: u?.tipo ?? '',
    region: u?.region ?? '',
    comuna: u?.comuna ?? '',
    direccion: u?.direccion ?? '',
  }
}

/**
 * Formulario de usuario para crear (sin `usuario`) o editar (con `usuario`).
 * Al editar, la contraseña es opcional: vacía = se conserva la actual.
 */
export default function UsuarioForm({ usuario, onGuardar, mensajeExito, cancelarA = '/admin/usuarios' }) {
  const editando = Boolean(usuario)
  const [v, setV] = useState(() => valoresIniciales(usuario))
  const [enviado, setEnviado] = useState(false)
  const [estado, setEstado] = useState(null)

  const formatoCorreoOk = correoValido(v.correo)
  const correoDuplicado = formatoCorreoOk && correoYaRegistrado(v.correo, usuario?.id)
  const validos = {
    run: validarRun(v.run.trim()),
    nombre: v.nombre.trim().length > 0 && v.nombre.trim().length <= 50,
    apellidos: v.apellidos.trim().length > 0 && v.apellidos.trim().length <= 100,
    correo: formatoCorreoOk && !correoDuplicado,
    // Al editar, dejarla vacía es válido (se mantiene la actual).
    contrasena: editando && v.contrasena.length === 0 ? true : contrasenaValida(v.contrasena),
    tipo: v.tipo.length > 0,
    region: v.region.length > 0,
    comuna: v.comuna.length > 0,
    direccion: v.direccion.trim().length > 0 && v.direccion.trim().length <= 300,
  }
  const marca = (campo) => {
    if (!enviado) return undefined
    if (campo === 'contrasena' && editando && v.contrasena.length === 0) return undefined
    return validos[campo] ? 'valid' : 'invalid'
  }

  function cambiar(e) {
    const { name, value } = e.target
    // Al cambiar de región se limpia la comuna elegida.
    setV((prev) => ({ ...prev, [name]: value, ...(name === 'region' ? { comuna: '' } : {}) }))
  }

  function enviar(e) {
    e.preventDefault()
    setEnviado(true)
    setEstado(null)

    if (!Object.values(validos).every(Boolean)) {
      setEstado({
        tipo: 'error',
        texto: correoDuplicado
          ? `Ya existe ${editando ? 'otro ' : 'un '}usuario registrado con ese correo.`
          : 'Revisa los campos marcados en rojo.',
      })
      return
    }

    onGuardar({
      run: v.run.trim(),
      nombre: v.nombre.trim(),
      apellidos: v.apellidos.trim(),
      correo: v.correo.trim(),
      contrasena: v.contrasena,
      fecha_nacimiento: v.fecha_nacimiento,
      tipo: v.tipo,
      region: v.region,
      comuna: v.comuna,
      direccion: v.direccion.trim(),
    })
    setEstado({ tipo: 'success', texto: mensajeExito })
  }

  return (
    <form className="form" onSubmit={enviar} noValidate>
      <FormField id="run" label="RUN" hint="Sin puntos ni guion. Ej: 190110222" error="RUN inválido, revisa el dígito verificador." estado={marca('run')}>
        <input type="text" id="run" name="run" maxLength={9} value={v.run} onChange={cambiar} />
      </FormField>

      <FormField id="nombre" label="Nombre" error="El nombre es obligatorio (máx. 50 caracteres)." estado={marca('nombre')}>
        <input type="text" id="nombre" name="nombre" maxLength={50} autoComplete="given-name" value={v.nombre} onChange={cambiar} />
      </FormField>

      <FormField id="apellidos" label="Apellidos" error="Los apellidos son obligatorios (máx. 100 caracteres)." estado={marca('apellidos')}>
        <input type="text" id="apellidos" name="apellidos" maxLength={100} autoComplete="family-name" value={v.apellidos} onChange={cambiar} />
      </FormField>

      <FormField
        id="correo"
        label="Correo"
        hint="Solo dominios @duoc.cl, @profesor.duoc.cl o @gmail.com"
        error={
          editando
            ? 'Correo inválido, dominio no permitido, o ya está en uso por otro usuario.'
            : 'Correo inválido, dominio no permitido, o ya está registrado.'
        }
        estado={marca('correo')}
      >
        <input type="email" id="correo" name="correo" maxLength={100} autoComplete="email" value={v.correo} onChange={cambiar} />
      </FormField>

      <FormField
        id="contrasena"
        label={editando ? 'Nueva contraseña' : 'Contraseña'}
        hint={
          editando
            ? 'Opcional. Déjala en blanco para mantener la contraseña actual. Si la cambias, entre 4 y 10 caracteres.'
            : 'Entre 4 y 10 caracteres. El usuario la usará para iniciar sesión.'
        }
        error="La contraseña debe tener entre 4 y 10 caracteres."
        estado={marca('contrasena')}
      >
        <input type="password" id="contrasena" name="contrasena" maxLength={10} autoComplete="new-password" value={v.contrasena} onChange={cambiar} />
      </FormField>

      <FormField id="fecha_nacimiento" label="Fecha de nacimiento" hint="Opcional">
        <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" value={v.fecha_nacimiento} onChange={cambiar} />
      </FormField>

      <FormField id="tipo" label="Tipo de usuario" error="Selecciona un tipo de usuario." estado={marca('tipo')}>
        <select id="tipo" name="tipo" value={v.tipo} onChange={cambiar}>
          <option value="">Selecciona un tipo</option>
          {TIPOS_USUARIO.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </FormField>

      <RegionComunaFields
        region={v.region}
        comuna={v.comuna}
        onChange={cambiar}
        estadoRegion={marca('region')}
        estadoComuna={marca('comuna')}
      />

      <FormField id="direccion" label="Dirección" error="La dirección es obligatoria (máx. 300 caracteres)." estado={marca('direccion')}>
        <input type="text" id="direccion" name="direccion" maxLength={300} autoComplete="street-address" value={v.direccion} onChange={cambiar} />
      </FormField>

      <button type="submit" className="btn accent">
        {editando ? 'Guardar cambios' : 'Guardar usuario'}
      </button>
      {editando && (
        <Link to={cancelarA} className="btn ghost">
          Cancelar
        </Link>
      )}
      <div className={'form-status' + (estado ? ` show ${estado.tipo}` : '')}>{estado?.texto}</div>
    </form>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHead from '../components/PageHead.jsx'
import FormField from '../components/FormField.jsx'
import RegionComunaFields from '../components/RegionComunaFields.jsx'
import { contrasenaValida, correoValido, validarRun } from '../utils/validaciones'
import { correoYaRegistrado, guardarUsuario } from '../services/usuariosService'
import usePageTitle from '../hooks/usePageTitle'

const INICIAL = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  contrasena: '',
  confirmar: '',
  telefono: '',
  fecha_nacimiento: '',
  region: '',
  comuna: '',
  direccion: '',
}

export default function RegistroUsuario() {
  usePageTitle('Crear cuenta')
  const navigate = useNavigate()
  const [v, setV] = useState(INICIAL)
  const [enviado, setEnviado] = useState(false)
  const [estado, setEstado] = useState(null)

  function cambiar(e) {
    const { name, value } = e.target
    // Al cambiar de región se limpia la comuna elegida.
    setV((prev) => ({ ...prev, [name]: value, ...(name === 'region' ? { comuna: '' } : {}) }))
  }

  const formatoCorreoOk = correoValido(v.correo)
  const validos = {
    run: validarRun(v.run.trim()),
    nombre: v.nombre.trim().length > 0 && v.nombre.trim().length <= 50,
    apellidos: v.apellidos.trim().length > 0 && v.apellidos.trim().length <= 100,
    correo: formatoCorreoOk && !correoYaRegistrado(v.correo),
    contrasena: contrasenaValida(v.contrasena),
    confirmar: v.confirmar === v.contrasena && contrasenaValida(v.contrasena),
    region: v.region.length > 0,
    comuna: v.comuna.length > 0,
    direccion: v.direccion.trim().length > 0 && v.direccion.trim().length <= 300,
  }
  const marca = (campo) => (enviado ? (validos[campo] ? 'valid' : 'invalid') : undefined)

  function enviar(e) {
    e.preventDefault()
    setEnviado(true)

    if (Object.values(validos).every(Boolean)) {
      guardarUsuario({
        run: v.run.trim(),
        nombre: v.nombre.trim(),
        apellidos: v.apellidos.trim(),
        correo: v.correo.trim(),
        contrasena: v.contrasena,
        fecha_nacimiento: v.fecha_nacimiento,
        telefono: v.telefono.trim(),
        tipo: 'Cliente',
        region: v.region,
        comuna: v.comuna,
        direccion: v.direccion.trim(),
      })
      setEstado({ tipo: 'success', texto: 'Cuenta creada correctamente. Redirigiendo...' })
      setTimeout(() => navigate('/iniciar-sesion'), 1200)
    } else if (formatoCorreoOk && !validos.correo) {
      setEstado({ tipo: 'error', texto: 'Ya existe una cuenta registrada con ese correo.' })
    } else {
      setEstado({ tipo: 'error', texto: 'Revisa los campos marcados en rojo.' })
    }
  }

  return (
    <>
      <PageHead eyebrow="TF / MI CUENTA" titulo="Crea tu cuenta">
        Regístrate para guardar tus datos y hacer seguimiento a tus pedidos.
      </PageHead>

      <section className="section wrap">
        <form className="form" onSubmit={enviar} noValidate style={{ maxWidth: 560, margin: '0 auto' }}>
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
            error="Correo inválido, dominio no permitido, o ya está registrado."
            estado={marca('correo')}
          >
            <input type="email" id="correo" name="correo" maxLength={100} autoComplete="email" value={v.correo} onChange={cambiar} />
          </FormField>

          <FormField id="contrasena" label="Contraseña" hint="Entre 4 y 10 caracteres." error="La contraseña debe tener entre 4 y 10 caracteres." estado={marca('contrasena')}>
            <input type="password" id="contrasena" name="contrasena" maxLength={10} autoComplete="new-password" value={v.contrasena} onChange={cambiar} />
          </FormField>

          <FormField id="confirmar" label="Confirmar contraseña" error="Las contraseñas no coinciden." estado={marca('confirmar')}>
            <input type="password" id="confirmar" name="confirmar" maxLength={10} value={v.confirmar} onChange={cambiar} />
          </FormField>

          <FormField id="telefono" label="Teléfono" hint="Opcional.">
            <input type="tel" id="telefono" name="telefono" maxLength={15} autoComplete="tel" value={v.telefono} onChange={cambiar} />
          </FormField>

          <FormField id="fecha_nacimiento" label="Fecha de nacimiento" hint="Opcional">
            <input type="date" id="fecha_nacimiento" name="fecha_nacimiento" value={v.fecha_nacimiento} onChange={cambiar} />
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
            Crear cuenta
          </button>
          <p style={{ marginTop: 14 }}>
            ¿Ya tienes cuenta? <Link to="/iniciar-sesion">Inicia sesión aquí</Link>.
          </p>

          <div className={'form-status' + (estado ? ` show ${estado.tipo}` : '')}>{estado?.texto}</div>
        </form>
      </section>
    </>
  )
}

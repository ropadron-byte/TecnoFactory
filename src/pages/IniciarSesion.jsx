import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHead from '../components/PageHead.jsx'
import FormField from '../components/FormField.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { contrasenaValida, correoValido } from '../utils/validaciones'
import usePageTitle from '../hooks/usePageTitle'
import EstadoForm from '../components/EstadoForm.jsx'

export default function IniciarSesion() {
  usePageTitle('Iniciar sesión')
  const { login } = useAuth()
  const navigate = useNavigate()

  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [enviado, setEnviado] = useState(false) // ya se intentó enviar al menos una vez
  const [estado, setEstado] = useState(null)

  const correoOk = correoValido(correo)
  const contrasenaOk = contrasenaValida(contrasena)
  const marca = (ok) => (enviado ? (ok ? 'valid' : 'invalid') : undefined)

  function enviar(e) {
    e.preventDefault()
    setEnviado(true)

    if (!correoOk || !contrasenaOk) {
      setEstado({ tipo: 'error', texto: 'Revisa los campos marcados en rojo.' })
      return
    }

    const sesion = login(correo.trim(), contrasena)
    if (!sesion) {
      setEstado({ tipo: 'error', texto: 'Correo o contraseña incorrectos.' })
      return
    }

    setEstado({ tipo: 'success', texto: 'Sesión iniciada correctamente. Redirigiendo...' })

    // Administrador y Vendedor entran al panel de administración;
    // el Cliente vuelve a la tienda.
    const esStaff = sesion.tipo === 'Administrador' || sesion.tipo === 'Vendedor'
    setTimeout(() => {
      navigate(esStaff ? '/admin' : '/')
    }, 900)
  }

  return (
    <>
      <PageHead eyebrow="TF / MI CUENTA" titulo="Iniciar sesión">
        Ingresa con tu correo y contraseña para ver tus pedidos y tus datos guardados.
      </PageHead>

      <section className="container py-4">
        <form className="mx-auto" onSubmit={enviar} noValidate style={{ maxWidth: 420 }}>
          <FormField
            id="correo"
            label="Correo electrónico"
            hint="Solo dominios @duoc.cl, @profesor.duoc.cl o @gmail.com"
            error="Ingresa un correo válido de dominio @duoc.cl, @profesor.duoc.cl o @gmail.com."
            estado={marca(correoOk)}
          >
            <input type="text" id="correo" maxLength={100} autoComplete="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
          </FormField>

          <FormField
            id="contrasena"
            label="Contraseña"
            hint="Entre 4 y 10 caracteres."
            error="La contraseña debe tener entre 4 y 10 caracteres."
            estado={marca(contrasenaOk)}
          >
            <input
              type="password"
              id="contrasena"
              maxLength={10}
              autoComplete="current-password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </FormField>

          <button type="submit" className="btn btn-warning">
            Iniciar sesión
          </button>
          <p style={{ marginTop: 14 }}>
            ¿Aún no tienes cuenta? <Link to="/registro">Regístrate aquí</Link>.
          </p>
          <p style={{ marginTop: 8, fontSize: '.8rem', opacity: 0.7 }}>
            Cuenta de administrador de prueba: <strong>admin@duoc.cl</strong> / <strong>admin123</strong>
          </p>

          <EstadoForm estado={estado} />
        </form>
      </section>
    </>
  )
}

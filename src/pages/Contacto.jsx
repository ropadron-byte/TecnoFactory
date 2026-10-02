import { useState } from 'react'
import PageHead from '../components/PageHead.jsx'
import FormField from '../components/FormField.jsx'
import { correoValido } from '../utils/validaciones'
import usePageTitle from '../hooks/usePageTitle'

const VACIO = { nombre: '', correo: '', comentario: '' }

// Cada regla devuelve true/false. El correo es opcional.
const REGLAS = {
  nombre: (v) => v.trim().length > 0 && v.trim().length <= 100,
  correo: (v) => v.trim().length === 0 || correoValido(v),
  comentario: (v) => v.trim().length > 0 && v.trim().length <= 500,
}

export default function Contacto() {
  usePageTitle('Contacto')
  const [valores, setValores] = useState(VACIO)
  const [tocados, setTocados] = useState({}) // campos ya validados (al escribir o al enviar)
  const [estado, setEstado] = useState(null) // { tipo: 'success' | 'error', texto }

  // El correo vacío no se marca ni como válido ni como inválido.
  function estadoCampo(campo) {
    if (!tocados[campo]) return undefined
    if (campo === 'correo' && valores.correo.trim() === '') return undefined
    return REGLAS[campo](valores[campo]) ? 'valid' : 'invalid'
  }

  function cambiar(e) {
    const { name, value } = e.target
    setValores((v) => ({ ...v, [name]: value }))
    setTocados((t) => ({ ...t, [name]: true }))
  }

  function enviar(e) {
    e.preventDefault() // todavía no hay backend
    setTocados({ nombre: true, correo: true, comentario: true })

    const ok = Object.keys(REGLAS).every((c) => REGLAS[c](valores[c]))
    if (ok) {
      setEstado({ tipo: 'success', texto: `¡Gracias, ${valores.nombre.trim()}! Tu mensaje fue enviado correctamente.` })
      setValores(VACIO)
      setTocados({})
    } else {
      setEstado({ tipo: 'error', texto: 'Revisa los campos marcados en rojo antes de enviar el formulario.' })
    }
  }

  return (
    <>
      <PageHead eyebrow="TF / CONTACTO" titulo="Escríbenos">
        ¿Tienes una consulta sobre un producto, tu pedido o algo que quieras contarnos? Completa el formulario y te
        responderemos a la brevedad.
      </PageHead>

      <section className="section wrap">
        <form className="form" onSubmit={enviar} noValidate>
          <FormField
            id="nombre"
            label="Nombre *"
            hint="Máximo 100 caracteres."
            error="Ingresa tu nombre."
            estado={estadoCampo('nombre')}
          >
            <input type="text" id="nombre" name="nombre" maxLength={100} autoComplete="name" value={valores.nombre} onChange={cambiar} />
          </FormField>

          <FormField
            id="correo"
            label="Correo electrónico"
            hint="Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com."
            error="Ingresa un correo válido de dominio @duoc.cl, @profesor.duoc.cl o @gmail.com."
            estado={estadoCampo('correo')}
          >
            <input
              type="text"
              id="correo"
              name="correo"
              maxLength={100}
              autoComplete="email"
              placeholder="nombre@gmail.com"
              value={valores.correo}
              onChange={cambiar}
            />
          </FormField>

          <FormField
            id="comentario"
            label="Comentario *"
            hint={`${valores.comentario.length}/500 caracteres.`}
            error="Cuéntanos tu consulta o comentario (máximo 500 caracteres)."
            estado={estadoCampo('comentario')}
          >
            <textarea id="comentario" name="comentario" maxLength={500} value={valores.comentario} onChange={cambiar} />
          </FormField>

          <button type="submit" className="btn">
            Enviar mensaje
          </button>

          <div className={'form-status' + (estado ? ` show ${estado.tipo}` : '')}>{estado?.texto}</div>
        </form>
      </section>
    </>
  )
}

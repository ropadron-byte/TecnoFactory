import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PageHead from '../components/PageHead.jsx'
import FormField from '../components/FormField.jsx'
import RegionComunaFields from '../components/RegionComunaFields.jsx'
import ResumenCarrito from '../components/ResumenCarrito.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { formatCLP } from '../utils/formato'
import { validarCheckout } from '../utils/validaciones'
import { itemsDeCarrito, procesarCompra } from '../services/ordenesService'
import usePageTitle from '../hooks/usePageTitle'
import EstadoForm from '../components/EstadoForm.jsx'

const VACIO = {
  nombre: '',
  apellidos: '',
  correo: '',
  entrega: 'domicilio',
  calle: '',
  departamento: '',
  region: '',
  comuna: '',
  indicaciones: '',
}

// Si el cliente inició sesión, sus datos se cargan solos (se pueden editar).
// Si viene de "volver a realizar el pago", se recuperan los datos del intento.
function valoresIniciales(sesion, previos) {
  if (previos) return { ...VACIO, ...previos }
  if (!sesion) return VACIO
  return {
    ...VACIO,
    nombre: sesion.nombre || '',
    apellidos: sesion.apellidos || '',
    correo: sesion.correo || '',
    calle: sesion.direccion || '',
    region: sesion.region || '',
    comuna: sesion.comuna || '',
  }
}

// Pequeña espera para que se note que "se está procesando" (0 en los tests).
const ESPERA_PAGO_MS = import.meta.env.MODE === 'test' ? 0 : 700

export default function Checkout() {
  usePageTitle('Checkout')
  const { cart, clearCart } = useCart()
  const { sesion } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [v, setV] = useState(() => valoresIniciales(sesion, location.state?.datos))
  const [simulacion, setSimulacion] = useState('exitoso')
  const [enviado, setEnviado] = useState(false)
  const [procesando, setProcesando] = useState(false)
  const [estado, setEstado] = useState(null)

  const items = itemsDeCarrito(cart)
  const total = items.reduce((s, i) => s + i.subtotal, 0)
  const conDireccion = v.entrega === 'domicilio'

  const validos = validarCheckout(v)
  const marca = (campo) => (enviado ? (validos[campo] ? 'valid' : 'invalid') : undefined)

  function cambiar(e) {
    const { name, value } = e.target
    // Al cambiar de región se limpia la comuna elegida.
    setV((prev) => ({ ...prev, [name]: value, ...(name === 'region' ? { comuna: '' } : {}) }))
  }

  async function pagar(e) {
    e.preventDefault()
    setEnviado(true)
    setEstado(null)

    if (!Object.values(validos).every(Boolean)) {
      setEstado({ tipo: 'error', texto: 'Revisa los campos marcados en rojo.' })
      return
    }

    setProcesando(true)
    await new Promise((resolver) => setTimeout(resolver, ESPERA_PAGO_MS))

    const resultado = procesarCompra({
      carrito: cart,
      usuarioId: sesion?.id ?? null,
      resultadoPago: simulacion,
      cliente: { nombre: v.nombre.trim(), apellidos: v.apellidos.trim(), correo: v.correo.trim() },
      entrega: {
        tipo: v.entrega,
        calle: conDireccion ? v.calle.trim() : '',
        departamento: conDireccion ? v.departamento.trim() : '',
        region: conDireccion ? v.region : '',
        comuna: conDireccion ? v.comuna : '',
        indicaciones: v.indicaciones.trim(),
      },
    })

    if (!resultado.ok) {
      setProcesando(false)
      setEstado({ tipo: 'error', texto: resultado.message })
      return
    }

    const { orden } = resultado
    if (orden.estado === 'Pagada') {
      clearCart() // solo se vacía el carrito si el pago salió bien
      navigate(`/compra/exitosa/${orden.id}`, { replace: true })
    } else {
      navigate(`/compra/error/${orden.id}`, { replace: true })
    }
  }

  // Sin productos no hay nada que comprar (salvo mientras se procesa el pago).
  if (items.length === 0 && !procesando) {
    return (
      <>
        <PageHead eyebrow="TF / CHECKOUT" titulo="Finalizar compra" />
        <section className="container py-4">
          <p style={{ color: 'var(--ink-soft)' }}>
            No tienes productos en el carrito. <Link to="/productos">Ver catálogo</Link>.
          </p>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHead eyebrow="TF / CHECKOUT" titulo="Finalizar compra">
        Completa tus datos y la dirección de entrega para pagar.
      </PageHead>

      <section className="container py-4">
        <form className="mx-auto" onSubmit={pagar} noValidate style={{ maxWidth: 820 }}>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div>
              <h2 className="h5 mb-0">Carrito de compra</h2>
              <small className="text-body-secondary">Completa la siguiente información</small>
            </div>
            <span className="badge text-bg-primary fs-6 py-2 px-3">Total a pagar: {formatCLP(total)}</span>
          </div>

          <ResumenCarrito items={items} />

          {sesion && <p className="form-text">Usamos los datos de tu cuenta; puedes modificarlos si lo necesitas.</p>}

          <h2 className="h5 mt-4">Información del cliente</h2>
          <FormField id="nombre" label="Nombre *" error="El nombre es obligatorio (máx. 50 caracteres)." estado={marca('nombre')}>
            <input type="text" id="nombre" name="nombre" maxLength={50} autoComplete="given-name" value={v.nombre} onChange={cambiar} />
          </FormField>
          <FormField id="apellidos" label="Apellidos *" error="Los apellidos son obligatorios (máx. 100 caracteres)." estado={marca('apellidos')}>
            <input type="text" id="apellidos" name="apellidos" maxLength={100} autoComplete="family-name" value={v.apellidos} onChange={cambiar} />
          </FormField>
          <FormField
            id="correo"
            label="Correo *"
            hint="Solo dominios @duoc.cl, @profesor.duoc.cl o @gmail.com"
            error="Ingresa un correo válido de dominio @duoc.cl, @profesor.duoc.cl o @gmail.com."
            estado={marca('correo')}
          >
            <input type="email" id="correo" name="correo" maxLength={100} autoComplete="email" value={v.correo} onChange={cambiar} />
          </FormField>

          <h2 className="h5 mt-4">Opciones de entrega</h2>
          <div className="mb-3" role="radiogroup" aria-label="Opciones de entrega">
            <label className="form-check form-check-inline">
              <input type="radio" className="form-check-input" name="entrega" value="domicilio" checked={conDireccion} onChange={cambiar} />
              Despacho a domicilio
            </label>
            <label className="form-check form-check-inline">
              <input type="radio" className="form-check-input" name="entrega" value="retiro" checked={!conDireccion} onChange={cambiar} />
              Retiro en tienda
            </label>
          </div>

          {conDireccion && (
            <>
              <h2 className="h5 mt-4">Dirección de entrega de los productos</h2>
              <FormField id="calle" label="Calle *" error="La calle es obligatoria (máx. 150 caracteres)." estado={marca('calle')}>
                <input type="text" id="calle" name="calle" maxLength={150} autoComplete="street-address" value={v.calle} onChange={cambiar} />
              </FormField>
              <FormField id="departamento" label="Departamento" hint="Opcional. Ej: 603" error="Máximo 30 caracteres." estado={marca('departamento')}>
                <input type="text" id="departamento" name="departamento" maxLength={30} value={v.departamento} onChange={cambiar} />
              </FormField>
              <RegionComunaFields
                region={v.region}
                comuna={v.comuna}
                onChange={cambiar}
                estadoRegion={marca('region')}
                estadoComuna={marca('comuna')}
              />
            </>
          )}

          <FormField
            id="indicaciones"
            label="Indicaciones para la entrega"
            hint="Opcional. Ej: entre calles, color del edificio, no tiene timbre."
            error="Máximo 300 caracteres."
            estado={marca('indicaciones')}
          >
            <textarea id="indicaciones" name="indicaciones" maxLength={300} value={v.indicaciones} onChange={cambiar} />
          </FormField>

          {/* Como no hay una pasarela de pago real, la demo permite elegir el resultado. */}
          <div className="alert alert-info d-flex flex-wrap align-items-center gap-2 my-4">
            <label htmlFor="simulacion" className="fw-semibold">Simulación del pago (solo demostración)</label>
            <select id="simulacion" className="form-select form-select-sm w-auto" value={simulacion} onChange={(e) => setSimulacion(e.target.value)}>
              <option value="exitoso">Pago exitoso</option>
              <option value="rechazado">Pago rechazado</option>
            </select>
          </div>

          <button type="submit" className="btn btn-warning" disabled={procesando}>
            {procesando ? 'Procesando pago…' : `Pagar ahora ${formatCLP(total)}`}
          </button>

          <EstadoForm estado={estado} />
        </form>
      </section>
    </>
  )
}

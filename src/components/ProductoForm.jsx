import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from './FormField.jsx'
import ImageUrlsField from './ImageUrlsField.jsx'
import { CATEGORIAS } from '../data/constantes'
import { validarProducto } from '../utils/validaciones'
import { imagenesProducto, obtenerProductoPorCodigo } from '../services/productosService'

function valoresIniciales(producto) {
  if (!producto) {
    return { codigo: '', nombre: '', descripcion: '', precio: '', stock: '', stockCritico: '', categoria: '', urls: [''] }
  }
  return {
    codigo: producto.codigo,
    nombre: producto.nombre,
    descripcion: producto.descripcion || '',
    precio: String(producto.precio),
    stock: String(producto.stock),
    stockCritico: producto.stockCritico ? String(producto.stockCritico) : '',
    categoria: producto.categoria,
    urls: imagenesProducto(producto),
  }
}

/**
 * Formulario de producto para crear (sin `producto`) o editar (con `producto`).
 * `onGuardar(datos)` recibe el producto ya con los tipos correctos.
 */
export default function ProductoForm({ producto, onGuardar, mensajeExito, cancelarA = '/admin/productos' }) {
  const editando = Boolean(producto)
  const [v, setV] = useState(() => valoresIniciales(producto))
  const [enviado, setEnviado] = useState(false)
  const [estado, setEstado] = useState(null)

  const codigoOcupado = !editando && v.codigo.trim().length >= 3 && Boolean(obtenerProductoPorCodigo(v.codigo.trim()))
  const validos = validarProducto(v, { validarCodigo: !editando, codigoDisponible: !codigoOcupado })
  const marca = (campo) => (enviado ? (validos[campo] ? 'valid' : 'invalid') : undefined)

  function cambiar(e) {
    const { name, value } = e.target
    setV((prev) => ({ ...prev, [name]: value }))
  }

  function enviar(e) {
    e.preventDefault()
    setEnviado(true)
    setEstado(null)

    if (!Object.values(validos).every(Boolean)) {
      setEstado({
        tipo: 'error',
        texto: codigoOcupado ? 'Ya existe un producto con ese código.' : 'Revisa los campos marcados en rojo.',
      })
      return
    }

    // Quitamos espacios, vacíos y duplicados de las URLs.
    const urls = [...new Set(v.urls.map((u) => u.trim()).filter(Boolean))]
    onGuardar({
      codigo: v.codigo.trim(),
      nombre: v.nombre.trim(),
      descripcion: v.descripcion.trim(),
      precio: parseFloat(v.precio),
      stock: Number(v.stock),
      stockCritico: v.stockCritico === '' ? 0 : Number(v.stockCritico),
      categoria: v.categoria,
      urls,
    })
    setEstado({ tipo: 'success', texto: mensajeExito })
  }

  return (
    <form className="form" onSubmit={enviar} noValidate>
      <FormField
        id="codigo"
        label="Código producto"
        hint={editando ? 'El código no se puede modificar.' : 'Mínimo 3 caracteres. Ej: TF-NB-002'}
        error={!editando && (codigoOcupado ? 'Ya existe un producto con ese código.' : 'El código es obligatorio (mínimo 3 caracteres).')}
        estado={editando ? undefined : marca('codigo')}
      >
        <input type="text" id="codigo" name="codigo" value={v.codigo} onChange={cambiar} readOnly={editando} />
      </FormField>

      <FormField id="nombre" label="Nombre" error="El nombre es obligatorio (máx. 100 caracteres)." estado={marca('nombre')}>
        <input type="text" id="nombre" name="nombre" maxLength={100} value={v.nombre} onChange={cambiar} />
      </FormField>

      <FormField
        id="descripcion"
        label="Descripción"
        hint="Opcional. Máximo 500 caracteres."
        error="La descripción no puede superar los 500 caracteres."
        estado={marca('descripcion')}
      >
        <textarea id="descripcion" name="descripcion" maxLength={500} value={v.descripcion} onChange={cambiar} />
      </FormField>

      <FormField
        id="precio"
        label="Precio"
        hint="Puede tener decimales. Mínimo 0 (se considera producto gratis)."
        error="Ingresa un precio válido (0 o más)."
        estado={marca('precio')}
      >
        <input type="number" id="precio" name="precio" min={0} step="0.01" value={v.precio} onChange={cambiar} />
      </FormField>

      <FormField
        id="stock"
        label="Stock"
        hint="Solo números enteros, mínimo 0."
        error="Ingresa una cantidad de stock válida (número entero, 0 o más)."
        estado={marca('stock')}
      >
        <input type="number" id="stock" name="stock" min={0} step="1" value={v.stock} onChange={cambiar} />
      </FormField>

      <FormField
        id="stockCritico"
        label="Stock crítico"
        hint="Opcional. Se mostrará una alerta cuando el stock llegue a este valor o menos."
        error="El stock crítico debe ser un número entero, 0 o más."
        estado={marca('stockCritico')}
      >
        <input type="number" id="stockCritico" name="stockCritico" min={0} step="1" value={v.stockCritico} onChange={cambiar} />
      </FormField>

      <FormField id="categoria" label="Categoría" error="Selecciona una categoría." estado={marca('categoria')}>
        <select id="categoria" name="categoria" value={v.categoria} onChange={cambiar}>
          <option value="">Selecciona una categoría</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </FormField>

      <ImageUrlsField value={v.urls} onChange={(urls) => setV((prev) => ({ ...prev, urls }))} />

      <button type="submit" className="btn accent">
        {editando ? 'Guardar cambios' : 'Guardar producto'}
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

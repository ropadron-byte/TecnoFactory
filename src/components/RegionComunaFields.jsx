import FormField from './FormField.jsx'
import { REGIONES } from '../data/regiones'

/**
 * Par de selects dependientes: la lista de comunas depende de la región.
 * `onChange(e)` recibe el evento del select (name="region" | "comuna");
 * el formulario padre se encarga de limpiar la comuna al cambiar la región.
 */
export default function RegionComunaFields({ region, comuna, onChange, estadoRegion, estadoComuna }) {
  const comunas = REGIONES.find((r) => r.region === region)?.comunas ?? []

  return (
    <>
      <FormField id="region" label="Región" error="Selecciona una región." estado={estadoRegion}>
        <select id="region" name="region" value={region} onChange={onChange}>
          <option value="">Selecciona una región</option>
          {REGIONES.map((r) => (
            <option key={r.region} value={r.region}>
              {r.region}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="comuna" label="Comuna" error="Selecciona una comuna." estado={estadoComuna}>
        <select id="comuna" name="comuna" value={comuna} onChange={onChange} disabled={!region}>
          <option value="">Selecciona una comuna</option>
          {comunas.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </FormField>
    </>
  )
}

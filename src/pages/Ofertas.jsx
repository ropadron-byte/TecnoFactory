import { useState } from 'react'
import PageHead from '../components/PageHead.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import { obtenerProductos } from '../services/productosService'
import { descuentoDe, tieneOferta } from '../utils/precios'
import usePageTitle from '../hooks/usePageTitle'

// Vista "Ofertas": todos los productos con descuento, del mayor al menor.
export default function Ofertas() {
  usePageTitle('Ofertas')
  const [productos] = useState(obtenerProductos)
  const ofertas = productos.filter(tieneOferta).sort((a, b) => descuentoDe(b) - descuentoDe(a))

  return (
    <>
      <PageHead eyebrow="TF / OFERTAS" titulo="Productos en oferta">
        Aprovecha los descuentos vigentes. Los precios ya incluyen la rebaja.
      </PageHead>

      <section className="container py-4">
        <ProductGrid productos={ofertas} vacio="Por ahora no hay productos en oferta. ¡Vuelve pronto!" />
      </section>
    </>
  )
}

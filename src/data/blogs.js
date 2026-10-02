import imgApertura from '../assets/images/blog/blog_apertura_tienda.jpg'
import imgSsd from '../assets/images/blog/blog_ssd.jpg'
import imgSetup from '../assets/images/blog/blog_setup.jpg'

// Listado de entradas del blog. El contenido completo de cada artículo
// vive en su propio componente (pages/blog/Articulo*.jsx).
export const BLOGS = [
  {
    slug: 'abrimos-nuestra-tienda-online',
    imagen: imgApertura,
    alt: 'Apertura de la tienda online Tecno Factory',
    etiqueta: 'NOVEDAD',
    meta: '12 AGO 2026 · NOTICIAS',
    fecha: '12 AGO 2026',
    categoria: 'NOTICIAS',
    titulo: 'Abrimos nuestra tienda online',
    resumen:
      'Tecno Factory ya está disponible en línea: conoce por qué decidimos dar el salto al ecommerce y qué viene después.',
    disponible: true,
  },
  {
    slug: '5-datos-curiosos-ssd',
    imagen: imgSsd,
    alt: 'Disco de estado sólido',
    etiqueta: 'DATO CURIOSO',
    meta: '28 AGO 2026 · CURIOSIDADES',
    fecha: '28 AGO 2026',
    categoria: 'CURIOSIDADES',
    titulo: '5 datos curiosos sobre el SSD',
    resumen:
      '¿Sabías que el primer SSD comercial costaba miles de dólares por apenas unos megabytes? Te contamos esto y más.',
    disponible: true,
  },
  {
    slug: 'guia-setup-ideal',
    imagen: imgSetup,
    alt: 'Escritorio con equipo de computación',
    etiqueta: 'PRÓXIMAMENTE',
    meta: 'PRÓXIMAMENTE',
    titulo: 'Guía para armar tu setup ideal',
    resumen:
      'Estamos preparando una guía completa para elegir monitor, teclado y mouse según tu forma de trabajar. Vuelve pronto.',
    disponible: false,
  },
]

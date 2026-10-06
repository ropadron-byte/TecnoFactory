import falabella from '../assets/images/logos/falabella.png'

const MEDIOS = [
  {
    nombre: 'Visa',
    etiqueta: 'Crédito',
    img: 'https://e7.pngegg.com/pngimages/882/375/png-clipart-wikipedia-logo-visa-graphics-credit-card-the-african-grassland-blue-text.png',
  },
  {
    nombre: 'Mastercard',
    etiqueta: 'Mastercard',
    img: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
  },
  {
    nombre: 'Webpay',
    etiqueta: 'WebPay',
    img: 'https://vectorseek.com/wp-content/uploads/2023/09/WebPay-Logo-Vector.svg-.png',
  },
  {
    nombre: 'BancoEstado',
    etiqueta: 'CuentaRUT',
    img: 'https://clientes.xgaming.cl/tutoriales/pago/1.png',
  },
  { nombre: 'Banco Falabella', etiqueta: 'CMR', img: falabella },
]

export default function PaymentMethods() {
  return (
    <div className="row row-cols-2 g-2" style={{ maxWidth: 260 }}>
      {MEDIOS.map((m, i) => (
        <div className={'col' + (i === MEDIOS.length - 1 ? ' col-12' : '')} key={m.nombre}>
          <div className="d-flex align-items-center justify-content-center gap-2 border border-light border-opacity-25 rounded bg-white bg-opacity-10 px-2 py-2 small">
            <img src={m.img} alt={m.nombre} width="28" height="20" style={{ objectFit: 'contain' }} />
            <span>{m.etiqueta}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

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
    <div className="payment-methods">
      {MEDIOS.map((m) => (
        <div className="payment-card-badge" key={m.nombre}>
          <img src={m.img} alt={m.nombre} />
          <span>{m.etiqueta}</span>
        </div>
      ))}
    </div>
  )
}

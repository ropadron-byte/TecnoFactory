// Encabezado estándar de cada página interna: "eyebrow" + título + bajada.
export default function PageHead({ eyebrow, titulo, children }) {
  return (
    <section className="page-head wrap">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1>{titulo}</h1>
      {children && <p>{children}</p>}
    </section>
  )
}

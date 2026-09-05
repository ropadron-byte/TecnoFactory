# TecnoFactory — Guía de todos los archivos CSS

El proyecto tiene **3 hojas de estilo**, ninguna generada por un preprocesador (no hay Sass/Less, es CSS plano) y sin ningún build step: se cargan directo con `<link rel="stylesheet">`.

| Archivo | Líneas | Dónde se usa | Rol |
|---|---|---|---|
| `estilos.css` | 721 | Casi todo `pages/tienda/` + base de todo `pages/admin/` | Hoja principal: paleta, tipografías, layout y componentes propios de la tienda |
| `estilosIndex.css` | 137 | Solo `index.html` | Ajustes puntuales sobre Bootstrap (el home es la única página que usa Bootstrap) |
| `admin.css` | 124 | Todo `pages/admin/` | Layout del panel (sidebar, tablas, badges), se apoya en las variables de `estilos.css` |

---

## Índice
1. [`estilos.css`](#1-estiloscss)
2. [`estilosIndex.css`](#2-estilosindexcss)
3. [`admin.css`](#3-admincss)
4. [Orden de carga en cada tipo de página](#4-orden-de-carga-en-cada-tipo-de-página)
5. [Variables de diseño (design tokens)](#5-variables-de-diseño-design-tokens)
6. [Detalles a tener en cuenta](#6-detalles-a-tener-en-cuenta)

---

## 1. `estilos.css`

Es la hoja de estilos "de fondo" del proyecto: la usan casi todas las páginas de `pages/tienda/` como única hoja, y además la carga `pages/admin/` como base (antes de `admin.css`) para heredar sus variables de color. `index.html` **no** la usa como base (usa Bootstrap), pero sí la incluye para que ciertos componentes compartidos (like `.site-header`, `.site-footer`, `.btn`) se vean iguales que en el resto del sitio.

Trae además el `@import` de Google Fonts (Space Grotesk, Inter, JetBrains Mono), así que es la única hoja que dispara esa descarga.

### 1.1 Variables globales (`:root`)
Toda la paleta de colores y unos pocos valores de layout viven en variables CSS (`--brand`, `--ink`, `--line`, `--danger`, `--ok`, etc.) — ver la tabla completa en la [sección 5](#5-variables-de-diseño-design-tokens). El resto del archivo casi no usa colores "sueltos", todo referencia estas variables.

### 1.2 Reseteo y tipografía base
`box-sizing:border-box` global, `scroll-behavior:smooth` para anclas (`#`), y los estilos base de `body`, `h1`-`h4`, `p`, `a`, `img`, `ul`, `button`. `h1` usa `clamp()` para ser responsive sin necesitar media queries extra.

### 1.3 `.wrap`
El contenedor genérico: centra el contenido con un ancho máximo (`--maxw: 1160px`) y padding lateral. Se usa dentro de casi cualquier `<section>` de la tienda en vez de repetir `margin`/`max-width` en cada bloque.

### 1.4 Botones (`.btn`, `.ghost`, `.accent`, `.small`)
Un botón base sólido (`.btn`, color `--brand`) con dos variantes: `.ghost` (transparente, para acciones secundarias como "Volver") y `.accent` (color `--accent`, para la acción principal como "Agregar al carrito"). `.small` reduce el padding/tamaño de fuente. Incluye estado `:hover`, `:active` (efecto de "presionado") y `:disabled`.

### 1.5 Header / navegación (`.site-header`, `.nav`, `.nav-links`, `.cart-btn`, `.nav-toggle`)
- `.site-header` queda fijo arriba (`position:sticky`) al hacer scroll.
- `.nav` usa flexbox para separar logo / menú / acciones del carrito en 3 grupos.
- `.logo-mark` es un cuadrado de color con un `::before`/`::after` que dibujan una cruz — es un logo hecho 100% en CSS, sin ninguna imagen.
- `.cart-btn` + `.cart-count`: el botón del carrito con el numerito redondo (que `carrito.js` actualiza vía `updateCartBadge()`).
- **Media query `max-width:820px`**: oculta `.nav-links` y muestra `.nav-toggle` (el botón ☰); la clase `.nav-links.open` (que agrega `main.js` al hacer clic) es la que efectivamente despliega el menú en mobile.

### 1.6 Footer (`.site-footer`, `.footer-grid`, `.footer-bottom`)
Grid de 3 columnas (`1.4fr 1fr 1fr`) que colapsa a 1 columna bajo `max-width:700px`. Define también el estilo base de `.payment-methods`/`.payment-card-badge` — **ver el aviso de duplicación en la [sección 6](#6-detalles-a-tener-en-cuenta)**, porque este mismo bloque se repite completo al final del archivo y en `estilosIndex.css`.

### 1.7 Encabezado de página genérica (`.page-head`, `.eyebrow`, `.section`)
El patrón repetido arriba de cada página interna: una etiqueta chica tipo "TF / CONTACTO" (`.eyebrow`, en la fuente monoespaciada), seguida del `<h1>` y una bajada. `.section`/`.section-tight` son solo paddings verticales reutilizables.

### 1.8 Grid utilitario (`.grid`, `.grid-3`, `.grid-2`)
Grid genérico con 2 variantes de columnas: `.grid-3` (usada en el catálogo de productos y el listado de blogs) y `.grid-2` (definida pero, ver sección 6, sin ningún uso actual en el HTML). Responsive: 3→2→1 columnas según ancho de pantalla.

### 1.9 Filtros de categoría (`.category-filters`, `.filter-btn`)
Los "chips" redondeados (`border-radius:999px`) de la página de catálogo. `catalogo.js` les agrega/quita la clase `.active` según el filtro seleccionado; el CSS solo define cómo se ve cada estado.

### 1.10 Card genérica (`.card`, `.media`, `.card-body`, `.card-meta`)
La misma estructura visual (imagen arriba + cuerpo abajo) sirve tanto para las tarjetas de blog como para las de producto. `.media` tiene un degradado de marca como fondo de respaldo (se ve mientras carga la imagen, o si no hay ninguna y solo se muestra el emoji de categoría). Variantes de proporción: `.media--card` (16:10), `.media--square` (1:1, ficha de producto), `.media--wide` (21:8, portadas).

### 1.11 Producto (`.price`, `.price-old`, `.stock-tag`, `.product-detail`, `.product-thumbs`)
- `.price` usa la fuente monoespaciada para que el precio se vea "de ficha técnica".
- `.price-old` (precio tachado) está definida pero **no se usa en ningún lado** — no hay funcionalidad de descuentos implementada todavía.
- `.stock-tag` con variantes `.ok`/`.low` — igual, definidas pero el JS actual (`catalogo.js`, `detalle.js`) nunca les agrega esas clases, solo cambia el texto (ver sección 6).
- `.product-detail`: grid de 2 columnas (imagen | info) para la ficha de producto, que colapsa a 1 columna en mobile.
- `.product-thumbs`/`.product-thumb`: la fila de miniaturas clicleables que arma `detalle.js` cuando el producto tiene más de una imagen; `.product-thumb.active` marca cuál es la que se está mostrando en grande.

### 1.12 Campo de imágenes en formularios admin (`.image-inputs`, `.image-input-row`, `.image-preview`)
Estilo de cada fila del bloque "agregar 1 o más URLs de imagen" que arma `productos.js` (`crearFilaImagen`) en los formularios de nuevo/editar producto: input de URL + vista previa chica (`.image-preview`, oculta hasta que tiene una URL válida vía la clase `.show`) + botón de quitar fila.

### 1.13 Selector de cantidad (`.qty`)
El control tipo "stepper" (botón `−`, input numérico, botón `+`) que se ve como una sola pieza gracias a los bordes compartidos. Se usa tanto en la ficha de producto (`detalle.js`) como en el carrito (script inline de `carrito.html`).

### 1.14 Lista de especificaciones (`.spec-list`, `.spec-row`)
Filas de "etiqueta ↔ valor" separadas por una línea fina, usadas en la ficha de producto y en las vistas de "mostrar" del panel admin (detalle de producto/usuario).

### 1.15 Formularios (`.form`, `.field`, `.hint`, `.error-msg`, `.form-status`)
El sistema de validación visual completo:
- `.field` agrupa label + input + mensaje de error.
- Los estados `.field.invalid` / `.field.valid` (que agregan los distintos scripts de validación) cambian el color del borde del input.
- `.error-msg` solo se muestra (`display:block`) cuando el `.field` padre tiene `.invalid` — así el JS solo tiene que poner/sacar una clase, no mostrar/ocultar el texto a mano.
- `.form-status` es el cartel final ("Formulario enviado" / "Revisa los campos en rojo"), con variantes `.success`/`.error`.

### 1.16 Blog (`.blog-body`, `.blog-hero`, `.blog-hero-img`)
Ancho de lectura cómodo (`max-width:70ch`) para los artículos, y una imagen de portada grande (`.blog-hero-img`, 16:9) — la que falta físicamente porque no vino la carpeta `images/` (ver la documentación general del proyecto).

### 1.17 Utilidades sueltas (`.text-center`, `.mt-0`, `.divider`, `.visually-hidden`)
Clases de un solo propósito. `.visually-hidden` es el patrón estándar de accesibilidad para ocultar texto visualmente pero dejarlo disponible para lectores de pantalla.

### 1.18 Medios de pago (al final del archivo, líneas 643-720)
Bloque de estilos para los "chips" de Visa/Mastercard/Webpay/BancoEstado/CMR Falabella del footer: grid de 2 columnas de 120px, el último logo (impar) centrado con `nth-child(5)`, y ajustes de tamaño puntuales para los logos que se ven muy chicos por defecto (`nth-child(4)` y `nth-child(5)`). **Este bloque completo está duplicado** — ver sección 6.

---

## 2. `estilosIndex.css`

Se carga **solo en `index.html`**, después de `estilosIndex.css`... (en realidad después de `estilos.css`, ver el `<head>` de `index.html`). Como el home usa Bootstrap 5 como base de layout, esta hoja no redefine nada estructural: solo ajusta detalles puntuales sobre clases que ya trae Bootstrap.

| Bloque | Qué hace |
|---|---|
| Medios de pago (líneas 10-87) | **Idéntico** al bloque final de `estilos.css` (ver sección 6) — footer de 3 columnas + grid de logos de pago. |
| `body { font-family: 'Inter' }` | Fuerza Inter también en el home, para que calce visualmente con el resto de la tienda aunque la base sea Bootstrap. |
| `.hero-banner` | El fondo oscuro con degradado (`#0f172a → #1e1b4b → #311042`) detrás del carrusel principal. |
| `.hero-title` | Título del hero con degradado de texto (blanco a celeste), usando `-webkit-background-clip:text` para "pintar" el texto con el gradiente en vez de un color plano. |
| `.hero-subtitle` | Solo color y peso de fuente para la bajada del hero. |
| `.hero-carousel-item` | Fuerza fondo transparente en cada slide de Bootstrap, para que se vea el degradado de `.hero-banner` por detrás en vez del fondo blanco por defecto del componente. |
| `.carousel-control-prev-icon` / `-next-icon` | Flechas del carrusel de Bootstrap, tenues por defecto (`opacity:0.25`) y más visibles al pasar el mouse (`opacity:0.7`), usando `filter:invert(100%)` para que se vean blancas sobre el fondo oscuro. |

---

## 3. `admin.css`

Se carga **después** de `estilos.css` en todas las páginas de `pages/admin/`, y reutiliza sus variables (`--brand`, `--ink`, `--line`, `--surface`, `--radius`) sin volver a declararlas — por eso casi todos los valores tienen un *fallback* explícito (ej. `var(--surface,#fff)`), por si algún día esta hoja se usara sin `estilos.css` cargado antes.

| Bloque | Qué hace |
|---|---|
| `.admin-wrap` | Layout general del panel: `display:flex` de altura completa (`min-height:100vh`) que separa sidebar + contenido. |
| `.admin-sidebar` | Barra lateral oscura (`background:var(--ink)`) de 220px fijos, con dos grupos de links (`.admin-nav-top` arriba, `.admin-nav-bottom` abajo — este último es donde `admin-guard.js` inyecta "Conectado como..." y "Cerrar sesión"). El link activo (`[aria-current="page"]`) se resalta con el color de marca. |
| `.admin-content` | El panel de contenido a la derecha del sidebar, con su propio padding y fondo. |
| `.admin-header` | Encabezado de cada página del panel: título a la izquierda, un ícono de campana (🔔) decorativo a la derecha. |
| `.admin-panel` | Tarjeta blanca genérica con borde y padding, usada para agrupar contenido suelto (ej. el resumen del home del panel, o la ficha de "mostrar producto/usuario"). |
| `.admin-table` | Tabla de listados (usada en `producto.html` y `usuario.html`): bordes colapsados, encabezado con fondo gris (`#F0F1F4`), sin borde en la última fila. |
| `.admin-actions` | Contenedor flex para los botones "Ver"/"Editar" de cada fila de tabla. |
| `.table-thumb` | La miniatura cuadrada (44×44px) con el mismo degradado de marca que `.media`, usada en la columna de imagen de la tabla de productos. |
| `.badge` + variantes | Etiqueta redondeada de un solo color, reutilizada para dos cosas distintas: el **tipo de usuario** (`.administrador` rojo, `.vendedor` amarillo, `.cliente` verde) y el **estado de stock** (`.critico` rojo, `.ok` verde) en la tabla de productos. |

---

## 4. Orden de carga en cada tipo de página

```
index.html (home)
  Bootstrap CSS (CDN) → Bootstrap Icons (CDN) → estilosIndex.css → estilos.css

pages/tienda/*.html (catálogo, ficha, carrito, blogs, contacto, login, registro...)
  estilos.css   (única hoja, con rutas "../../css/estilos.css")

pages/admin/*.html (home, producto, usuario y sus variantes nuevo/editar/mostrar)
  estilos.css  →  admin.css   (admin.css depende de las variables de estilos.css)
```

**Por qué el orden importa acá:** `admin.css` usa variables como `var(--brand)` sin volver a definirlas; si `estilos.css` no se cargara antes, esas variables no existirían (aunque los `fallback` como `var(--surface,#fff)` amortiguan el golpe en varios casos).

---

## 5. Variables de diseño (design tokens)

Todas viven en el bloque `:root` de `estilos.css` (líneas 21-40):

| Variable | Valor | Uso |
|---|---|---|
| `--bg` | `#F4F5F7` | Fondo general de página |
| `--surface` | `#FFFFFF` | Fondo de tarjetas, inputs, tablas |
| `--ink` | `#14151A` | Texto principal / sidebar admin |
| `--ink-soft` | `#565B66` | Texto secundario (párrafos, metadatos) |
| `--brand` | `#22406B` | Color de marca (botones, links activos, header sidebar) |
| `--brand-2` | `#345580` | Variante de marca para `:hover` y degradados |
| `--accent` | `#F2A93B` | Color de acento (botón "accent", badge de carrito) |
| `--line` | `#D7DBE2` | Bordes sutiles |
| `--line-strong` | `#B9C0CB` | Bordes de inputs/botones ghost |
| `--danger` | `#C0392B` | Errores, stock crítico, badge "Administrador" |
| `--ok` | `#1E7B45` | Éxito, stock disponible, badge "Cliente" |
| `--font-display` | Space Grotesk | Títulos (`h1`-`h4`) |
| `--font-body` | Inter | Texto normal |
| `--font-data` | JetBrains Mono | Precios, código de producto, specs |
| `--maxw` | `1160px` | Ancho máximo de `.wrap` |
| `--radius` | `3px` | Radio de borde estándar (muy sutil, look "técnico") |

---

## 6. Detalles a tener en cuenta

- 🔁 **Bloque de "medios de pago" duplicado exactamente** entre el final de `estilos.css` (líneas 643-720) y todo `estilosIndex.css` (líneas 10-87) — son 78 líneas byte-por-byte idénticas. Como `index.html` carga **ambas** hojas, el bloque termina declarado dos veces (sin romper nada porque las reglas son iguales, pero es CSS redundante que conviene limpiar: lo lógico sería dejarlo solo en `estilos.css`, ya que también lo usan las páginas de `pages/tienda/`).
- 💤 **Clases definidas pero sin uso actual en el HTML/JS:**
  - `.grid-2` (solo se usa `.grid-3` en todo el proyecto).
  - `.price-old` (no hay funcionalidad de "precio con descuento" implementada).
  - `.stock-tag.ok` / `.stock-tag.low` — el CSS las define, pero ni `catalogo.js` ni `detalle.js` llegan a agregarle esas clases al `<span class="stock-tag">`, solo le cambian el texto. Visualmente el tag de stock siempre queda con el color neutro por defecto, nunca verde/rojo.
- Estas tres son buenas candidatas si en algún momento se quiere sumar "precio con descuento" o colorear el stock según disponibilidad: el CSS ya está listo, solo falta que el JS agregue la clase correspondiente.

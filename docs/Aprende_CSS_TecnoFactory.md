# Aprende CSS con los ejemplos reales de TecnoFactory

Esta guía funciona igual que la de JavaScript: **cada concepto se explica con una regla que ya existe en `estilos.css`, `estilosIndex.css` o `admin.css`**, con el archivo y el motivo real por el que se escribió así. La idea es que puedas ir del concepto a un caso real del proyecto, no a un ejemplo inventado.

> 💡 Dato importante antes de empezar: el proyecto usa **CSS plano**, sin Sass/Less ni ningún preprocesador, y sin build step — los tres archivos se cargan directo con `<link rel="stylesheet">`. Por eso vas a ver algunas cosas "a mano" que en un proyecto con preprocesador se resolverían distinto (por ejemplo, repetir un valor en vez de usar una función de mixin).

---

## Índice

1. [Variables CSS (custom properties) y `:root`](#1-variables-css-custom-properties-y-root)
2. [El selector universal y `box-sizing`](#2-el-selector-universal-y-box-sizing)
3. [Selectores de clase, combinadores y anidamiento simple](#3-selectores-de-clase-combinadores-y-anidamiento-simple)
4. [Pseudo-clases: `:hover`, `:active`, `:disabled`, `:last-child`](#4-pseudo-clases-hover-active-disabled-last-child)
5. [`nth-child`: seleccionar por posición](#5-nth-child-seleccionar-por-posición)
6. [Pseudo-elementos `::before` y `::after`](#6-pseudo-elementos-before-y-after)
7. [Flexbox](#7-flexbox)
8. [CSS Grid](#8-css-grid)
9. [`position: sticky` y `position: relative/absolute`](#9-position-sticky-y-position-relativeabsolute)
10. [Diseño responsivo con media queries](#10-diseño-responsivo-con-media-queries)
11. [Unidades: `px`, `rem`, `em`, `%`, `ch`, `vw`](#11-unidades-px-rem-em--ch-vw)
12. [`clamp()`: tipografía fluida sin media queries](#12-clamp-tipografía-fluida-sin-media-queries)
13. [`aspect-ratio` y `object-fit`](#13-aspect-ratio-y-object-fit)
14. [Gradientes (`linear-gradient`)](#14-gradientes-linear-gradient)
15. [Tipografías: `@import` y pilas de `font-family`](#15-tipografías-import-y-pilas-de-font-family)
16. [Transiciones y `transform`](#16-transiciones-y-transform)
17. [Estados dinámicos controlados por clases (`.active`, `.invalid`, `.show`)](#17-estados-dinámicos-controlados-por-clases-active-invalid-show)
18. [`:focus` y accesibilidad visual](#18-focus-y-accesibilidad-visual)
19. [Selectores de atributo (`[aria-current="page"]`)](#19-selectores-de-atributo-aria-currentpage)
20. [Buenas prácticas y errores reales del proyecto](#20-buenas-prácticas-y-errores-reales-del-proyecto)
21. [Ejercicios propuestos](#21-ejercicios-propuestos)

---

## 1. Variables CSS (custom properties) y `:root`

Una variable CSS se declara con `--nombre: valor;` dentro de un selector (casi siempre `:root`, que representa el `<html>` y por eso hace la variable disponible en **toda la página**), y se usa en cualquier otra regla con `var(--nombre)`.

Ejemplo real (`estilos.css`):
```css
:root{
  --bg:        #F4F5F7;
  --surface:   #FFFFFF;
  --ink:       #14151A;
  --ink-soft:  #565B66;
  --brand:     #22406B;
  --brand-2:   #345580;
  --accent:    #F2A93B;
  --line:      #D7DBE2;
  --danger:    #C0392B;
  --ok:        #1E7B45;

  --font-display: 'Space Grotesk', 'Segoe UI', sans-serif;
  --maxw: 1160px;
  --radius: 3px;
}
```

Y su uso, decenas de líneas más abajo:
```css
.btn{
  border:1px solid var(--brand);
  border-radius:var(--radius);
  background:var(--brand);
}
```

Lo interesante es que **`admin.css` reutiliza estas mismas variables sin volver a definirlas**, porque se carga después de `estilos.css` en el `<head>` de las páginas de admin:
```css
/* admin.css */
.admin-sidebar{
  background:var(--ink);   /* --ink viene de estilos.css, admin.css no la declara */
  color:#fff;
}
```
Esto solo funciona porque el orden de los `<link>` importa: si `admin.css` se cargara *antes* que `estilos.css`, `var(--ink)` no existiría todavía y el navegador usaría el valor por defecto (o nada).

También se puede dar un **valor de respaldo** como segundo argumento de `var()`, por si la variable no estuviera definida:
```css
/* admin.css */
.admin-content{
  background:var(--bg,#F5F6F8); /* si --bg no existiera, usa #F5F6F8 */
}
```

**Para recordar:** las variables CSS (a diferencia de las de Sass) son valores "vivos" del navegador: se pueden leer y hasta cambiar desde JavaScript (`style.setProperty`), y respetan la cascada normal de CSS (se pueden sobreescribir para un elemento específico).

---

## 2. El selector universal y `box-sizing`

`*` selecciona **todos** los elementos. Combinado con `::before` y `::after`, es la forma estándar de aplicar un reseteo global.

Ejemplo real (`estilos.css`):
```css
*,*::before,*::after{ box-sizing:border-box; }
```

`box-sizing:border-box` cambia cómo el navegador calcula el ancho de una caja: por defecto (`content-box`), el `padding` y el `border` se **suman** al `width` que definiste; con `border-box`, se **incluyen dentro** de ese `width`. Por eso el comentario original del archivo dice:

> "Uso box-sizing:border-box en todo para que el padding y el border no me alteren el ancho que yo defino, que es el comportamiento que siempre termino necesitando."

Ejemplo concreto de por qué importa (`estilosIndex.css`):
```css
.payment-card-badge {
  padding: 8px 10px;
  box-sizing: border-box; /* redundante aquí porque el * ya lo aplica, pero refuerza la intención */
}
```
Si esta caja no tuviera `border-box`, el `padding` de 10px a cada lado se sumaría al ancho fijo de la grilla (120px por columna) y el chip se saldría de su celda.

**Para recordar:** casi todo proyecto moderno de CSS empieza con `*{box-sizing:border-box}`. Es una de las pocas reglas que casi nunca tiene excepciones.

---

## 3. Selectores de clase, combinadores y anidamiento simple

El proyecto está escrito casi 100% con **selectores de clase** (`.btn`, `.card`, `.admin-table`), evitando IDs para estilos (los IDs se reservan para que JS "enganche" elementos, ver la guía de HTML). Los combinadores permiten apuntar a un elemento *dentro de* otro sin darle una clase propia.

Ejemplo real de combinador descendiente (espacio = "que esté dentro de", `admin.css`):
```css
.admin-table th,
.admin-table td{
  text-align:left;
  padding:12px 16px;
  border-bottom:1px solid var(--line);
}
```
Esto dice: "todo `<th>` o `<td>` que esté dentro de un elemento con clase `.admin-table`", sin tener que agregar `class="admin-table-cell"` a cada celda de cada tabla del panel.

Ejemplo real de combinador hijo directo (`>` — aunque acá se usa uno descendiente para ser más flexible), y de selector compuesto clase+clase (`estilosIndex.css`):
```css
.site-footer .wrap.footer-grid {
  display: flex;
  /* ... */
}
```
`.wrap.footer-grid` (sin espacio entre ambas clases) selecciona un elemento que tenga **las dos clases a la vez** (`class="wrap footer-grid"`), y como está precedido de `.site-footer ` (con espacio), solo aplica cuando ese elemento está dentro del footer — así este ajuste no le pega a cualquier `.wrap` de la tienda.

**Para recordar:** un espacio entre dos selectores es "descendiente en cualquier nivel"; sin espacio (`.a.b`) es "el mismo elemento con ambas clases"; `>` es "hijo directo, un solo nivel".

---

## 4. Pseudo-clases: `:hover`, `:active`, `:disabled`, `:last-child`

Una pseudo-clase describe un **estado** del elemento, no algo que esté en el HTML. El proyecto las usa mucho para dar feedback visual sin necesitar JavaScript.

Ejemplo real completo (`estilos.css`, botones):
```css
.btn:hover{ background:var(--brand-2); }
.btn:active{ transform:translateY(1px); }  /* efecto "presionado" */
.btn:disabled{ opacity:.5; cursor:not-allowed; }
```

`:last-child` selecciona un elemento solo si es el **último hijo** de su padre — útil para quitar un borde repetido que solo sobra en la última fila:
```css
/* admin.css */
.admin-table tr:last-child td{ border-bottom:none; }
```
Sin esto, cada `<td>` tendría un `border-bottom`, y la última fila de la tabla se vería con una línea de más pegada al borde inferior del contenedor.

**Para recordar:** `:hover`/`:active` responden a la interacción del mouse; `:disabled` solo aplica a elementos de formulario (`<button>`, `<input>`) que tengan el atributo HTML `disabled`; `:last-child`/`:first-child` dependen de la posición en el árbol del DOM, no de una clase.

---

## 5. `nth-child`: seleccionar por posición

`:nth-child(n)` selecciona el elemento que ocupa la posición `n` entre los hijos de su padre. Es la herramienta justa cuando querés tratar distinto a un elemento según su lugar en una lista, sin agregarle una clase extra en el HTML.

Caso real y bien concreto — el footer tiene 5 medios de pago (número impar), así que el último queda solo en la fila final de la grilla de 2 columnas:
```css
/* estilosIndex.css */
.payment-card-badge:nth-child(5) {
  grid-column: 1 / -1;  /* ocupa las 2 columnas */
  justify-self: center; /* y se centra, en vez de pegarse a la izquierda */
  width: 120px;
}
```

Y también se usa para ajustar el tamaño de dos logos puntuales que se ven muy chicos con el tamaño estándar:
```css
/* 4º elemento: BancoEstado / CuentaRUT */
.payment-card-badge:nth-child(4) img { width: 36px; height: 24px; }

/* 5º elemento: CMR Falabella */
.payment-card-badge:nth-child(5) img { width: 38px; height: 26px; }
```

**Para recordar:** `nth-child(5)` es una posición **fija**. Si en el HTML se agregara o quitara un medio de pago antes del quinto, este selector empezaría a apuntar a otro elemento sin que nadie lo haya tocado — es un acoplamiento silencioso entre el CSS y el orden exacto del HTML que hay que tener presente al editar cualquiera de los dos.

---

## 6. Pseudo-elementos `::before` y `::after`

Un pseudo-elemento genera una "caja" extra alrededor del contenido de un elemento, sin necesitar una etiqueta nueva en el HTML. Necesitan `content` (aunque sea vacío, `content:""`) para poder verse.

Ejemplo real — el logo de la marca es un cuadrado de color con una cruz dibujada **enteramente en CSS**, sin ninguna imagen:
```css
/* estilos.css */
.logo-mark{
  width:30px; height:30px;
  background:var(--brand);
  border-radius:4px;
  position:relative; /* necesario para que los ::before/::after se ubiquen respecto a este elemento */
  flex:none;
}
.logo-mark::before,.logo-mark::after{
  content:"";
  position:absolute;
  background:var(--accent);
}
.logo-mark::before{ width:12px; height:3px; top:8px; left:9px; } /* la barra horizontal */
.logo-mark::after{ width:3px; height:12px; top:8px; left:9px; }  /* la barra vertical */
```
La barra horizontal y la vertical, superpuestas en el mismo punto, forman la cruz del logo. Es un truco muy común: evita pedir una imagen/ícono solo para una forma geométrica simple.

**Para recordar:** `::before` y `::after` casi siempre van de la mano de `position:relative` en el elemento padre y `position:absolute` en ellos mismos, para poder ubicarlos con precisión adentro.

---

## 7. Flexbox

Flexbox (`display:flex`) ordena elementos en una fila o columna, y resuelve fácilmente cosas como "centrar verticalmente" o "repartir el espacio sobrante" que con floats era muy incómodo. Es el layout más usado en todo el proyecto para barras (header, footer, sidebar).

Ejemplo real — la barra de navegación separa logo / menú / carrito en 3 grupos con un solo `justify-content:space-between` (`estilos.css`):
```css
.nav{
  display:flex;
  align-items:center;         /* centra verticalmente logo, menú y carrito */
  justify-content:space-between; /* el espacio sobrante se reparte entre los grupos */
  gap:24px;
  padding-block:14px;
}
```

Otro caso real, la barra lateral del panel de administración, que además usa `flex-direction:column` para apilar en vertical y `justify-content:space-between` para empujar el menú de "Perfil" hasta abajo del todo (`admin.css`):
```css
.admin-sidebar{
  display:flex;
  flex-direction:column;         /* apila en vertical, no en fila */
  justify-content:space-between; /* separa el menú de arriba del de abajo */
  padding:24px 0;
}
```

Y el patrón de "control tipo stepper" (menos / input / más) que se ve como una sola pieza, gracias a `display:inline-flex` (`estilos.css`):
```css
.qty{
  display:inline-flex;
  align-items:center;
  border:1px solid var(--line-strong);
  border-radius:var(--radius);
}
```

**Para recordar:** `justify-content` mueve los elementos en el eje **principal** (horizontal si `flex-direction` es `row`, el valor por defecto); `align-items` los mueve en el eje **cruzado** (vertical, en ese mismo caso). `gap` reemplaza los márgenes manuales entre elementos flex.

---

## 8. CSS Grid

Grid ordena elementos en **filas y columnas a la vez**, algo que flexbox no resuelve bien cuando necesitás alinear cosas en dos dimensiones (por ejemplo, un catálogo de tarjetas).

Ejemplo real — el catálogo de productos usa una grilla de 3 columnas iguales (`estilos.css`):
```css
.grid{ display:grid; gap:28px; }
.grid-3{ grid-template-columns:repeat(3,1fr); }
```
`repeat(3,1fr)` es una forma corta de escribir `1fr 1fr 1fr`: 3 columnas que se reparten el espacio disponible **en partes iguales** (`1fr` = "1 fracción del espacio libre").

Ejemplo real de columnas de **ancho fijo** en vez de fraccionario — la grilla de logos de medios de pago (`estilosIndex.css`):
```css
.payment-methods {
  display: grid;
  grid-template-columns: repeat(2, 120px); /* 2 columnas de exactamente 120px, no proporcionales */
  gap: 10px;
}
```

Y la ficha de producto, que usa grid para poner la imagen y la información **lado a lado** (`estilos.css`):
```css
.product-detail{
  display:grid;
  grid-template-columns:1fr 1fr; /* 2 columnas iguales */
  gap:44px;
  align-items:start;
}
```

**Para recordar:** usá **flexbox** cuando pensás en una sola fila o columna que se puede "encoger o crecer" (una barra de navegación, un grupo de botones). Usá **grid** cuando pensás en una cuadrícula real con filas y columnas (un catálogo, un formulario de 2 columnas, un layout de página completo).

---

## 9. `position: sticky` y `position: relative/absolute`

`position:sticky` hace que un elemento se comporte normal (como si tuviera `position:static`) **hasta** que el scroll llega a cierto punto, y ahí se "pega" a ese punto y deja de moverse con el resto de la página.

Ejemplo real — el header queda fijo arriba al hacer scroll (`estilos.css`):
```css
.site-header{
  position:sticky;
  top:0;    /* se pega cuando su borde superior llega al top de la ventana */
  z-index:50; /* para que quede por encima del resto del contenido al superponerse */
}
```

`position:relative` + `position:absolute` es el combo para ubicar un elemento **dentro de** otro con coordenadas exactas, sin sacarlo del flujo normal del resto de la página. Ya lo vimos en `.logo-mark` (sección 6); otro ejemplo real es la etiqueta que aparece sobre la imagen de una tarjeta de blog/producto (`estilos.css`):
```css
.media{
  position:relative; /* el "ancla" para el hijo absoluto */
  overflow:hidden;
}
.media-tag{
  position:absolute;
  bottom:10px; left:10px; /* posición exacta respecto a .media, no respecto a la página */
}
```

**Para recordar:** un elemento con `position:absolute` se posiciona respecto a su **ancestro posicionado** más cercano (el primero que tenga `position` distinto de `static` subiendo en el árbol) — por eso casi siempre aparecen en pareja con un `position:relative` en el contenedor.

---

## 10. Diseño responsivo con media queries

Una media query aplica un bloque de CSS **solo si** se cumple una condición sobre el viewport (ancho de pantalla, en este proyecto). Es la técnica base del diseño responsivo.

Ejemplo real — el menú horizontal se esconde y aparece el botón ☰ en pantallas angostas (`estilos.css`):
```css
@media (max-width:820px){
  .nav-toggle{ display:inline-flex; }
  .nav-links{
    display:none;
    width:100%;
    flex-direction:column;
  }
  .nav-links.open{ display:flex; } /* JS agrega .open al hacer clic en el ☰ */
}
```

Y el catálogo de productos, que va bajando de 3 a 2 y de 2 a 1 columna según el ancho disponible, con **dos** media queries encadenadas (`estilos.css`):
```css
.grid-3{ grid-template-columns:repeat(3,1fr); }

@media (max-width:900px){
  .grid-3{ grid-template-columns:repeat(2,1fr); }
}
@media (max-width:640px){
  .grid-3,.grid-2{ grid-template-columns:1fr; }
}
```

**Para recordar:** el proyecto usa siempre `max-width` (aplica el bloque cuando la pantalla es **igual o más angosta** que ese valor), lo que se conoce como enfoque "desktop-first": se diseña primero para pantallas grandes y se van "achicando" cosas para pantallas chicas. El enfoque contrario (`min-width`, "mobile-first") es igual de válido, pero no es el que usa este proyecto.

---

## 11. Unidades: `px`, `rem`, `em`, `%`, `ch`, `vw`

El proyecto mezcla varias unidades a propósito, cada una para lo que resuelve mejor:

| Unidad | Qué significa | Ejemplo real |
|---|---|---|
| `px` | Píxeles fijos, no cambian con nada | `border:1px solid var(--line)` |
| `rem` | Relativo al tamaño de fuente del `<html>` (por defecto 16px) | *(no se usa directo en este proyecto: usa `px` y `%` para tamaños de fuente base, y `em`/`rem` mezclados en paddings)* |
| `em` | Relativo al tamaño de fuente **del propio elemento** | `.btn{ padding:.7em 1.3em; }` |
| `%` | Relativo al tamaño del contenedor padre | `img{ max-width:100%; }` |
| `ch` | El ancho aproximado del carácter `"0"` en esa fuente — ideal para limitar el largo de una línea de texto | `p{ max-width:66ch; }` |
| `vw` | 1% del ancho de la ventana del navegador | `h1{ font-size:clamp(2rem,4vw,2.75rem); }` |

Ejemplo real de por qué `em` en el padding de un botón es útil (`estilos.css`):
```css
.btn{ padding:.7em 1.3em; font-size:.92rem; }
.btn.small{ padding:.45em .9em; font-size:.82rem; }
```
Como el padding está en `em`, al cambiar el `font-size` en `.btn.small` el padding se **reduce proporcionalmente solo** — no hace falta recalcular a mano cuánto padding le corresponde a la versión chica del botón.

Ejemplo real de `ch` para texto legible (`estilos.css`):
```css
p{ margin:0 0 1em; color:var(--ink-soft); max-width:66ch; }
.blog-body{ max-width:70ch; }
```
66-70 caracteres por línea es el ancho que la tipografía suele considerar más cómodo de leer; por eso el proyecto lo usa tanto en párrafos sueltos como en el cuerpo del blog.

**Para recordar:** usá `px` para bordes y detalles finos que no deberían escalar; `%`/`ch`/`vw` para lo que depende del contenedor o de la pantalla; `em` cuando querés que algo escale junto con el tamaño de fuente de ese mismo elemento.

---

## 12. `clamp()`: tipografía fluida sin media queries

`clamp(mínimo, preferido, máximo)` le dice al navegador: "usa el valor preferido, pero nunca bajes del mínimo ni subas del máximo". Es una forma de hacer que un tamaño de fuente cambie **suavemente** con el ancho de pantalla, sin tener que escribir una media query para cada punto de quiebre.

Ejemplo real (`estilos.css`):
```css
h1{ font-size:clamp(2rem,4vw,2.75rem); font-weight:700; }
h2{ font-size:clamp(1.4rem,2.5vw,1.9rem); }
```
Para `h1`: en pantallas muy angostas nunca baja de `2rem` (32px), en pantallas muy anchas nunca sube de `2.75rem` (44px), y en el medio va escalando según el `4vw` (4% del ancho de la ventana).

**Para recordar:** `clamp()` reemplaza el patrón viejo de "definir un tamaño de fuente distinto en cada media query" con una sola línea que escala de forma continua.

---

## 13. `aspect-ratio` y `object-fit`

`aspect-ratio` fija la proporción ancho:alto de una caja, sin que dependa de que la imagen de adentro tenga exactamente esa proporción. `object-fit` controla cómo una imagen (o video) se **recorta o encoge** para llenar esa caja sin deformarse.

Ejemplo real — el proyecto define 3 variantes de proporción para reusar la misma tarjeta (`.card`) en distintos contextos (`estilos.css`):
```css
.media--card{ aspect-ratio:16/10; }   /* tarjetas de blog/catálogo */
.media--square{ aspect-ratio:1/1; }   /* ficha de producto */
.media--wide{ aspect-ratio:21/8; margin-bottom:28px; } /* portadas */

.media img{
  width:100%;
  height:100%;
  object-fit:cover; /* recorta la imagen para llenar la caja, sin estirarla */
  display:block;
}
```
Si una imagen no tiene exactamente la proporción de la caja (por ejemplo, una foto rectangular dentro de `.media--square`), `object-fit:cover` la recorta por los bordes en vez de deformarla o dejar espacios en blanco.

**Para recordar:** `aspect-ratio` define **la caja**; `object-fit` define **cómo se comporta el contenido** dentro de esa caja. Casi siempre van juntas cuando hay imágenes de tamaños desconocidos (como las que trae una API externa, tal como pasa en este catálogo).

---

## 14. Gradientes (`linear-gradient`)

`linear-gradient()` genera un degradado de colores como valor de `background`, sin necesitar ninguna imagen.

Ejemplo real — el fondo de respaldo de `.media` (se ve mientras carga la imagen del producto, o si no hay ninguna) usa un degradado de 3 colores de marca (`estilos.css`):
```css
.media{
  background:linear-gradient(135deg,var(--brand) 0%,var(--brand-2) 60%,#4A6E9C 100%);
}
```
`135deg` es el ángulo del degradado (diagonal, de arriba-izquierda a abajo-derecha); los porcentajes (`0%`, `60%`, `100%`) marcan en qué punto del recorrido está cada color.

Ejemplo real de degradado usado sobre **texto**, con el truco de "recortar" el fondo con la forma del texto (`estilosIndex.css`):
```css
.hero-title {
  background: linear-gradient(90deg, #ffffff, #93c5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; /* el texto se vuelve "invisible" y deja ver el gradiente de fondo recortado con su forma */
}
```

**Para recordar:** `background-clip:text` + `color:transparent` (o su prefijo `-webkit-`) es el patrón estándar para lograr "texto con degradado" en CSS puro.

---

## 15. Tipografías: `@import` y pilas de `font-family`

`@import` trae una hoja de estilos externa — en este caso, Google Fonts. Va **al principio del archivo**, antes de cualquier otra regla.

Ejemplo real (`estilos.css`, primera línea con contenido real):
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
```
Trae 3 familias con pesos específicos (`wght@500;600;700`, por ejemplo) — pedir solo los pesos que realmente se usan hace que la descarga sea más liviana que traer la familia completa.

Luego, cada familia se guarda en una variable con una **pila de respaldo** (`font-family` con varias opciones separadas por coma: si la primera no está disponible, el navegador prueba la siguiente):
```css
--font-display: 'Space Grotesk', 'Segoe UI', sans-serif;
--font-body:    'Inter', 'Segoe UI', sans-serif;
--font-data:    'JetBrains Mono', 'Courier New', monospace;
```
`--font-data` (monoespaciada) se reserva a propósito para precios y datos técnicos, para que se vean "de ficha técnica":
```css
.price{ font-family:var(--font-data); font-weight:500; color:var(--brand); }
```

**Para recordar:** siempre terminá una pila de `font-family` con una familia **genérica** (`sans-serif`, `serif`, `monospace`) como último recurso — así, aunque fallen todas las fuentes anteriores (por ejemplo, sin conexión a internet), el navegador elige igual una fuente razonable de esa categoría.

---

## 16. Transiciones y `transform`

`transition` anima el cambio de una propiedad a lo largo de un tiempo, en vez de que el cambio sea instantáneo. `transform` mueve, rota o escala un elemento sin afectar el layout de los elementos vecinos (a diferencia de cambiar `margin` o `top`, por ejemplo).

Ejemplo real de ambas combinadas — el efecto de "botón presionado" al hacer clic (`estilos.css`):
```css
.btn{
  transition:background .15s ease, transform .1s ease;
}
.btn:hover{ background:var(--brand-2); }
.btn:active{ transform:translateY(1px); } /* lo "empuja" 1px hacia abajo mientras se mantiene presionado */
```
Se pueden animar **varias propiedades a la vez** separándolas por coma, cada una con su propia duración si hace falta (acá `background` tarda .15s y `transform` tarda .1s).

Otro ejemplo real, el chip de medio de pago que se ilumina al pasar el mouse (`estilosIndex.css`):
```css
.payment-card-badge {
  transition: all 0.2s ease;
}
.payment-card-badge:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.3);
}
```
Acá se usó `transition: all`, que anima **cualquier** propiedad que cambie (más simple de escribir, aunque un poco menos preciso que listar cada propiedad a mano como en `.btn`).

**Para recordar:** sin `transition`, cualquier cambio de estilo (por `:hover` o por una clase que agrega JS) se aplica de golpe. `transition` es lo que convierte ese cambio en una animación suave.

---

## 17. Estados dinámicos controlados por clases (`.active`, `.invalid`, `.show`)

Un patrón que se repite en todo el proyecto: el **CSS define cómo se ve cada estado**, y el **JavaScript solo agrega o quita una clase** — nunca cambia estilos directamente desde el JS. Esto separa responsabilidades: el diseño vive en el CSS, la lógica vive en el JS.

Ejemplo real — los filtros de categoría del catálogo (`estilos.css`):
```css
.filter-btn.active{
  background:var(--brand);
  border-color:var(--brand);
  color:#fff;
}
```
`catalogo.js` solo hace algo como `boton.classList.add("active")`; nunca escribe `boton.style.background = "..."` a mano.

Ejemplo real del sistema de validación de formularios, donde **el mismo mecanismo** decide si se muestra o no un mensaje de error (`estilos.css`):
```css
.field .error-msg{
  display:none; /* oculto por defecto */
}
.field.invalid .error-msg{ display:block; } /* solo se muestra si el .field padre tiene .invalid */

.field.invalid input{ border-color:var(--danger); }
.field.valid input{ border-color:var(--ok); }
```
El JS de validación (`registro.js`, `contacto.js`, etc.) solo necesita alternar `.invalid`/`.valid` en el `.field`; el CSS se encarga de que eso se traduzca en "borde rojo + mensaje visible" o "borde verde", sin que el JS toque ni un `style` a mano.

**Para recordar:** este patrón (clase = estado, CSS = apariencia de ese estado) es mucho más fácil de mantener que ir cambiando estilos inline desde JavaScript, porque todo el diseño de un componente queda junto en un solo lugar (el CSS), en vez de repartido entre el CSS y el JS.

---

## 18. `:focus` y accesibilidad visual

`:focus` aplica cuando un elemento está **seleccionado por teclado** (tab) o por clic, en campos de formulario. Quitar el estilo de foco sin reemplazarlo por nada (algo muy común, por accidente, con `outline:none`) es un problema serio de accesibilidad: alguien que navega solo con teclado deja de ver dónde está parado.

Ejemplo real, que **sí** reemplaza el foco por defecto del navegador por uno propio, en vez de eliminarlo (`estilos.css`):
```css
.field input:focus,
.field textarea:focus,
.field select:focus{
  outline:2px solid var(--brand);
  outline-offset:1px; /* separa el contorno un poco del borde del input, para que no se solapen */
}
```

**Para recordar:** nunca hagas `outline:none` sin poner otro indicador visual de foco en su lugar — es una de las causas más comunes de que un sitio sea inaccesible para navegación por teclado.

---

## 19. Selectores de atributo (`[aria-current="page"]`)

Un selector de atributo apunta a elementos que tengan un atributo HTML específico (con o sin un valor exacto), sin necesitar una clase extra.

Ejemplo real — el link activo del menú se marca en el HTML con `aria-current="page"` (un atributo de accesibilidad, no una clase), y el CSS lo usa directamente como selector (`estilos.css`):
```css
.nav-links a:hover,
.nav-links a[aria-current="page"]{
  color:var(--ink);
  border-color:var(--accent);
}
```
Esto resuelve dos cosas a la vez con una sola regla: le da estilo al link activo, **y** aprovecha un atributo que ya estaba puesto por motivos de accesibilidad (para que lectores de pantalla anuncien "página actual"), en vez de agregar una clase `.active` redundante solo para el CSS.

Mismo patrón en el panel de admin (`admin.css`):
```css
.admin-sidebar a[aria-current="page"]{
  background:var(--brand);
  color:#fff;
}
```

**Para recordar:** cuando un atributo de accesibilidad ya describe el estado que necesitás (como "esta es la página actual"), usarlo también como selector CSS evita duplicar esa información en una clase aparte.

---

## 20. Buenas prácticas y errores reales del proyecto

Vale la pena aprender también de los problemas reales que tiene el CSS del proyecto (documentados en `CSS_TecnoFactory.md`), porque son errores muy comunes:

- **Bloque de código duplicado:** todo el estilo de `.payment-methods`/`.payment-card-badge` está escrito **completo dos veces** en `estilos.css` (una vez cerca de `.footer-grid`, otra vez al final del archivo) y **una tercera vez** en `estilosIndex.css`. Funciona porque CSS permite declarar la misma regla varias veces (la última que aparece "gana" si tienen la misma especificidad), pero mantenerlo así significa que cualquier cambio futuro hay que hacerlo en 2 o 3 lugares a la vez, y es fácil olvidarse de alguno.
- **Clases definidas pero nunca usadas:** `.price-old` y las variantes `.stock-tag.ok`/`.stock-tag.low` están completas en el CSS, pero ningún HTML ni JS del proyecto las usa todavía (no hay funcionalidad de descuentos ni de "stock bajo" implementada). No es un error en sí, pero es útil poder distinguir "CSS que se usa" de "CSS que quedó preparado para algo que no se terminó".
- **Estilos inline mezclados con clases:** varios HTML (`productos.html`, por ejemplo) tienen `style="..."` puesto directo en la etiqueta además de sus clases (`style="border-top-width: 5px; ..."` en el footer). Esto funciona, pero rompe la idea de "todo el diseño vive en el CSS": si mañana hay que cambiar ese valor, hay que acordarse de buscarlo en el HTML, no en la hoja de estilos.

**Para recordar:** que algo "funcione" no significa que esté bien organizado. Repetir código, dejar reglas sin usar, o mezclar estilos inline con clases son señales normales de un proyecto que fue creciendo con el tiempo — identificarlas es el primer paso para ir limpiándolas.

---

## 21. Ejercicios propuestos

1. Elegí una de las 3 copias del bloque `.payment-methods`/`.payment-card-badge` y dejala como la única fuente de verdad, borrando las otras dos sin que el footer cambie visualmente.
2. Agregale a `.stock-tag` una clase `.critico` (además de `.ok`/`.low` que ya existen) con un color propio, y probala en un `<span>` de ejemplo.
3. Cambiá `.grid-3` para que en vez de 3 columnas iguales use `grid-template-columns: 2fr 1fr 1fr` y observá cómo cambia el tamaño relativo de las tarjetas.
4. Usando `clamp()`, hacé que `.price` tenga un tamaño de fuente que crezca un poco en pantallas grandes (por ejemplo, entre `1rem` y `1.3rem`).
5. Agregale una `transition` a `.admin-sidebar a` para que el cambio de fondo en `:hover` sea suave en vez de instantáneo.
6. Escribí una media query nueva (`max-width:480px`) que reduzca el `padding` de `.admin-content` para que se vea mejor en celulares angostos.

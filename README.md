# TecnoFactory

E-Commerce de venta de PC, accesorios y productos tecnológicos.

Todo el sistema (tienda y panel de administración) está hecho en **React 19 + Vite +
react-router-dom v7** (`createBrowserRouter`). `react-bootstrap` solo se usa en el Home.

## Comandos

```bash
npm install
npm run dev       # desarrollo  -> http://localhost:5173
npm run build     # build de producción (dist/) + dist/404.html
npm run preview   # sirve el build
npm test          # tests (vitest)
npm run lint      # oxlint
```

## Rutas (`src/router.jsx`)

### Tienda (públicas)

| Ruta                   | Página                 |
| ---------------------- | ---------------------- |
| `/`                    | Home                   |
| `/productos`           | Catálogo con filtros   |
| `/productos/:codigo`   | Ficha de producto      |
| `/carrito`             | Carrito                |
| `/nosotros`            | Nosotros               |
| `/blogs`, `/blogs/:slug` | Blog                 |
| `/contacto`            | Formulario de contacto |
| `/iniciar-sesion`, `/registro` | Cuenta         |

### Panel de administración (`/admin/*`)

Protegido por `RequireRole` (reemplaza al antiguo `admin-guard.js`):

| Ruta                          | Quién entra            |
| ----------------------------- | ---------------------- |
| `/admin`                      | Administrador, Vendedor|
| `/admin/productos`, `/admin/productos/:codigo` | Administrador, Vendedor (el Vendedor solo lectura) |
| `/admin/productos/nuevo`, `/admin/productos/:codigo/editar` | Solo Administrador |
| `/admin/usuarios`, `/nuevo`, `/:id`, `/:id/editar` | Solo Administrador |

- Sin sesión o con tipo **Cliente** → redirige a `/iniciar-sesion`.
- **Vendedor** que intenta una ruta de solo Administrador → vuelve a `/admin/productos`.
- Reglas de eliminación de usuarios: no se puede borrar la propia cuenta ni al único administrador.

Cada ruta con parámetro usa un *loader*: si el producto/usuario/artículo no existe se muestra un 404
(en la tienda o dentro del panel, según corresponda).

## Datos y sesión

Todo se guarda en `localStorage` (`tf_productos`, `tf_cart`, `tf_usuarios`, `tf_sesion`), por lo
que tienda y panel comparten datos: lo que el admin crea o edita se ve en la tienda.

Cuenta de prueba (administrador): `admin@duoc.cl` / `admin123`.

## Estructura

- `src/router.jsx` mapa de rutas, loaders y `createRouter()`.
- `src/pages/` páginas de la tienda; `src/pages/admin/` páginas del panel; `src/pages/blog/` artículos.
- `src/components/` Header, Footer, ProductCard, FormField, **AdminLayout, RequireRole,
  ProductoForm, UsuarioForm, ImageUrlsField, RegionComunaFields**, etc.
- `src/context/` carrito, sesión y UI del panel.
- `src/services/` acceso a datos (localStorage): productos, carrito, usuarios (CRUD completo).
- `src/data/` catálogo inicial, regiones/comunas, blogs, constantes y roles.
- `src/utils/` validaciones (RUN, correo, contraseña, producto) y formato CLP.
- `src/styles/` `tienda.css` (global), `home.css` (solo Home), `admin.css` (solo panel).
- `src/test/` 28 tests (validaciones, carrito, navegación, roles, CRUD).

## Despliegue

`npm run build` genera además `dist/404.html` (copia de `index.html`) para que hostings estáticos
como GitHub Pages resuelvan URLs como `/productos` o `/admin/usuarios`. Si publicas en un
subdirectorio (p. ej. `/TecnoFactory/`), define `base: '/TecnoFactory/'` en `vite.config.js`;
el router ya respeta esa base.

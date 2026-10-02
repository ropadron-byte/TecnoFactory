# TecnoFactory

E-Commerce de venta de PC, accesorios y productos tecnológicos.

- **Cliente (tienda)**: React 19 + Vite + **react-router-dom v7** (`createBrowserRouter`) + react-bootstrap (solo en el Home).
- **Panel de administración**: sigue siendo HTML/JS estático (`public/admin/`), pendiente de migrar.

## Comandos

```bash
npm install
npm run dev       # desarrollo  -> http://localhost:5173
npm run build     # build de producción (carpeta dist/)
npm run preview   # sirve el build
npm test          # tests (vitest)
npm run lint      # oxlint
```

## Rutas del cliente (react-router-dom)

Definidas en `src/router.jsx` como objetos de ruta: layout anidado, páginas con carga diferida (`lazy`), *loaders* que validan producto/artículo (404 → `RouteError`) y `basename` tomado de la base de Vite.

| Ruta                   | Página                 |
| ---------------------- | ---------------------- |
| `/`                  | Home                   |
| `/productos`         | Catálogo con filtros   |
| `/productos/:codigo` | Ficha de producto      |
| `/carrito`           | Carrito                |
| `/nosotros`          | Nosotros               |
| `/blogs`             | Listado de blogs       |
| `/blogs/:slug`       | Detalle de un blog     |
| `/contacto`          | Formulario de contacto |
| `/iniciar-sesion`    | Login                  |
| `/registro`          | Registro de cliente    |

## Despliegue

`npm run build` genera `dist/` y además `dist/404.html` (copia de `index.html`) para que
hostings estáticos como GitHub Pages resuelvan URLs como `/productos`. Si publicas en un
subdirectorio (p. ej. `/TecnoFactory/`), define `base: '/TecnoFactory/'` en `vite.config.js`;
el router y los enlaces al admin ya respetan esa base.

## Datos y sesión

Todo se guarda en `localStorage` con las **mismas claves** que usa el panel admin
(`tf_productos`, `tf_cart`, `tf_usuarios`, `tf_sesion`), por lo que ambos comparten
datos: lo que el admin crea o edita se ve en la tienda.

Cuenta de prueba (administrador): `admin@duoc.cl` / `admin123`.
Al iniciar sesión, Administrador/Vendedor son enviados a `/admin/pages/admin/home.html`.

## Estructura

- `src/router.jsx` mapa de rutas, loaders y `createRouter()`.
- `src/pages/` una página por ruta.
- `src/components/` piezas reutilizables (Header, Footer, ProductCard, FormField...).
- `src/context/` estado global (carrito y sesión).
- `src/services/` acceso a datos (localStorage): productos, carrito, usuarios.
- `src/data/` catálogo inicial, regiones/comunas, blogs, constantes.
- `src/utils/` validaciones (RUN, correo, contraseña) y formato CLP.
- `src/styles/` `tienda.css` (global) y `home.css` (solo Home, junto a Bootstrap).
- `public/admin/` panel de administración legado.

// Copia index.html como 404.html: en hostings estáticos (GitHub Pages,
// etc.) una URL como /productos no existe como archivo; el 404.html
// carga la misma SPA y React Router resuelve la ruta.
import { copyFileSync } from 'node:fs'

copyFileSync('dist/index.html', 'dist/404.html')
console.log('dist/404.html creado (fallback para rutas de la SPA)')

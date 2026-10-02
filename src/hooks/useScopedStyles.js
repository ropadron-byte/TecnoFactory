import { useLayoutEffect } from 'react'

/**
 * Inyecta una hoja de estilos SOLO mientras el componente está montado.
 *
 * Bootstrap únicamente se usa en el Home (igual que en el sitio original);
 * si se importara de forma global cambiaría el aspecto de las demás
 * páginas. La hoja se agrega al INICIO del <head> para que las reglas
 * propias de la tienda (tienda.css) sigan ganando por orden de carga.
 */
export default function useScopedStyles(cssText) {
  useLayoutEffect(() => {
    const style = document.createElement('style')
    style.setAttribute('data-scoped-styles', '')
    style.textContent = cssText
    document.head.prepend(style)
    return () => style.remove()
  }, [cssText])
}

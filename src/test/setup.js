import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup, configure } from '@testing-library/react'

// Las páginas se cargan con lazy(); en equipos lentos la primera carga puede tardar más de 1 s.
configure({ asyncUtilTimeout: 15000 })

// jsdom no implementa estas dos funciones del navegador (las usan react-bootstrap y ScrollRestoration)
window.scrollTo = () => {}
window.matchMedia =
  window.matchMedia ||
  (() => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }))

afterEach(() => {
  cleanup()
  localStorage.clear()
})

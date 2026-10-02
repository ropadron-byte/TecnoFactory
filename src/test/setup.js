import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom no implementa scrollTo (lo usa ScrollRestoration)
window.scrollTo = () => {}

afterEach(() => {
  cleanup()
  localStorage.clear()
})

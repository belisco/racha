import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// sem globals no Vitest, a Testing Library não desmonta sozinha entre os testes;
// o replaceState garante que cada teste comece sem hash na URL
afterEach(() => {
  cleanup()
  localStorage.clear()
  window.history.replaceState(null, '', '/')
})

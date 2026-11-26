import { describe, expect, it } from 'vitest'
import { calcularCrc16 } from './pix'

describe('calcularCrc16', () => {
  it('deve devolver 29B1 quando o texto é o vetor de teste "123456789"', () => {
    const texto = '123456789'

    const resultado = calcularCrc16(texto)

    expect(resultado).toBe('29B1')
  })
})

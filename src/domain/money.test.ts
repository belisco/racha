import { describe, expect, it } from 'vitest'
import { formatarCentavos } from './money'

describe('formatarCentavos', () => {
  it('deve formatar com ponto no milhar e vírgula nos centavos quando o valor passa de mil reais', () => {
    const centavos = 1234567

    const resultado = formatarCentavos(centavos)

    expect(resultado).toBe('R$ 12.345,67')
  })
})

import { describe, expect, it } from 'vitest'
import { formatarCentavos } from './money'

describe('formatarCentavos', () => {
  it('deve formatar com ponto no milhar e vírgula nos centavos quando o valor passa de mil reais', () => {
    const centavos = 1234567

    const resultado = formatarCentavos(centavos)

    expect(resultado).toBe('R$ 12.345,67')
  })

  it('deve formatar como "R$ 0,00" quando o valor é zero', () => {
    const centavos = 0

    const resultado = formatarCentavos(centavos)

    expect(resultado).toBe('R$ 0,00')
  })

  it('deve colocar o sinal antes do R$ quando o valor é negativo', () => {
    const centavos = -123405

    const resultado = formatarCentavos(centavos)

    expect(resultado).toBe('-R$ 1.234,05')
  })
})

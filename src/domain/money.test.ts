import { describe, expect, it } from 'vitest'
import { formatarCentavos, interpretarValor } from './money'

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

describe('interpretarValor', () => {
  it('deve devolver centavos quando o texto usa ponto no milhar e vírgula nos centavos', () => {
    const comMilhar = '1.234,56'
    const comUmDigitoDeCentavos = '12,5'

    const resultadoComMilhar = interpretarValor(comMilhar)
    const resultadoComUmDigito = interpretarValor(comUmDigitoDeCentavos)

    expect(resultadoComMilhar).toBe(123456)
    expect(resultadoComUmDigito).toBe(1250)
  })
})

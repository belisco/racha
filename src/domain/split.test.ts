import { describe, expect, it } from 'vitest'
import { ratear } from './split'
import type { Cota } from './split'
import type { Centavos, Parte } from './types'

function montarPartes(quantidade: number): Parte[] {
  return Array.from({ length: quantidade }, (_, indice) => ({
    pessoaId: `pessoa-${indice}`,
    peso: 1,
  }))
}

function somarCotas(cotas: Cota[]): Centavos {
  return cotas.reduce((soma, cota) => soma + cota.valor, 0)
}

describe('ratear', () => {
  it('deve dar o centavo que sobra ao primeiro quando 10000 é dividido entre 3 pessoas', () => {
    const total = 10000
    const partes: Parte[] = [
      { pessoaId: 'ana', peso: 1 },
      { pessoaId: 'bia', peso: 1 },
      { pessoaId: 'caio', peso: 1 },
    ]

    const resultado = ratear(total, partes)

    expect(resultado).toEqual([
      { pessoaId: 'ana', valor: 3334 },
      { pessoaId: 'bia', valor: 3333 },
      { pessoaId: 'caio', valor: 3333 },
    ])
  })
})

describe('ratear, soma das cotas', () => {
  it('deve somar o total quando a divisão não é exata', () => {
    const umCentavoPorDois = ratear(1, montarPartes(2))
    const milPorSete = ratear(1000, montarPartes(7))
    const valorQuebradoPorOnze = ratear(123457, montarPartes(11))

    expect(somarCotas(umCentavoPorDois)).toBe(1)
    expect(somarCotas(milPorSete)).toBe(1000)
    expect(somarCotas(valorQuebradoPorOnze)).toBe(123457)
  })
})

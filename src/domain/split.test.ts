import { describe, expect, it } from 'vitest'
import { ratear, ratearDespesa } from './split'
import type { Cota } from './split'
import type { Centavos, Despesa, Parte } from './types'

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

describe('ratear, pesos', () => {
  it('deve dividir proporcionalmente aos pesos quando os pesos são 1 e 3', () => {
    const total = 10000
    const partes: Parte[] = [
      { pessoaId: 'ana', peso: 1 },
      { pessoaId: 'bia', peso: 3 },
    ]

    const resultado = ratear(total, partes)

    expect(resultado).toEqual([
      { pessoaId: 'ana', valor: 2500 },
      { pessoaId: 'bia', valor: 7500 },
    ])
  })
})

describe('ratear, maior resto', () => {
  it('deve dar o centavo que sobra a quem tem o maior resto quando 100 é dividido com pesos 1 e 2', () => {
    const total = 100
    const partes: Parte[] = [
      { pessoaId: 'ana', peso: 1 },
      { pessoaId: 'bia', peso: 2 },
    ]

    const resultado = ratear(total, partes)

    expect(resultado).toEqual([
      { pessoaId: 'ana', valor: 33 },
      { pessoaId: 'bia', valor: 67 },
    ])
  })
})

describe('ratearDespesa', () => {
  it('deve ratear o valor mais a gorjeta quando a despesa tem 10% de gorjeta', () => {
    const despesa: Despesa = {
      id: 'd1',
      descricao: 'Jantar',
      valor: 10000,
      gorjetaPercentual: 10,
      pagoPor: 'ana',
      partes: [
        { pessoaId: 'ana', peso: 1 },
        { pessoaId: 'bia', peso: 1 },
      ],
    }

    const resultado = ratearDespesa(despesa)

    expect(resultado).toEqual([
      { pessoaId: 'ana', valor: 5500 },
      { pessoaId: 'bia', valor: 5500 },
    ])
  })
})

import { describe, expect, it } from 'vitest'
import { calcularSaldos } from './balances'
import type { Despesa, Pessoa } from './types'

describe('calcularSaldos', () => {
  it('deve creditar quem pagou e debitar cada participante quando a despesa é dividida igualmente', () => {
    const pessoas: Pessoa[] = [
      { id: 'ana', nome: 'Ana' },
      { id: 'bia', nome: 'Bia' },
      { id: 'caio', nome: 'Caio' },
    ]
    const despesa: Despesa = {
      id: 'd1',
      descricao: 'Jantar',
      valor: 9000,
      gorjetaPercentual: 0,
      pagoPor: 'ana',
      partes: [
        { pessoaId: 'ana', peso: 1 },
        { pessoaId: 'bia', peso: 1 },
        { pessoaId: 'caio', peso: 1 },
      ],
    }

    const resultado = calcularSaldos(pessoas, despesa)

    expect(resultado).toEqual(
      new Map([
        ['ana', 6000],
        ['bia', -3000],
        ['caio', -3000],
      ]),
    )
  })
})

import { describe, expect, it } from 'vitest'
import type { Racha } from './types'
import { gerarResumo } from './whatsapp'

const jantarDeSexta: Racha = {
  versao: 1,
  nome: 'Jantar de sexta',
  pessoas: [
    { id: 'ana', nome: 'Ana' },
    { id: 'bruno', nome: 'Bruno' },
    { id: 'caio', nome: 'Caio' },
    { id: 'dani', nome: 'Dani' },
  ],
  despesas: [
    {
      id: 'd1',
      descricao: 'Rodízio',
      valor: 20000,
      gorjetaPercentual: 10,
      pagoPor: 'bruno',
      partes: [
        { pessoaId: 'ana', peso: 1 },
        { pessoaId: 'bruno', peso: 1 },
        { pessoaId: 'caio', peso: 1 },
        { pessoaId: 'dani', peso: 1 },
      ],
    },
    {
      id: 'd2',
      descricao: 'Sobremesa',
      valor: 10000,
      gorjetaPercentual: 0,
      pagoPor: 'ana',
      partes: [
        { pessoaId: 'ana', peso: 1 },
        { pessoaId: 'caio', peso: 1 },
        { pessoaId: 'dani', peso: 1 },
      ],
    },
  ],
}

describe('gerarResumo', () => {
  it('deve começar com o nome, o total com gorjeta e o número de pessoas quando o racha tem despesas', () => {
    const resumo = gerarResumo(jantarDeSexta, [])

    expect(resumo.startsWith('*Racha: Jantar de sexta*\nTotal: R$ 320,00 · 4 pessoas')).toBe(true)
  })
})

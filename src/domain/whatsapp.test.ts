import { describe, expect, it } from 'vitest'
import { calcularSaldos } from './balances'
import { calcularTransferencias } from './settlements'
import type { Racha, Transferencia } from './types'
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

function transferenciasDo(racha: Racha): Transferencia[] {
  return calcularTransferencias(calcularSaldos(racha.pessoas, racha.despesas))
}

describe('gerarResumo', () => {
  it('deve começar com o nome, o total com gorjeta e o número de pessoas quando o racha tem despesas', () => {
    const resumo = gerarResumo(jantarDeSexta, [])

    expect(resumo.startsWith('*Racha: Jantar de sexta*\nTotal: R$ 320,00 · 4 pessoas')).toBe(true)
  })

  it('deve listar uma linha por transferência depois do cabeçalho quando há quem pagar', () => {
    const resumo = gerarResumo(jantarDeSexta, transferenciasDo(jantarDeSexta))

    expect(resumo).toBe(
      [
        '*Racha: Jantar de sexta*',
        'Total: R$ 320,00 · 4 pessoas',
        '',
        'Caio paga R$ 88,33 para Bruno',
        'Dani paga R$ 76,67 para Bruno',
        'Dani paga R$ 11,66 para Ana',
      ].join('\n'),
    )
  })

  it('deve avisar que ninguém deve nada quando não há transferências', () => {
    const semDespesas: Racha = {
      versao: 1,
      nome: 'Almoço',
      pessoas: [
        { id: 'ana', nome: 'Ana' },
        { id: 'bruno', nome: 'Bruno' },
      ],
      despesas: [],
    }

    const resumo = gerarResumo(semDespesas, [])

    expect(resumo.endsWith('\n\nNinguém deve nada.')).toBe(true)
  })

  it('deve usar o singular quando o racha tem uma pessoa só', () => {
    const racha: Racha = {
      versao: 1,
      nome: 'Café',
      pessoas: [{ id: 'ana', nome: 'Ana' }],
      despesas: [],
    }

    const resumo = gerarResumo(racha, [])

    expect(resumo.split('\n')[1]).toBe('Total: R$ 0,00 · 1 pessoa')
  })
})

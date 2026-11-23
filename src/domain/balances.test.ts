import { describe, expect, it } from 'vitest'
import { calcularSaldos } from './balances'
import type { Centavos, Despesa, Pessoa } from './types'

function somarSaldos(saldos: Map<string, Centavos>): Centavos {
  return [...saldos.values()].reduce((soma, saldo) => soma + saldo, 0)
}

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

    const resultado = calcularSaldos(pessoas, [despesa])

    expect(resultado).toEqual(
      new Map([
        ['ana', 6000],
        ['bia', -3000],
        ['caio', -3000],
      ]),
    )
  })

  it('deve deixar com saldo zero, presente no Map, quem não pagou nem participou', () => {
    const pessoas: Pessoa[] = [
      { id: 'ana', nome: 'Ana' },
      { id: 'bia', nome: 'Bia' },
      { id: 'caio', nome: 'Caio' },
      { id: 'dani', nome: 'Dani' },
    ]
    const despesa: Despesa = {
      id: 'd1',
      descricao: 'Lanche',
      valor: 8000,
      gorjetaPercentual: 0,
      pagoPor: 'ana',
      partes: [
        { pessoaId: 'ana', peso: 1 },
        { pessoaId: 'bia', peso: 1 },
      ],
    }

    const resultado = calcularSaldos(pessoas, [despesa])

    expect(resultado.has('caio')).toBe(true)
    expect(resultado.has('dani')).toBe(true)
    expect(resultado.get('caio')).toBe(0)
    expect(resultado.get('dani')).toBe(0)
  })

  it('deve acumular os saldos quando há várias despesas pagas por pessoas diferentes', () => {
    const pessoas: Pessoa[] = [
      { id: 'ana', nome: 'Ana' },
      { id: 'bia', nome: 'Bia' },
    ]
    const partes = [
      { pessoaId: 'ana', peso: 1 },
      { pessoaId: 'bia', peso: 1 },
    ]
    const despesas: Despesa[] = [
      { id: 'd1', descricao: 'Lanche', valor: 1000, gorjetaPercentual: 0, pagoPor: 'ana', partes },
      { id: 'd2', descricao: 'Jantar', valor: 3000, gorjetaPercentual: 0, pagoPor: 'bia', partes },
    ]

    const resultado = calcularSaldos(pessoas, despesas)

    expect(resultado).toEqual(
      new Map([
        ['ana', -1000],
        ['bia', 1000],
      ]),
    )
  })

  it('deve manter a soma dos saldos em zero quando há várias despesas com gorjeta e divisão inexata', () => {
    const pessoas: Pessoa[] = [
      { id: 'ana', nome: 'Ana' },
      { id: 'bruno', nome: 'Bruno' },
      { id: 'caio', nome: 'Caio' },
      { id: 'dani', nome: 'Dani' },
    ]
    const despesas: Despesa[] = [
      {
        id: 'd1',
        descricao: 'Jantar de sexta',
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
    ]

    const resultado = calcularSaldos(pessoas, despesas)

    expect(somarSaldos(resultado)).toBe(0)
  })
})

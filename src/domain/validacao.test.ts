import { describe, expect, it } from 'vitest'
import type { Despesa, Racha } from './types'
import { ehRachaValido } from './validacao'

const pizza: Despesa = {
  id: 'd1',
  descricao: 'Pizza',
  valor: 9000,
  gorjetaPercentual: 10,
  pagoPor: 'ana',
  partes: [
    { pessoaId: 'ana', peso: 1 },
    { pessoaId: 'bruno', peso: 2 },
  ],
}

const rachaValido: Racha = {
  versao: 1,
  nome: 'Pizza de domingo',
  pessoas: [
    { id: 'ana', nome: 'Ana', chavePix: 'ana@exemplo.com' },
    { id: 'bruno', nome: 'Bruno' },
  ],
  despesas: [pizza],
}

function comDespesa(mudancas: Record<string, unknown>): unknown {
  return { ...rachaValido, despesas: [{ ...pizza, ...mudancas }] }
}

describe('ehRachaValido', () => {
  it('deve aceitar quando o racha tem pessoas e despesas coerentes', () => {
    expect(ehRachaValido(rachaValido)).toBe(true)
  })

  it('deve recusar quando o valor não é um objeto', () => {
    expect(ehRachaValido([rachaValido])).toBe(false)
  })

  it('deve recusar quando a versão não é 1', () => {
    expect(ehRachaValido({ ...rachaValido, versao: 2 })).toBe(false)
  })

  it('deve recusar quando uma pessoa não tem id', () => {
    const racha = { ...rachaValido, pessoas: [{ nome: 'Ana' }], despesas: [] }

    expect(ehRachaValido(racha)).toBe(false)
  })

  it('deve recusar quando duas pessoas têm o mesmo id', () => {
    const racha = {
      ...rachaValido,
      pessoas: [
        { id: 'ana', nome: 'Ana' },
        { id: 'ana', nome: 'Outra Ana' },
      ],
      despesas: [],
    }

    expect(ehRachaValido(racha)).toBe(false)
  })

  it('deve recusar quando quem pagou não é pessoa do racha', () => {
    expect(ehRachaValido(comDespesa({ pagoPor: 'zeca' }))).toBe(false)
  })

  it('deve recusar quando um participante não é pessoa do racha', () => {
    expect(ehRachaValido(comDespesa({ partes: [{ pessoaId: 'zeca', peso: 1 }] }))).toBe(false)
  })

  it('deve recusar quando a despesa não tem participantes', () => {
    expect(ehRachaValido(comDespesa({ partes: [] }))).toBe(false)
  })

  it('deve recusar quando um peso é zero', () => {
    expect(ehRachaValido(comDespesa({ partes: [{ pessoaId: 'ana', peso: 0 }] }))).toBe(false)
  })

  it('deve recusar quando o valor não é um inteiro positivo de centavos', () => {
    expect(ehRachaValido(comDespesa({ valor: 10.5 }))).toBe(false)
  })

  it('deve recusar quando a gorjeta passa de 30%', () => {
    expect(ehRachaValido(comDespesa({ gorjetaPercentual: 31 }))).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'
import type { Racha } from '../domain/types'
import { type Armazenamento, CHAVE_DO_RACHA, carregarRacha, salvarRacha } from './storage'

function criarArmazenamentoFalso(): Armazenamento {
  const dados = new Map<string, string>()

  return {
    getItem: (chave) => dados.get(chave) ?? null,
    setItem: (chave, valor) => {
      dados.set(chave, valor)
    },
  }
}

describe('storage', () => {
  it('deve carregar o mesmo racha quando ele foi salvo antes', () => {
    const armazenamento = criarArmazenamentoFalso()
    const racha: Racha = {
      versao: 1,
      nome: 'Jantar de sexta',
      pessoas: [
        { id: 'ana', nome: 'Ana', chavePix: 'ana@exemplo.com' },
        { id: 'bruno', nome: 'Bruno' },
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
          ],
        },
      ],
    }

    salvarRacha(armazenamento, racha)
    const resultado = carregarRacha(armazenamento)

    expect(resultado).toEqual(racha)
  })

  it('deve devolver o racha vazio quando não há nada salvo', () => {
    const armazenamento = criarArmazenamentoFalso()

    const resultado = carregarRacha(armazenamento)

    expect(resultado).toEqual({ versao: 1, nome: '', pessoas: [], despesas: [] })
  })

  it('deve devolver o racha vazio quando o texto salvo não é JSON', () => {
    const armazenamento = criarArmazenamentoFalso()
    armazenamento.setItem(CHAVE_DO_RACHA, '{isto não é json')

    const resultado = carregarRacha(armazenamento)

    expect(resultado).toEqual({ versao: 1, nome: '', pessoas: [], despesas: [] })
  })

  it('deve devolver o racha vazio quando o JSON salvo não tem o formato de um racha', () => {
    const armazenamento = criarArmazenamentoFalso()
    armazenamento.setItem(CHAVE_DO_RACHA, '{"versao":2,"pessoas":"nenhuma"}')

    const resultado = carregarRacha(armazenamento)

    expect(resultado).toEqual({ versao: 1, nome: '', pessoas: [], despesas: [] })
  })

  it('deve devolver o racha vazio quando o JSON salvo é nulo', () => {
    const armazenamento = criarArmazenamentoFalso()
    armazenamento.setItem(CHAVE_DO_RACHA, 'null')

    const resultado = carregarRacha(armazenamento)

    expect(resultado).toEqual({ versao: 1, nome: '', pessoas: [], despesas: [] })
  })
})

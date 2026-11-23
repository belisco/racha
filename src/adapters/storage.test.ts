import { describe, expect, it } from 'vitest'
import type { Racha } from '../domain/types'
import { type Armazenamento, carregarRacha, salvarRacha } from './storage'

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
})

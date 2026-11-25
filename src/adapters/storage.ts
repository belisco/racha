import type { Racha } from '../domain/types'
import { ehRachaValido } from '../domain/validacao'

// só o pedaço do localStorage que o adaptador usa, para os testes injetarem um falso
export type Armazenamento = Pick<Storage, 'getItem' | 'setItem'>

export const CHAVE_DO_RACHA = 'racha'

export function criarRachaVazio(): Racha {
  return { versao: 1, nome: '', pessoas: [], despesas: [] }
}

export function salvarRacha(armazenamento: Armazenamento, racha: Racha): void {
  armazenamento.setItem(CHAVE_DO_RACHA, JSON.stringify(racha))
}

export function carregarRacha(armazenamento: Armazenamento): Racha {
  const texto = armazenamento.getItem(CHAVE_DO_RACHA)

  if (texto === null) {
    return criarRachaVazio()
  }

  try {
    const valor: unknown = JSON.parse(texto)
    return ehRachaValido(valor) ? valor : criarRachaVazio()
  } catch {
    return criarRachaVazio()
  }
}

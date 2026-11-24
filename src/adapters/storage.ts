import type { Racha } from '../domain/types'

// só o pedaço do localStorage que o adaptador usa, para os testes injetarem um falso
export type Armazenamento = Pick<Storage, 'getItem' | 'setItem'>

export const CHAVE_DO_RACHA = 'racha'

export function criarRachaVazio(): Racha {
  return { versao: 1, nome: '', pessoas: [], despesas: [] }
}

function pareceRacha(valor: unknown): valor is Racha {
  if (typeof valor !== 'object' || valor === null) {
    return false
  }

  const racha = valor as Record<string, unknown>

  return (
    racha.versao === 1 &&
    typeof racha.nome === 'string' &&
    Array.isArray(racha.pessoas) &&
    Array.isArray(racha.despesas)
  )
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
    return pareceRacha(valor) ? valor : criarRachaVazio()
  } catch {
    return criarRachaVazio()
  }
}

import type { Racha } from '../domain/types'

// só o pedaço do localStorage que o adaptador usa, para os testes injetarem um falso
export type Armazenamento = Pick<Storage, 'getItem' | 'setItem'>

export const CHAVE_DO_RACHA = 'racha'

export function salvarRacha(armazenamento: Armazenamento, racha: Racha): void {
  armazenamento.setItem(CHAVE_DO_RACHA, JSON.stringify(racha))
}

export function carregarRacha(armazenamento: Armazenamento): Racha {
  return JSON.parse(armazenamento.getItem(CHAVE_DO_RACHA)!) as Racha
}

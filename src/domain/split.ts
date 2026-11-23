import type { Centavos, Parte } from './types'

export type Cota = { pessoaId: string; valor: Centavos }

export function ratear(total: Centavos, partes: Parte[]): Cota[] {
  const base = Math.floor(total / partes.length)
  const sobra = total % partes.length

  return partes.map((parte, indice) => ({
    pessoaId: parte.pessoaId,
    valor: base + (indice < sobra ? 1 : 0),
  }))
}

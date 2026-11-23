import type { Centavos, Parte } from './types'

export type Cota = { pessoaId: string; valor: Centavos }

export function ratear(total: Centavos, partes: Parte[]): Cota[] {
  const somaDosPesos = partes.reduce((soma, parte) => soma + parte.peso, 0)
  const pisos = partes.map((parte) => Math.floor((total * parte.peso) / somaDosPesos))
  const somaDosPisos = pisos.reduce((soma, piso) => soma + piso, 0)
  const sobra = total - somaDosPisos

  return partes.map((parte, indice) => ({
    pessoaId: parte.pessoaId,
    valor: pisos[indice] + (indice < sobra ? 1 : 0),
  }))
}

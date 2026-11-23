import type { Centavos, Despesa, Parte } from './types'

export type Cota = { pessoaId: string; valor: Centavos }

export function ratear(total: Centavos, partes: Parte[]): Cota[] {
  if (partes.length === 0) {
    throw new Error('É preciso ter pelo menos uma parte para ratear')
  }

  const somaDosPesos = partes.reduce((soma, parte) => soma + parte.peso, 0)
  const calculos = partes.map((parte, indice) => {
    const produto = total * parte.peso
    return {
      indice,
      piso: Math.floor(produto / somaDosPesos),
      resto: produto % somaDosPesos,
    }
  })
  const somaDosPisos = calculos.reduce((soma, calculo) => soma + calculo.piso, 0)
  const sobra = total - somaDosPisos

  // o sort é estável: em empate de resto, quem vem primeiro na lista fica na frente
  const indicesPremiados = new Set(
    [...calculos]
      .sort((a, b) => b.resto - a.resto)
      .slice(0, sobra)
      .map((calculo) => calculo.indice),
  )

  return partes.map((parte, indice) => ({
    pessoaId: parte.pessoaId,
    valor: calculos[indice].piso + (indicesPremiados.has(indice) ? 1 : 0),
  }))
}

export function calcularGorjeta(valor: Centavos, percentual: number): Centavos {
  return Math.round((valor * percentual) / 100)
}

export function ratearDespesa(despesa: Despesa): Cota[] {
  const total = despesa.valor + calcularGorjeta(despesa.valor, despesa.gorjetaPercentual)

  return ratear(total, despesa.partes)
}

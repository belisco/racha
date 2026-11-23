import { describe, expect, it } from 'vitest'
import { calcularTransferencias } from './settlements'
import type { Centavos, Transferencia } from './types'

function aplicarTransferencias(
  saldos: Map<string, Centavos>,
  transferencias: Transferencia[],
): Map<string, Centavos> {
  const resultado = new Map(saldos)

  for (const transferencia of transferencias) {
    resultado.set(transferencia.de, resultado.get(transferencia.de)! + transferencia.valor)
    resultado.set(transferencia.para, resultado.get(transferencia.para)! - transferencia.valor)
  }

  return resultado
}

describe('calcularTransferencias', () => {
  it('deve fazer cada devedor pagar ao credor quando dois devedores devem ao mesmo credor', () => {
    const saldos = new Map([
      ['ana', -3000],
      ['bia', -2000],
      ['caio', 5000],
    ])

    const resultado = calcularTransferencias(saldos)

    expect(resultado).toEqual([
      { de: 'ana', para: 'caio', valor: 3000 },
      { de: 'bia', para: 'caio', valor: 2000 },
    ])
  })

  it('deve gerar uma única transferência quando a dívida forma uma cadeia', () => {
    const saldos = new Map([
      ['a', -5000],
      ['b', 0],
      ['c', 5000],
    ])

    const resultado = calcularTransferencias(saldos)

    expect(resultado).toEqual([{ de: 'a', para: 'c', valor: 5000 }])
  })

  it('deve devolver lista vazia quando todos os saldos são zero', () => {
    const saldos = new Map([
      ['ana', 0],
      ['bia', 0],
      ['caio', 0],
    ])

    const resultado = calcularTransferencias(saldos)

    expect(resultado).toEqual([])
  })

  it('deve zerar todos os saldos quando as transferências são aplicadas', () => {
    const saldos = new Map([
      ['ana', 1166],
      ['bruno', 16500],
      ['caio', -8833],
      ['dani', -8833],
    ])

    const transferencias = calcularTransferencias(saldos)
    const saldosDepois = aplicarTransferencias(saldos, transferencias)

    expect(saldosDepois).toEqual(
      new Map([
        ['ana', 0],
        ['bruno', 0],
        ['caio', 0],
        ['dani', 0],
      ]),
    )
  })
})

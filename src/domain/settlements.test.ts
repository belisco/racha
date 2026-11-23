import { describe, expect, it } from 'vitest'
import { calcularTransferencias } from './settlements'

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
})

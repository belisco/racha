import type { Centavos, Transferencia } from './types'

type Pendencia = { pessoaId: string; valor: Centavos }

export function calcularTransferencias(saldos: Map<string, Centavos>): Transferencia[] {
  const devedores: Pendencia[] = []
  const credores: Pendencia[] = []

  for (const [pessoaId, saldo] of saldos) {
    if (saldo < 0) {
      devedores.push({ pessoaId, valor: -saldo })
    } else if (saldo > 0) {
      credores.push({ pessoaId, valor: saldo })
    }
  }

  const transferencias: Transferencia[] = []
  let proximoDevedor = 0
  let proximoCredor = 0

  while (proximoDevedor < devedores.length && proximoCredor < credores.length) {
    const devedor = devedores[proximoDevedor]
    const credor = credores[proximoCredor]
    const valor = Math.min(devedor.valor, credor.valor)

    transferencias.push({ de: devedor.pessoaId, para: credor.pessoaId, valor })
    devedor.valor -= valor
    credor.valor -= valor

    if (devedor.valor === 0) {
      proximoDevedor++
    }
    if (credor.valor === 0) {
      proximoCredor++
    }
  }

  return transferencias
}

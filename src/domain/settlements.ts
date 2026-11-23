import type { Centavos, Transferencia } from './types'

type Pendencia = { pessoaId: string; valor: Centavos }

// em empate de valor fica o primeiro da lista, que é a ordem de cadastro
function indiceDoMaior(pendencias: Pendencia[]): number {
  let melhor = 0

  for (let indice = 1; indice < pendencias.length; indice++) {
    if (pendencias[indice].valor > pendencias[melhor].valor) {
      melhor = indice
    }
  }

  return melhor
}

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

  while (devedores.length > 0 && credores.length > 0) {
    const indiceDevedor = indiceDoMaior(devedores)
    const indiceCredor = indiceDoMaior(credores)
    const devedor = devedores[indiceDevedor]
    const credor = credores[indiceCredor]
    const valor = Math.min(devedor.valor, credor.valor)

    transferencias.push({ de: devedor.pessoaId, para: credor.pessoaId, valor })
    devedor.valor -= valor
    credor.valor -= valor

    if (devedor.valor === 0) {
      devedores.splice(indiceDevedor, 1)
    }
    if (credor.valor === 0) {
      credores.splice(indiceCredor, 1)
    }
  }

  return transferencias
}

import { formatarCentavos } from './money'
import { calcularGorjeta } from './split'
import type { Racha, Transferencia } from './types'

export function gerarResumo(racha: Racha, transferencias: Transferencia[]): string {
  const total = racha.despesas.reduce(
    (soma, despesa) => soma + despesa.valor + calcularGorjeta(despesa.valor, despesa.gorjetaPercentual),
    0,
  )

  const nomes = new Map(racha.pessoas.map((pessoa) => [pessoa.id, pessoa.nome]))
  const linhas = transferencias.map(
    (transferencia) =>
      `${nomes.get(transferencia.de)} paga ${formatarCentavos(transferencia.valor)} para ${nomes.get(transferencia.para)}`,
  )

  return [
    `*Racha: ${racha.nome}*`,
    `Total: ${formatarCentavos(total)} · ${racha.pessoas.length} pessoas`,
    '',
    ...linhas,
  ].join('\n')
}

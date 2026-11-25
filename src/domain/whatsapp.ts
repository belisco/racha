import { formatarCentavos } from './money'
import { calcularGorjeta } from './split'
import type { Racha, Transferencia } from './types'

export function gerarResumo(racha: Racha, _transferencias: Transferencia[]): string {
  const total = racha.despesas.reduce(
    (soma, despesa) => soma + despesa.valor + calcularGorjeta(despesa.valor, despesa.gorjetaPercentual),
    0,
  )

  return [
    `*Racha: ${racha.nome}*`,
    `Total: ${formatarCentavos(total)} · ${racha.pessoas.length} pessoas`,
  ].join('\n')
}

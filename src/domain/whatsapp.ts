import { formatarCentavos } from './money'
import { calcularGorjeta } from './split'
import type { Racha, Transferencia } from './types'

function contarPessoas(quantidade: number): string {
  return quantidade === 1 ? '1 pessoa' : `${quantidade} pessoas`
}

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
    racha.nome.trim() === '' ? '*Racha*' : `*Racha: ${racha.nome.trim()}*`,
    `Total: ${formatarCentavos(total)} · ${contarPessoas(racha.pessoas.length)}`,
    '',
    ...(linhas.length === 0 ? ['Ninguém deve nada.'] : linhas),
  ].join('\n')
}

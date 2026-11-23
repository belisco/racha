import { calcularGorjeta, ratearDespesa } from './split'
import type { Centavos, Despesa, Pessoa } from './types'

function somarAoSaldo(saldos: Map<string, Centavos>, pessoaId: string, valor: Centavos): void {
  saldos.set(pessoaId, saldos.get(pessoaId)! + valor)
}

function aplicarDespesa(saldos: Map<string, Centavos>, despesa: Despesa): void {
  const total = despesa.valor + calcularGorjeta(despesa.valor, despesa.gorjetaPercentual)

  somarAoSaldo(saldos, despesa.pagoPor, total)

  for (const cota of ratearDespesa(despesa)) {
    somarAoSaldo(saldos, cota.pessoaId, -cota.valor)
  }
}

export function calcularSaldos(pessoas: Pessoa[], despesas: Despesa[]): Map<string, Centavos> {
  const saldos = new Map<string, Centavos>(pessoas.map((pessoa) => [pessoa.id, 0]))

  for (const despesa of despesas) {
    aplicarDespesa(saldos, despesa)
  }

  return saldos
}

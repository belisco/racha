import { calcularGorjeta, ratearDespesa } from './split'
import type { Centavos, Despesa, Pessoa } from './types'

function somarAoSaldo(saldos: Map<string, Centavos>, pessoaId: string, valor: Centavos): void {
  saldos.set(pessoaId, saldos.get(pessoaId)! + valor)
}

export function calcularSaldos(pessoas: Pessoa[], despesa: Despesa): Map<string, Centavos> {
  const saldos = new Map<string, Centavos>(pessoas.map((pessoa) => [pessoa.id, 0]))
  const total = despesa.valor + calcularGorjeta(despesa.valor, despesa.gorjetaPercentual)

  somarAoSaldo(saldos, despesa.pagoPor, total)

  for (const cota of ratearDespesa(despesa)) {
    somarAoSaldo(saldos, cota.pessoaId, -cota.valor)
  }

  return saldos
}

import { formatarCentavos } from '../domain/money'
import { calcularGorjeta } from '../domain/split'
import type { Despesa, Pessoa } from '../domain/types'

interface Props {
  despesas: Despesa[]
  pessoas: Pessoa[]
  onRemover: (despesaId: string) => void
}

export function DespesasLista({ despesas, pessoas, onRemover }: Props) {
  const nomes = new Map(pessoas.map((pessoa) => [pessoa.id, pessoa.nome]))

  return (
    <section className="cartao" aria-labelledby="titulo-despesas">
      <h2 id="titulo-despesas">Despesas</h2>

      <ul className="lista" aria-label="Despesas lançadas">
        {despesas.map((despesa) => {
          const total = despesa.valor + calcularGorjeta(despesa.valor, despesa.gorjetaPercentual)

          return (
            <li key={despesa.id} className="item">
              <div>
                <strong>{despesa.descricao}</strong> · {formatarCentavos(total)}
                <div className="detalhe">
                  pago por {nomes.get(despesa.pagoPor)}
                  {despesa.gorjetaPercentual > 0 && `, com ${despesa.gorjetaPercentual}% de gorjeta`}
                </div>
              </div>
              <button
                type="button"
                className="secundario"
                aria-label={`Remover ${despesa.descricao}`}
                onClick={() => onRemover(despesa.id)}
              >
                Remover
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

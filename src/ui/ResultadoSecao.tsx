import { formatarCentavos } from '../domain/money'
import type { Centavos, Pessoa, Transferencia } from '../domain/types'

interface Props {
  pessoas: Pessoa[]
  saldos: Map<string, Centavos>
  transferencias: Transferencia[]
}

function descreverSaldo(saldo: Centavos): string {
  if (saldo > 0) {
    return `recebe ${formatarCentavos(saldo)}`
  }
  if (saldo < 0) {
    return `deve ${formatarCentavos(-saldo)}`
  }
  return 'está quite'
}

export function ResultadoSecao({ pessoas, saldos, transferencias }: Props) {
  const nomes = new Map(pessoas.map((pessoa) => [pessoa.id, pessoa.nome]))

  return (
    <section className="cartao" aria-labelledby="titulo-resultado">
      <h2 id="titulo-resultado">Resultado</h2>

      {pessoas.length === 0 ? (
        <p className="vazio">Cadastre pessoas e despesas para ver quem paga quem.</p>
      ) : (
        <>
          <h3>Saldos</h3>
          <ul className="lista" aria-label="Saldos">
            {pessoas.map((pessoa) => (
              <li key={pessoa.id}>
                {pessoa.nome} {descreverSaldo(saldos.get(pessoa.id) ?? 0)}
              </li>
            ))}
          </ul>

          <h3>Quem paga quem</h3>
          {transferencias.length === 0 ? (
            <p className="vazio">Ninguém deve nada.</p>
          ) : (
            <ul className="lista" aria-label="Quem paga quem">
              {transferencias.map((transferencia) => (
                <li key={`${transferencia.de}-${transferencia.para}`}>
                  {nomes.get(transferencia.de)} paga {formatarCentavos(transferencia.valor)} para{' '}
                  {nomes.get(transferencia.para)}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}

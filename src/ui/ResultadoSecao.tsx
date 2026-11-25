import { useState } from 'react'
import { copiarTexto } from '../adapters/clipboard'
import { linkEhLongo, montarLink } from '../adapters/link'
import { formatarCentavos } from '../domain/money'
import { codificarRacha } from '../domain/share'
import type { Centavos, Racha, Transferencia } from '../domain/types'
import { gerarResumo } from '../domain/whatsapp'

interface Props {
  racha: Racha
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

export function ResultadoSecao({ racha, saldos, transferencias }: Props) {
  const { pessoas } = racha
  const nomes = new Map(pessoas.map((pessoa) => [pessoa.id, pessoa.nome]))
  const [avisos, setAvisos] = useState<string[]>([])

  async function copiarResumo() {
    await copiarTexto(gerarResumo(racha, transferencias))
    setAvisos(['Resumo copiado!'])
  }

  async function compartilharLink() {
    const link = montarLink(codificarRacha(racha))
    await copiarTexto(link)
    setAvisos(
      linkEhLongo(link)
        ? ['Link copiado!', 'O link ficou longo e pode não abrir em alguns aplicativos.']
        : ['Link copiado!'],
    )
  }

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

          <button type="button" onClick={copiarResumo}>
            Copiar resumo
          </button>
          <button type="button" onClick={compartilharLink}>
            Compartilhar link
          </button>
          <div role="status">
            {avisos.map((aviso) => (
              <p key={aviso}>{aviso}</p>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

import { useRacha } from '../state/useRacha'
import { DespesaForm } from './DespesaForm'
import { DespesasLista } from './DespesasLista'
import { PessoasSecao } from './PessoasSecao'
import { ResultadoSecao } from './ResultadoSecao'

export function App() {
  const {
    racha,
    saldos,
    transferencias,
    renomearRacha,
    adicionarPessoa,
    removerPessoa,
    adicionarDespesa,
    removerDespesa,
  } = useRacha()

  return (
    <div className="app">
      <header className="cabecalho">
        <h1>Racha</h1>
        <p>Divida as despesas e veja quem paga quanto a quem.</p>
      </header>

      <main className="conteudo">
        <section className="cartao" aria-labelledby="titulo-racha">
          <h2 id="titulo-racha">Racha</h2>
          <label className="campo">
            Nome do racha
            <input
              type="text"
              value={racha.nome}
              placeholder="Ex.: Jantar de sexta"
              onChange={(evento) => renomearRacha(evento.target.value)}
            />
          </label>
        </section>

        <PessoasSecao
          pessoas={racha.pessoas}
          onAdicionar={adicionarPessoa}
          onRemover={removerPessoa}
        />

        <DespesaForm pessoas={racha.pessoas} onAdicionar={adicionarDespesa} />

        <DespesasLista
          despesas={racha.despesas}
          pessoas={racha.pessoas}
          onRemover={removerDespesa}
        />

        <ResultadoSecao
          pessoas={racha.pessoas}
          saldos={saldos}
          transferencias={transferencias}
        />
      </main>
    </div>
  )
}

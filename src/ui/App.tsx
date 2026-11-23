import { useRacha } from '../state/useRacha'

export function App() {
  const { racha, renomearRacha } = useRacha()

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
              placeholder="Jantar de sexta"
              onChange={(evento) => renomearRacha(evento.target.value)}
            />
          </label>
        </section>
      </main>
    </div>
  )
}

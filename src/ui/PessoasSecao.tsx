import { type FormEvent, useState } from 'react'
import type { Pessoa } from '../domain/types'

interface Props {
  pessoas: Pessoa[]
  onAdicionar: (nome: string) => string | null
  onRemover: (pessoaId: string) => string | null
}

export function PessoasSecao({ pessoas, onAdicionar, onRemover }: Props) {
  const [nome, setNome] = useState('')
  const [erro, setErro] = useState<string | null>(null)

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const mensagem = onAdicionar(nome)
    setErro(mensagem)

    if (mensagem === null) {
      setNome('')
    }
  }

  return (
    <section className="cartao" aria-labelledby="titulo-pessoas">
      <h2 id="titulo-pessoas">Pessoas</h2>

      <form className="linha" onSubmit={enviar}>
        <label className="campo">
          Nome da pessoa
          <input type="text" value={nome} onChange={(evento) => setNome(evento.target.value)} />
        </label>
        <button type="submit">Adicionar pessoa</button>
      </form>

      {erro && (
        <p className="erro" role="alert">
          {erro}
        </p>
      )}

      {pessoas.length === 0 && <p className="vazio">Nenhuma pessoa cadastrada.</p>}

      <ul className="lista" aria-label="Pessoas do racha">
        {pessoas.map((pessoa) => (
          <li key={pessoa.id} className="item">
            {pessoa.nome}
            <button
              type="button"
              className="secundario"
              aria-label={`Remover ${pessoa.nome}`}
              onClick={() => setErro(onRemover(pessoa.id))}
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

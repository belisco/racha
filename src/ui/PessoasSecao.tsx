import { type FormEvent, useState } from 'react'
import type { Pessoa } from '../domain/types'

interface Props {
  pessoas: Pessoa[]
  onAdicionar: (nome: string) => void
}

export function PessoasSecao({ pessoas, onAdicionar }: Props) {
  const [nome, setNome] = useState('')

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    onAdicionar(nome.trim())
    setNome('')
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

      <ul className="lista" aria-label="Pessoas do racha">
        {pessoas.map((pessoa) => (
          <li key={pessoa.id}>{pessoa.nome}</li>
        ))}
      </ul>
    </section>
  )
}

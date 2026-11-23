import { type FormEvent, useState } from 'react'
import { interpretarValor } from '../domain/money'
import type { Pessoa } from '../domain/types'
import type { NovaDespesa } from '../state/useRacha'

interface Props {
  pessoas: Pessoa[]
  onAdicionar: (despesa: NovaDespesa) => void
}

export function DespesaForm({ pessoas, onAdicionar }: Props) {
  const [descricao, setDescricao] = useState('')
  const [valorTexto, setValorTexto] = useState('')
  const [pagadorEscolhido, setPagadorEscolhido] = useState('')
  // guarda quem foi desmarcado, assim quem é cadastrado depois já entra na divisão
  const [foraDaDivisao, setForaDaDivisao] = useState<Set<string>>(new Set())
  const [erro, setErro] = useState<string | null>(null)

  if (pessoas.length === 0) {
    return (
      <section className="cartao" aria-labelledby="titulo-despesa">
        <h2 id="titulo-despesa">Nova despesa</h2>
        <p className="vazio">Adicione pessoas para lançar despesas.</p>
      </section>
    )
  }

  const pagoPor = pessoas.some((pessoa) => pessoa.id === pagadorEscolhido)
    ? pagadorEscolhido
    : pessoas[0].id
  const participantes = pessoas.filter((pessoa) => !foraDaDivisao.has(pessoa.id))

  function alternarParticipante(pessoaId: string) {
    setForaDaDivisao((atual) => {
      const proximo = new Set(atual)
      if (proximo.has(pessoaId)) {
        proximo.delete(pessoaId)
      } else {
        proximo.add(pessoaId)
      }
      return proximo
    })
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    const valor = interpretarValor(valorTexto.trim())
    if (valor === null || valor <= 0) {
      setErro('Informe um valor maior que zero, como 12,50.')
      return
    }

    if (participantes.length === 0) {
      setErro('Marque pelo menos uma pessoa para dividir.')
      return
    }

    onAdicionar({
      descricao: descricao.trim() || 'Despesa',
      valor,
      gorjetaPercentual: 0,
      pagoPor,
      partes: participantes.map((pessoa) => ({ pessoaId: pessoa.id, peso: 1 })),
    })
    setDescricao('')
    setValorTexto('')
    setErro(null)
  }

  return (
    <section className="cartao" aria-labelledby="titulo-despesa">
      <h2 id="titulo-despesa">Nova despesa</h2>

      <form className="formulario" onSubmit={enviar}>
        <label className="campo">
          Descrição
          <input
            type="text"
            value={descricao}
            placeholder="Rodízio"
            onChange={(evento) => setDescricao(evento.target.value)}
          />
        </label>

        <label className="campo">
          Valor (R$)
          <input
            type="text"
            inputMode="decimal"
            value={valorTexto}
            placeholder="200,00"
            onChange={(evento) => setValorTexto(evento.target.value)}
          />
        </label>

        <label className="campo">
          Quem pagou
          <select value={pagoPor} onChange={(evento) => setPagadorEscolhido(evento.target.value)}>
            {pessoas.map((pessoa) => (
              <option key={pessoa.id} value={pessoa.id}>
                {pessoa.nome}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="grupo">
          <legend>Quem divide</legend>
          {pessoas.map((pessoa) => (
            <label key={pessoa.id} className="opcao">
              <input
                type="checkbox"
                checked={!foraDaDivisao.has(pessoa.id)}
                onChange={() => alternarParticipante(pessoa.id)}
              />
              {pessoa.nome}
            </label>
          ))}
        </fieldset>

        {erro && (
          <p className="erro" role="alert">
            {erro}
          </p>
        )}

        <button type="submit">Lançar despesa</button>
      </form>
    </section>
  )
}

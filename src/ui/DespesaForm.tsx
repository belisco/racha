import { type FormEvent, useState } from 'react'
import { interpretarValor } from '../domain/money'
import type { Pessoa } from '../domain/types'
import type { NovaDespesa } from '../state/useRacha'

type ModoDivisao = 'igual' | 'pesos'

const GORJETA_MAXIMA = 30

function lerInteiro(texto: string): number {
  // campo vazio conta como zero; o resto passa pelo Number e é conferido por quem chama
  return texto.trim() === '' ? 0 : Number(texto)
}

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
  const [modo, setModo] = useState<ModoDivisao>('igual')
  const [pesos, setPesos] = useState<Record<string, string>>({})
  const [gorjetaTexto, setGorjetaTexto] = useState('0')
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

  function pesoDe(pessoaId: string): number {
    return modo === 'igual' ? 1 : lerInteiro(pesos[pessoaId] ?? '1')
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

    const partes = participantes.map((pessoa) => ({
      pessoaId: pessoa.id,
      peso: pesoDe(pessoa.id),
    }))
    if (partes.some((parte) => !Number.isInteger(parte.peso) || parte.peso <= 0)) {
      setErro('Cada peso deve ser um número inteiro maior que zero.')
      return
    }

    const gorjetaPercentual = lerInteiro(gorjetaTexto)
    if (
      !Number.isInteger(gorjetaPercentual) ||
      gorjetaPercentual < 0 ||
      gorjetaPercentual > GORJETA_MAXIMA
    ) {
      setErro(`A gorjeta deve ser um número inteiro de 0 a ${GORJETA_MAXIMA}.`)
      return
    }

    onAdicionar({
      descricao: descricao.trim() || 'Despesa',
      valor,
      gorjetaPercentual,
      pagoPor,
      partes,
    })
    setDescricao('')
    setValorTexto('')
    setErro(null)
  }

  return (
    <section className="cartao" aria-labelledby="titulo-despesa">
      <h2 id="titulo-despesa">Nova despesa</h2>

      <form className="formulario" noValidate onSubmit={enviar}>
        <label className="campo">
          Descrição
          <input
            type="text"
            value={descricao}
            placeholder="Ex.: Rodízio"
            onChange={(evento) => setDescricao(evento.target.value)}
          />
        </label>

        <label className="campo">
          Valor (R$)
          <input
            type="text"
            inputMode="decimal"
            value={valorTexto}
            placeholder="Ex.: 200,00"
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

        <label className="campo">
          Gorjeta (%)
          <input
            type="number"
            min={0}
            max={GORJETA_MAXIMA}
            step={1}
            value={gorjetaTexto}
            onChange={(evento) => setGorjetaTexto(evento.target.value)}
          />
        </label>

        <fieldset className="grupo">
          <legend>Divisão</legend>
          <label className="opcao">
            <input
              type="radio"
              name="modo-divisao"
              checked={modo === 'igual'}
              onChange={() => setModo('igual')}
            />
            Igual
          </label>
          <label className="opcao">
            <input
              type="radio"
              name="modo-divisao"
              checked={modo === 'pesos'}
              onChange={() => setModo('pesos')}
            />
            Por pesos
          </label>
        </fieldset>

        <fieldset className="grupo">
          <legend>Quem divide</legend>
          {pessoas.map((pessoa) => {
            const participa = !foraDaDivisao.has(pessoa.id)

            return (
              <div key={pessoa.id} className="participante">
                <label className="opcao">
                  <input
                    type="checkbox"
                    checked={participa}
                    onChange={() => alternarParticipante(pessoa.id)}
                  />
                  {pessoa.nome}
                </label>
                {modo === 'pesos' && participa && (
                  <input
                    type="number"
                    className="peso"
                    min={1}
                    step={1}
                    aria-label={`Peso de ${pessoa.nome}`}
                    value={pesos[pessoa.id] ?? '1'}
                    onChange={(evento) =>
                      setPesos((atual) => ({ ...atual, [pessoa.id]: evento.target.value }))
                    }
                  />
                )}
              </div>
            )
          })}
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

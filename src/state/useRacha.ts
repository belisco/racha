import { useEffect, useMemo, useState } from 'react'
import { type Armazenamento, carregarRacha, salvarRacha } from '../adapters/storage'
import { calcularSaldos } from '../domain/balances'
import { calcularTransferencias } from '../domain/settlements'
import type { Despesa, Racha } from '../domain/types'

export type NovaDespesa = Omit<Despesa, 'id'>

function criarId(): string {
  return crypto.randomUUID()
}

export function useRacha(armazenamento: Armazenamento = localStorage) {
  const [racha, setRacha] = useState<Racha>(() => carregarRacha(armazenamento))

  useEffect(() => {
    salvarRacha(armazenamento, racha)
  }, [armazenamento, racha])

  const saldos = useMemo(() => calcularSaldos(racha.pessoas, racha.despesas), [racha])
  const transferencias = useMemo(() => calcularTransferencias(saldos), [saldos])

  function renomearRacha(nome: string): void {
    setRacha((atual) => ({ ...atual, nome }))
  }

  // devolve a mensagem de erro, ou null quando a pessoa foi adicionada
  function adicionarPessoa(nomeDigitado: string): string | null {
    const nome = nomeDigitado.trim()

    if (nome === '') {
      return 'Informe o nome da pessoa.'
    }

    const chave = nome.toLocaleLowerCase('pt-BR')
    if (racha.pessoas.some((pessoa) => pessoa.nome.toLocaleLowerCase('pt-BR') === chave)) {
      return `Já existe uma pessoa chamada ${nome}.`
    }

    setRacha((atual) => ({
      ...atual,
      pessoas: [...atual.pessoas, { id: criarId(), nome }],
    }))
    return null
  }

  function adicionarDespesa(despesa: NovaDespesa): void {
    setRacha((atual) => ({
      ...atual,
      despesas: [...atual.despesas, { ...despesa, id: criarId() }],
    }))
  }

  function removerDespesa(id: string): void {
    setRacha((atual) => ({
      ...atual,
      despesas: atual.despesas.filter((despesa) => despesa.id !== id),
    }))
  }

  return {
    racha,
    saldos,
    transferencias,
    renomearRacha,
    adicionarPessoa,
    adicionarDespesa,
    removerDespesa,
  }
}

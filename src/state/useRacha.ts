import { useEffect, useMemo, useState } from 'react'
import { lerCodigoDoLink, limparLink } from '../adapters/link'
import { type Armazenamento, carregarRacha, salvarRacha } from '../adapters/storage'
import { calcularSaldos } from '../domain/balances'
import { calcularTransferencias } from '../domain/settlements'
import { decodificarRacha } from '../domain/share'
import type { Despesa, Racha } from '../domain/types'

export type NovaDespesa = Omit<Despesa, 'id'>

const AVISO_DO_LINK_INVALIDO =
  'O link do racha está corrompido ou é de outra versão. Mostrando o racha salvo neste navegador.'

function criarId(): string {
  return crypto.randomUUID()
}

// o racha do link tem prioridade sobre o salvo no navegador
function carregarInicial(armazenamento: Armazenamento): { racha: Racha; aviso: string | null } {
  const codigo = lerCodigoDoLink()

  if (codigo === null) {
    return { racha: carregarRacha(armazenamento), aviso: null }
  }

  const doLink = decodificarRacha(codigo)

  if (doLink === null) {
    return { racha: carregarRacha(armazenamento), aviso: AVISO_DO_LINK_INVALIDO }
  }

  return { racha: doLink, aviso: null }
}

export function useRacha(armazenamento: Armazenamento = localStorage) {
  const [inicial] = useState(() => carregarInicial(armazenamento))
  const [racha, setRacha] = useState<Racha>(inicial.racha)

  // o hash só sai depois do primeiro render, para o carregamento inicial poder ler de novo
  useEffect(() => {
    limparLink()
  }, [])

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

  // devolve a mensagem de erro, ou null quando a pessoa foi removida
  function removerPessoa(pessoaId: string): string | null {
    const participa = racha.despesas.some(
      (despesa) =>
        despesa.pagoPor === pessoaId || despesa.partes.some((parte) => parte.pessoaId === pessoaId),
    )

    if (participa) {
      const nome = racha.pessoas.find((pessoa) => pessoa.id === pessoaId)?.nome
      return `${nome} está em alguma despesa e não pode ser removida.`
    }

    setRacha((atual) => ({
      ...atual,
      pessoas: atual.pessoas.filter((pessoa) => pessoa.id !== pessoaId),
    }))
    return null
  }

  function definirChavePix(pessoaId: string, chave: string): void {
    setRacha((atual) => ({
      ...atual,
      pessoas: atual.pessoas.map((pessoa) =>
        pessoa.id === pessoaId ? { ...pessoa, chavePix: chave.trim() === '' ? undefined : chave } : pessoa,
      ),
    }))
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
    avisoDoLink: inicial.aviso,
    saldos,
    transferencias,
    renomearRacha,
    adicionarPessoa,
    removerPessoa,
    definirChavePix,
    adicionarDespesa,
    removerDespesa,
  }
}

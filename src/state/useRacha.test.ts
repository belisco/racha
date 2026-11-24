import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { carregarRacha, salvarRacha } from '../adapters/storage'
import type { Racha } from '../domain/types'
import { useRacha } from './useRacha'

const rachaComDuasPessoas: Racha = {
  versao: 1,
  nome: 'Almoço',
  pessoas: [
    { id: 'ana', nome: 'Ana' },
    { id: 'bruno', nome: 'Bruno' },
  ],
  despesas: [],
}

const despesaDoBrunoDividida = {
  descricao: 'Pizza',
  valor: 6000,
  gorjetaPercentual: 0,
  pagoPor: 'bruno',
  partes: [
    { pessoaId: 'ana', peso: 1 },
    { pessoaId: 'bruno', peso: 1 },
  ],
}

describe('useRacha', () => {
  it('deve começar com o racha salvo quando já existe um no armazenamento', () => {
    salvarRacha(localStorage, rachaComDuasPessoas)

    const { result } = renderHook(() => useRacha())

    expect(result.current.racha).toEqual(rachaComDuasPessoas)
  })

  it('deve trocar o nome do racha quando ele é renomeado', () => {
    const { result } = renderHook(() => useRacha())

    act(() => result.current.renomearRacha('Jantar de sexta'))

    expect(result.current.racha.nome).toBe('Jantar de sexta')
  })

  it('deve incluir a pessoa na lista quando ela é adicionada', () => {
    const { result } = renderHook(() => useRacha())

    act(() => result.current.adicionarPessoa('Ana'))

    expect(result.current.racha.pessoas.map((pessoa) => pessoa.nome)).toEqual(['Ana'])
  })

  it('deve calcular quem paga quem quando uma despesa é adicionada', () => {
    salvarRacha(localStorage, rachaComDuasPessoas)
    const { result } = renderHook(() => useRacha())

    act(() => result.current.adicionarDespesa(despesaDoBrunoDividida))

    expect(result.current.transferencias).toEqual([{ de: 'ana', para: 'bruno', valor: 3000 }])
  })

  it('deve zerar as transferências quando a única despesa é removida', () => {
    salvarRacha(localStorage, rachaComDuasPessoas)
    const { result } = renderHook(() => useRacha())
    act(() => result.current.adicionarDespesa(despesaDoBrunoDividida))
    const idDaDespesa = result.current.racha.despesas[0].id

    act(() => result.current.removerDespesa(idDaDespesa))

    expect(result.current.transferencias).toEqual([])
  })

  it('deve salvar o racha no armazenamento quando ele muda', () => {
    const { result } = renderHook(() => useRacha())

    act(() => result.current.renomearRacha('Viagem'))

    expect(carregarRacha(localStorage).nome).toBe('Viagem')
  })

  it('deve tirar a pessoa da lista quando ela não está em nenhuma despesa', () => {
    salvarRacha(localStorage, rachaComDuasPessoas)
    const { result } = renderHook(() => useRacha())

    act(() => {
      result.current.removerPessoa('ana')
    })

    expect(result.current.racha.pessoas.map((pessoa) => pessoa.id)).toEqual(['bruno'])
  })

  it('deve recusar a remoção quando a pessoa participa de uma despesa', () => {
    salvarRacha(localStorage, rachaComDuasPessoas)
    const { result } = renderHook(() => useRacha())
    act(() => result.current.adicionarDespesa(despesaDoBrunoDividida))

    let mensagem: string | null = null
    act(() => {
      mensagem = result.current.removerPessoa('ana')
    })

    expect(mensagem).toBe('Ana está em alguma despesa e não pode ser removida.')
    expect(result.current.racha.pessoas).toHaveLength(2)
  })
})

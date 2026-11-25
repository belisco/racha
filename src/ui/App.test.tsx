import { render, screen, within } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { codificarRacha } from '../domain/share'
import { App } from './App'

async function cadastrarPessoa(usuario: UserEvent, nome: string) {
  await usuario.type(screen.getByLabelText('Nome da pessoa'), nome)
  await usuario.click(screen.getByRole('button', { name: 'Adicionar pessoa' }))
}

describe('App', () => {
  it('deve mostrar o nome na lista quando uma pessoa é adicionada', async () => {
    const usuario = userEvent.setup()
    render(<App />)

    await usuario.type(screen.getByLabelText('Nome da pessoa'), 'Ana')
    await usuario.click(screen.getByRole('button', { name: 'Adicionar pessoa' }))

    const lista = screen.getByRole('list', { name: 'Pessoas do racha' })
    expect(within(lista).getByText('Ana')).toBeInTheDocument()
  })

  it('deve recusar com mensagem quando o nome da pessoa está vazio', async () => {
    const usuario = userEvent.setup()
    render(<App />)

    await usuario.type(screen.getByLabelText('Nome da pessoa'), '   ')
    await usuario.click(screen.getByRole('button', { name: 'Adicionar pessoa' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Informe o nome da pessoa.')
    expect(within(screen.getByRole('list', { name: 'Pessoas do racha' })).queryAllByRole('listitem')).toHaveLength(0)
  })

  it('deve recusar com mensagem quando já existe uma pessoa com o mesmo nome', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    await usuario.type(screen.getByLabelText('Nome da pessoa'), 'Ana')
    await usuario.click(screen.getByRole('button', { name: 'Adicionar pessoa' }))

    await usuario.type(screen.getByLabelText('Nome da pessoa'), 'ana')
    await usuario.click(screen.getByRole('button', { name: 'Adicionar pessoa' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Já existe uma pessoa chamada ana.')
    expect(within(screen.getByRole('list', { name: 'Pessoas do racha' })).getAllByRole('listitem')).toHaveLength(1)
  })

  it('deve mostrar quem paga quem quando uma despesa é lançada', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    await cadastrarPessoa(usuario, 'Ana')
    await cadastrarPessoa(usuario, 'Bruno')

    await usuario.type(screen.getByLabelText('Descrição'), 'Pizza')
    await usuario.type(screen.getByLabelText('Valor (R$)'), '60,00')
    await usuario.selectOptions(screen.getByLabelText('Quem pagou'), 'Bruno')
    await usuario.click(screen.getByRole('button', { name: 'Lançar despesa' }))

    const quemPagaQuem = screen.getByRole('list', { name: 'Quem paga quem' })
    expect(quemPagaQuem).toHaveTextContent('Ana paga R$ 30,00 para Bruno')
  })

  it('deve avisar e manter a pessoa quando ela participa de uma despesa e é removida', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    await cadastrarPessoa(usuario, 'Ana')
    await usuario.type(screen.getByLabelText('Valor (R$)'), '10,00')
    await usuario.click(screen.getByRole('button', { name: 'Lançar despesa' }))

    await usuario.click(screen.getByRole('button', { name: 'Remover Ana' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Ana está em alguma despesa e não pode ser removida.')
    expect(within(screen.getByRole('list', { name: 'Pessoas do racha' })).getByText('Ana')).toBeInTheDocument()
  })

  it('deve copiar o resumo e avisar quando o botão copiar resumo é clicado', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    await cadastrarPessoa(usuario, 'Ana')
    await cadastrarPessoa(usuario, 'Bruno')
    await usuario.type(screen.getByLabelText('Valor (R$)'), '60,00')
    await usuario.click(screen.getByRole('button', { name: 'Lançar despesa' }))

    await usuario.click(screen.getByRole('button', { name: 'Copiar resumo' }))

    expect(await navigator.clipboard.readText()).toContain('Bruno paga R$ 30,00 para Ana')
    expect(screen.getByRole('status')).toHaveTextContent('Resumo copiado!')
  })

  it('deve copiar um link com o racha e avisar quando o botão compartilhar link é clicado', async () => {
    const usuario = userEvent.setup()
    render(<App />)
    await cadastrarPessoa(usuario, 'Ana')

    await usuario.click(screen.getByRole('button', { name: 'Compartilhar link' }))

    expect(await navigator.clipboard.readText()).toContain('#r=')
    expect(screen.getByRole('status')).toHaveTextContent('Link copiado!')
  })

  it('deve avisar que o link ficou longo quando ele passa de 2000 caracteres', async () => {
    const usuario = userEvent.setup()
    const rachaGrande = {
      versao: 1 as const,
      nome: 'a'.repeat(2000),
      pessoas: [{ id: 'ana', nome: 'Ana' }],
      despesas: [],
    }
    window.history.replaceState(null, '', `#r=${codificarRacha(rachaGrande)}`)
    render(<App />)

    await usuario.click(screen.getByRole('button', { name: 'Compartilhar link' }))

    expect(screen.getByRole('status')).toHaveTextContent('O link ficou longo')
  })

  it('deve mostrar o aviso quando o link da URL é inválido', () => {
    window.history.replaceState(null, '', '#r=%%%')

    render(<App />)

    expect(screen.getByRole('alert')).toHaveTextContent('O link do racha está corrompido')
  })
})

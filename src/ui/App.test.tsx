import { render, screen, within } from '@testing-library/react'
import userEvent, { type UserEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
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
})

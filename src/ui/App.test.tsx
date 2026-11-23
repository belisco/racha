import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { App } from './App'

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
})

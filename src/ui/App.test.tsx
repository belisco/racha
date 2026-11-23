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
})

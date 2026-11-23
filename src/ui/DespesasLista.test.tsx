import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Despesa, Pessoa } from '../domain/types'
import { DespesasLista } from './DespesasLista'

const pessoas: Pessoa[] = [
  { id: 'ana', nome: 'Ana' },
  { id: 'bruno', nome: 'Bruno' },
]

const rodizio: Despesa = {
  id: 'd1',
  descricao: 'Rodízio',
  valor: 20000,
  gorjetaPercentual: 10,
  pagoPor: 'bruno',
  partes: [
    { pessoaId: 'ana', peso: 1 },
    { pessoaId: 'bruno', peso: 1 },
  ],
}

describe('DespesasLista', () => {
  it('deve mostrar a descrição, o total com gorjeta e quem pagou quando há uma despesa', () => {
    render(<DespesasLista despesas={[rodizio]} pessoas={pessoas} onRemover={vi.fn()} />)

    const item = screen.getByRole('listitem')
    expect(item).toHaveTextContent('Rodízio · R$ 220,00')
    expect(item).toHaveTextContent('pago por Bruno, com 10% de gorjeta')
  })

  it('deve pedir a remoção da despesa quando o botão remover é clicado', async () => {
    const usuario = userEvent.setup()
    const onRemover = vi.fn()
    render(<DespesasLista despesas={[rodizio]} pessoas={pessoas} onRemover={onRemover} />)

    await usuario.click(screen.getByRole('button', { name: 'Remover Rodízio' }))

    expect(onRemover).toHaveBeenCalledWith('d1')
  })
})

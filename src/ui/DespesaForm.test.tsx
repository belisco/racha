import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Pessoa } from '../domain/types'
import { DespesaForm } from './DespesaForm'

const pessoas: Pessoa[] = [
  { id: 'ana', nome: 'Ana' },
  { id: 'bruno', nome: 'Bruno' },
  { id: 'caio', nome: 'Caio' },
]

describe('DespesaForm', () => {
  it('deve pedir pessoas quando ainda não há ninguém cadastrado', () => {
    render(<DespesaForm pessoas={[]} onAdicionar={vi.fn()} />)

    expect(screen.getByText('Adicione pessoas para lançar despesas.')).toBeInTheDocument()
  })

  it('deve enviar a despesa dividida igualmente entre os marcados quando o formulário é válido', async () => {
    const usuario = userEvent.setup()
    const onAdicionar = vi.fn()
    render(<DespesaForm pessoas={pessoas} onAdicionar={onAdicionar} />)

    await usuario.type(screen.getByLabelText('Descrição'), 'Bebidas')
    await usuario.type(screen.getByLabelText('Valor (R$)'), '100,00')
    await usuario.selectOptions(screen.getByLabelText('Quem pagou'), 'Bruno')
    await usuario.click(screen.getByRole('checkbox', { name: 'Ana' }))
    await usuario.click(screen.getByRole('button', { name: 'Lançar despesa' }))

    expect(onAdicionar).toHaveBeenCalledWith({
      descricao: 'Bebidas',
      valor: 10000,
      gorjetaPercentual: 0,
      pagoPor: 'bruno',
      partes: [
        { pessoaId: 'bruno', peso: 1 },
        { pessoaId: 'caio', peso: 1 },
      ],
    })
  })

  it('deve recusar com mensagem quando o valor não é válido', async () => {
    const usuario = userEvent.setup()
    const onAdicionar = vi.fn()
    render(<DespesaForm pessoas={pessoas} onAdicionar={onAdicionar} />)

    await usuario.type(screen.getByLabelText('Valor (R$)'), '0,00')
    await usuario.click(screen.getByRole('button', { name: 'Lançar despesa' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Informe um valor maior que zero')
    expect(onAdicionar).not.toHaveBeenCalled()
  })

  it('deve recusar com mensagem quando ninguém está marcado para dividir', async () => {
    const usuario = userEvent.setup()
    const onAdicionar = vi.fn()
    render(<DespesaForm pessoas={pessoas.slice(0, 1)} onAdicionar={onAdicionar} />)

    await usuario.type(screen.getByLabelText('Valor (R$)'), '10,00')
    await usuario.click(screen.getByRole('checkbox', { name: 'Ana' }))
    await usuario.click(screen.getByRole('button', { name: 'Lançar despesa' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Marque pelo menos uma pessoa para dividir.')
    expect(onAdicionar).not.toHaveBeenCalled()
  })
})

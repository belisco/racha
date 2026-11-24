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

  it('deve enviar os pesos digitados quando a divisão é por pesos', async () => {
    const usuario = userEvent.setup()
    const onAdicionar = vi.fn()
    render(<DespesaForm pessoas={pessoas.slice(0, 2)} onAdicionar={onAdicionar} />)

    await usuario.type(screen.getByLabelText('Valor (R$)'), '90,00')
    await usuario.click(screen.getByRole('radio', { name: 'Por pesos' }))
    await usuario.clear(screen.getByLabelText('Peso de Bruno'))
    await usuario.type(screen.getByLabelText('Peso de Bruno'), '2')
    await usuario.click(screen.getByRole('button', { name: 'Lançar despesa' }))

    expect(onAdicionar).toHaveBeenCalledWith(
      expect.objectContaining({
        partes: [
          { pessoaId: 'ana', peso: 1 },
          { pessoaId: 'bruno', peso: 2 },
        ],
      }),
    )
  })

  it('deve enviar a gorjeta digitada quando ela está entre 0 e 30', async () => {
    const usuario = userEvent.setup()
    const onAdicionar = vi.fn()
    render(<DespesaForm pessoas={pessoas} onAdicionar={onAdicionar} />)

    await usuario.type(screen.getByLabelText('Valor (R$)'), '200,00')
    await usuario.clear(screen.getByLabelText('Gorjeta (%)'))
    await usuario.type(screen.getByLabelText('Gorjeta (%)'), '10')
    await usuario.click(screen.getByRole('button', { name: 'Lançar despesa' }))

    expect(onAdicionar).toHaveBeenCalledWith(expect.objectContaining({ gorjetaPercentual: 10 }))
  })

  it('deve recusar com mensagem quando a gorjeta passa de 30%', async () => {
    const usuario = userEvent.setup()
    const onAdicionar = vi.fn()
    render(<DespesaForm pessoas={pessoas} onAdicionar={onAdicionar} />)

    await usuario.type(screen.getByLabelText('Valor (R$)'), '200,00')
    await usuario.clear(screen.getByLabelText('Gorjeta (%)'))
    await usuario.type(screen.getByLabelText('Gorjeta (%)'), '31')
    await usuario.click(screen.getByRole('button', { name: 'Lançar despesa' }))

    expect(screen.getByRole('alert')).toHaveTextContent('A gorjeta deve ser um número inteiro de 0 a 30.')
    expect(onAdicionar).not.toHaveBeenCalled()
  })

  it('deve recusar com mensagem quando um peso não é positivo', async () => {
    const usuario = userEvent.setup()
    const onAdicionar = vi.fn()
    render(<DespesaForm pessoas={pessoas.slice(0, 2)} onAdicionar={onAdicionar} />)

    await usuario.type(screen.getByLabelText('Valor (R$)'), '90,00')
    await usuario.click(screen.getByRole('radio', { name: 'Por pesos' }))
    await usuario.clear(screen.getByLabelText('Peso de Ana'))
    await usuario.type(screen.getByLabelText('Peso de Ana'), '0')
    await usuario.click(screen.getByRole('button', { name: 'Lançar despesa' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Cada peso deve ser um número inteiro maior que zero.')
    expect(onAdicionar).not.toHaveBeenCalled()
  })
})

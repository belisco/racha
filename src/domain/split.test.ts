import { describe, expect, it } from 'vitest'
import { ratear } from './split'
import type { Parte } from './types'

describe('ratear', () => {
  it('deve dar o centavo que sobra ao primeiro quando 10000 é dividido entre 3 pessoas', () => {
    const total = 10000
    const partes: Parte[] = [
      { pessoaId: 'ana', peso: 1 },
      { pessoaId: 'bia', peso: 1 },
      { pessoaId: 'caio', peso: 1 },
    ]

    const resultado = ratear(total, partes)

    expect(resultado).toEqual([
      { pessoaId: 'ana', valor: 3334 },
      { pessoaId: 'bia', valor: 3333 },
      { pessoaId: 'caio', valor: 3333 },
    ])
  })
})

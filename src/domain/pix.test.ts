import { describe, expect, it } from 'vitest'
import { calcularCrc16, gerarCodigoPix } from './pix'

describe('calcularCrc16', () => {
  it('deve devolver 29B1 quando o texto é o vetor de teste "123456789"', () => {
    const texto = '123456789'

    const resultado = calcularCrc16(texto)

    expect(resultado).toBe('29B1')
  })
})

describe('gerarCodigoPix', () => {
  it('deve trazer a chave, o valor com ponto e duas casas e o país BR quando recebe os dados do recebedor', () => {
    const dados = { chave: 'bruno@email.com', nome: 'Bruno', valor: 8833 }

    const codigo = gerarCodigoPix(dados)

    expect(codigo).toContain('0115bruno@email.com')
    expect(codigo).toContain('540588.33')
    expect(codigo).toContain('5802BR')
  })
})

describe('gerarCodigoPix e o CRC', () => {
  it('deve terminar com o campo 6304 e o CRC16 de todo o resto do código', () => {
    const dados = { chave: 'ana@email.com', nome: 'Ana Conceição', valor: 1166 }

    const codigo = gerarCodigoPix(dados)
    const semCrc = codigo.slice(0, -4)
    const crc = codigo.slice(-4)

    expect(semCrc.endsWith('6304')).toBe(true)
    expect(crc).toBe(calcularCrc16(semCrc))
  })
})

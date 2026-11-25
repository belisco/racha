import { describe, expect, it } from 'vitest'
import { codificarRacha, decodificarRacha } from './share'
import type { Racha } from './types'

const jantarDeSexta: Racha = {
  versao: 1,
  nome: 'Jantar de sexta',
  pessoas: [{ id: 'joao', nome: 'João Conceição' }],
  despesas: [],
}

// o nome "~~~?" foi escolhido porque o base64 comum (btoa) desse racha tem + e /
const rachaComSimbolosNoBase64: Racha = {
  versao: 1,
  nome: '~~~?',
  pessoas: [],
  despesas: [],
}

describe('codificarRacha', () => {
  it('deve devolver o mesmo racha quando é codificado e decodificado', () => {
    const texto = codificarRacha(jantarDeSexta)

    const racha = decodificarRacha(texto)

    expect(racha).toEqual(jantarDeSexta)
  })

  it('deve gerar só caracteres seguros para URL quando o base64 comum teria + e /', () => {
    const texto = codificarRacha(rachaComSimbolosNoBase64)

    expect(texto).toMatch(/^[A-Za-z0-9_-]+$/)
  })
})

describe('decodificarRacha', () => {
  it('deve devolver null quando o texto tem caracteres que não são base64', () => {
    const racha = decodificarRacha('%%%')

    expect(racha).toBeNull()
  })

  it('deve devolver null quando o texto é curto demais para ser um racha', () => {
    const racha = decodificarRacha('abc')

    expect(racha).toBeNull()
  })

  it('deve devolver null quando o base64 é válido mas o conteúdo não é JSON', () => {
    // base64 de "isto nao e json"
    const racha = decodificarRacha('aXN0byBuYW8gZSBqc29u')

    expect(racha).toBeNull()
  })

  it('deve devolver null quando o JSON não tem a forma de um racha', () => {
    const texto = codificarRacha({} as Racha)

    const racha = decodificarRacha(texto)

    expect(racha).toBeNull()
  })

  it('deve devolver null quando o JSON não é um objeto', () => {
    const texto = codificarRacha(null as unknown as Racha)

    const racha = decodificarRacha(texto)

    expect(racha).toBeNull()
  })
})

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

import type { Racha } from './types'

// valida dados que vêm de fora (link ou navegador) antes de chegarem aos cálculos,
// que partem do princípio de que o racha é coerente

const GORJETA_MAXIMA = 30

type Objeto = Record<string, unknown>

function ehObjeto(valor: unknown): valor is Objeto {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor)
}

function ehInteiroPositivo(valor: unknown): boolean {
  return Number.isSafeInteger(valor) && (valor as number) > 0
}

function ehPessoaValida(valor: unknown): boolean {
  return (
    ehObjeto(valor) &&
    typeof valor.id === 'string' &&
    valor.id !== '' &&
    typeof valor.nome === 'string' &&
    (valor.chavePix === undefined || typeof valor.chavePix === 'string')
  )
}

function ehParteValida(valor: unknown, idsDasPessoas: Set<string>): boolean {
  return (
    ehObjeto(valor) &&
    idsDasPessoas.has(valor.pessoaId as string) &&
    ehInteiroPositivo(valor.peso)
  )
}

function ehDespesaValida(valor: unknown, idsDasPessoas: Set<string>): boolean {
  if (!ehObjeto(valor) || !Array.isArray(valor.partes) || valor.partes.length === 0) {
    return false
  }

  const gorjeta = valor.gorjetaPercentual

  return (
    typeof valor.id === 'string' &&
    typeof valor.descricao === 'string' &&
    ehInteiroPositivo(valor.valor) &&
    Number.isInteger(gorjeta) &&
    (gorjeta as number) >= 0 &&
    (gorjeta as number) <= GORJETA_MAXIMA &&
    idsDasPessoas.has(valor.pagoPor as string) &&
    valor.partes.every((parte) => ehParteValida(parte, idsDasPessoas))
  )
}

export function ehRachaValido(valor: unknown): valor is Racha {
  if (
    !ehObjeto(valor) ||
    valor.versao !== 1 ||
    typeof valor.nome !== 'string' ||
    !Array.isArray(valor.pessoas) ||
    !Array.isArray(valor.despesas)
  ) {
    return false
  }

  if (!valor.pessoas.every(ehPessoaValida)) {
    return false
  }

  const idsDasPessoas = new Set(valor.pessoas.map((pessoa: Objeto) => pessoa.id as string))
  if (idsDasPessoas.size !== valor.pessoas.length) {
    return false
  }

  return valor.despesas.every((despesa) => ehDespesaValida(despesa, idsDasPessoas))
}

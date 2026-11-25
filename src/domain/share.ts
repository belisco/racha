import type { Racha } from './types'

export function codificarRacha(racha: Racha): string {
  const bytes = new TextEncoder().encode(JSON.stringify(racha))
  const binario = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')

  return btoa(binario).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

function pareceRacha(valor: unknown): valor is Racha {
  if (typeof valor !== 'object' || valor === null) {
    return false
  }

  const racha = valor as Record<string, unknown>

  return (
    typeof racha.nome === 'string' && Array.isArray(racha.pessoas) && Array.isArray(racha.despesas)
  )
}

export function decodificarRacha(texto: string): Racha | null {
  try {
    const base64 = texto.replaceAll('-', '+').replaceAll('_', '/')
    const completo = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const bytes = Uint8Array.from(atob(completo), (caractere) => caractere.charCodeAt(0))
    const valor: unknown = JSON.parse(new TextDecoder().decode(bytes))

    return pareceRacha(valor) ? valor : null
  } catch {
    return null
  }
}

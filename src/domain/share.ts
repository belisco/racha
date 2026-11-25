import type { Racha } from './types'

export function codificarRacha(racha: Racha): string {
  const bytes = new TextEncoder().encode(JSON.stringify(racha))
  const binario = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')

  return btoa(binario).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

export function decodificarRacha(texto: string): Racha {
  const base64 = texto.replaceAll('-', '+').replaceAll('_', '/')
  const completo = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  const bytes = Uint8Array.from(atob(completo), (caractere) => caractere.charCodeAt(0))

  return JSON.parse(new TextDecoder().decode(bytes)) as Racha
}

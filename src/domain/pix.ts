import type { Centavos } from './types'

// CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF), que é o usado no fim do BR Code
export function calcularCrc16(texto: string): string {
  let crc = 0xffff

  for (const byte of new TextEncoder().encode(texto)) {
    crc ^= byte << 8
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export interface DadosPix {
  chave: string
  nome: string
  valor: Centavos
  cidade?: string
}

// cada campo do BR Code é id (2 dígitos) + tamanho (2 dígitos) + valor
function campo(id: string, valor: string): string {
  return id + String(valor.length).padStart(2, '0') + valor
}

function semAcentos(texto: string, limite: number): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .slice(0, limite)
}

export function gerarCodigoPix({ chave, nome, valor, cidade = 'BRASIL' }: DadosPix): string {
  const valorComPonto = (valor / 100).toFixed(2)

  const semCrc = [
    campo('00', '01'),
    campo('26', campo('00', 'br.gov.bcb.pix') + campo('01', chave)),
    campo('52', '0000'),
    campo('53', '986'),
    campo('54', valorComPonto),
    campo('58', 'BR'),
    campo('59', semAcentos(nome, 25)),
    campo('60', semAcentos(cidade, 15)),
    campo('62', campo('05', '***')),
    '6304',
  ].join('')

  return semCrc + calcularCrc16(semCrc)
}

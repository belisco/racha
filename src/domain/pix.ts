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

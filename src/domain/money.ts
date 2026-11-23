export function formatarCentavos(centavos: number): string {
  const sinal = centavos < 0 ? '-' : ''
  const absoluto = Math.abs(centavos)
  const reais = Math.floor(absoluto / 100)
  const resto = absoluto % 100
  const reaisComMilhar = String(reais).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const centavosComZero = String(resto).padStart(2, '0')

  return `${sinal}R$ ${reaisComMilhar},${centavosComZero}`
}

export function interpretarValor(texto: string): number {
  // a vírgula extra no fim garante que a parte dos centavos exista mesmo sem vírgula no texto
  const [inteira, fracao] = `${texto},`.split(',')
  const reais = Number(inteira.replaceAll('.', ''))
  const centavos = Number(fracao.padEnd(2, '0'))

  return reais * 100 + centavos
}

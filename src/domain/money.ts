export function formatarCentavos(centavos: number): string {
  const sinal = centavos < 0 ? '-' : ''
  const absoluto = Math.abs(centavos)
  const reais = Math.floor(absoluto / 100)
  const resto = absoluto % 100
  const reaisComMilhar = String(reais).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const centavosComZero = String(resto).padStart(2, '0')

  return `${sinal}R$ ${reaisComMilhar},${centavosComZero}`
}

export function formatarCentavos(centavos: number): string {
  const reais = Math.floor(centavos / 100)
  const resto = centavos % 100
  const reaisComMilhar = String(reais).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  const centavosComZero = String(resto).padStart(2, '0')

  return `R$ ${reaisComMilhar},${centavosComZero}`
}

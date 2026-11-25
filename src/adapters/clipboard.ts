export async function copiarTexto(texto: string): Promise<void> {
  await navigator.clipboard.writeText(texto)
}

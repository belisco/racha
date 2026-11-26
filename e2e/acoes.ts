import type { Page } from '@playwright/test'

export interface DadosDaDespesa {
  descricao: string
  valor: string
  pagoPor: string
  gorjeta?: string
  // quem fica de fora; por padrão todos dividem
  foraDaDivisao?: string[]
  // com pesos, a divisão passa a ser por pesos
  pesos?: Record<string, string>
}

export async function cadastrarPessoas(page: Page, nomes: string[]) {
  for (const nome of nomes) {
    await page.getByLabel('Nome da pessoa').fill(nome)
    await page.getByRole('button', { name: 'Adicionar pessoa' }).click()
  }
}

export async function lancarDespesa(page: Page, despesa: DadosDaDespesa) {
  await page.getByLabel('Descrição').fill(despesa.descricao)
  await page.getByLabel('Valor (R$)').fill(despesa.valor)
  await page.getByLabel('Quem pagou').selectOption({ label: despesa.pagoPor })
  await page.getByLabel('Gorjeta (%)').fill(despesa.gorjeta ?? '0')

  const quemDivide = page.getByRole('group', { name: 'Quem divide' })
  for (const caixa of await quemDivide.getByRole('checkbox').all()) {
    const nome = await caixa.evaluate((elemento) => elemento.parentElement?.textContent ?? '')
    await caixa.setChecked(!(despesa.foraDaDivisao ?? []).includes(nome))
  }

  if (despesa.pesos) {
    await page.getByRole('radio', { name: 'Por pesos' }).check()
    for (const [nome, peso] of Object.entries(despesa.pesos)) {
      await page.getByLabel(`Peso de ${nome}`).fill(peso)
    }
  } else {
    await page.getByRole('radio', { name: 'Igual' }).check()
  }

  await page.getByRole('button', { name: 'Lançar despesa' }).click()
}

// guarda o que o app manda para a área de transferência, sem depender da permissão do navegador
export async function capturarAreaDeTransferencia(page: Page) {
  await page.addInitScript(() => {
    const janela = window as unknown as { textoCopiado: string }
    janela.textoCopiado = ''
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async (texto: string) => {
          janela.textoCopiado = texto
        },
      },
    })
  })
}

export async function lerAreaDeTransferencia(page: Page): Promise<string> {
  return page.evaluate(() => (window as unknown as { textoCopiado: string }).textoCopiado)
}

export async function montarJantarDeSexta(page: Page) {
  await page.getByLabel('Nome do racha').fill('Jantar de sexta')
  await cadastrarPessoas(page, ['Ana', 'Bruno', 'Caio', 'Dani'])
  await lancarDespesa(page, {
    descricao: 'Rodízio',
    valor: '200,00',
    pagoPor: 'Bruno',
    gorjeta: '10',
  })
  await lancarDespesa(page, {
    descricao: 'Bebidas',
    valor: '100,00',
    pagoPor: 'Ana',
    foraDaDivisao: ['Bruno'],
  })
}

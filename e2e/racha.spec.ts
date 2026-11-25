import { expect, test } from '@playwright/test'
import {
  cadastrarPessoas,
  capturarAreaDeTransferencia,
  lancarDespesa,
  lerAreaDeTransferencia,
  montarJantarDeSexta,
} from './acoes'

test('deve mostrar as três transferências e o resumo do Jantar de sexta', async ({ page }) => {
  await capturarAreaDeTransferencia(page)
  await page.goto('/')

  await montarJantarDeSexta(page)
  await page.getByRole('button', { name: 'Copiar resumo' }).click()

  await expect(page.getByRole('list', { name: 'Quem paga quem' }).getByRole('listitem')).toHaveText([
    'Caio paga R$ 88,33 para Bruno',
    'Dani paga R$ 76,67 para Bruno',
    'Dani paga R$ 11,66 para Ana',
  ])
  await expect(page.getByRole('status')).toHaveText('Resumo copiado!')
  expect(await lerAreaDeTransferencia(page)).toBe(
    [
      '*Racha: Jantar de sexta*',
      'Total: R$ 320,00 · 4 pessoas',
      '',
      'Caio paga R$ 88,33 para Bruno',
      'Dani paga R$ 76,67 para Bruno',
      'Dani paga R$ 11,66 para Ana',
    ].join('\n'),
  )
})

test('deve cobrar R$ 66,00 de Bruno quando R$ 90,00 com 10% é dividido com pesos 1 e 2', async ({
  page,
}) => {
  await page.goto('/')
  await cadastrarPessoas(page, ['Ana', 'Bruno'])

  await lancarDespesa(page, {
    descricao: 'Pizza',
    valor: '90,00',
    pagoPor: 'Ana',
    gorjeta: '10',
    pesos: { Ana: '1', Bruno: '2' },
  })

  await expect(page.getByRole('list', { name: 'Quem paga quem' }).getByRole('listitem')).toHaveText([
    'Bruno paga R$ 66,00 para Ana',
  ])
})

import { expect, test } from '@playwright/test'
import { capturarAreaDeTransferencia, lerAreaDeTransferencia, montarJantarDeSexta } from './acoes'

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

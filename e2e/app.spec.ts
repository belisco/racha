import { expect, test } from '@playwright/test'

test('deve abrir a página com o título do Racha', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1, name: 'Racha' })).toBeVisible()
})

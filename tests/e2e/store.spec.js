import { expect, test } from '@playwright/test'

test.describe('RussoGames E2E', () => {
  test('deve navegar para o catálogo sem drift ao clicar repetidamente', async ({ page }) => {
    await page.goto('/')

    const catalogLink = page.getByRole('link', { name: 'Catálogo' }).first()
    const catalogHeading = page.getByRole('heading', { name: 'Catálogo' })

    await catalogLink.click()

    await expect(page).toHaveURL(/#catalog/)
    await expect(catalogHeading).toBeVisible()
    await page.waitForTimeout(450)

    const firstHeadingTop = await catalogHeading.evaluate((el) => Math.round(el.getBoundingClientRect().top))

    await catalogLink.click()
    await page.waitForTimeout(450)
    await catalogLink.click()
    await page.waitForTimeout(450)

    const secondHeadingTop = await catalogHeading.evaluate((el) => Math.round(el.getBoundingClientRect().top))

    expect(Math.abs(secondHeadingTop - firstHeadingTop)).toBeLessThan(30)
  })

  test('deve filtrar produtos, abrir e fechar o modal de detalhes', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: 'Ver Jogos' }).click()
    await expect(page.getByRole('searchbox', { name: 'Buscar produto' })).toBeVisible()

    await page.getByRole('searchbox', { name: 'Buscar produto' }).fill('wukong')
    await expect(page.getByText('Black Myth: Wukong — Deluxe')).toBeVisible()
    await expect(page.getByText('Crimson Desert — Deluxe')).toHaveCount(0)

    await page.getByRole('button', { name: /Comprar Black Myth: Wukong — Deluxe/i }).click()
    await expect(page.getByRole('dialog', { name: /Detalhes: Black Myth: Wukong — Deluxe/i })).toBeVisible()

    await page.getByRole('button', { name: 'Fechar' }).click()
    await expect(page.getByRole('dialog', { name: /Detalhes: Black Myth: Wukong — Deluxe/i })).toHaveCount(0)
  })

  test('deve exibir estado vazio para busca sem resultados', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('searchbox', { name: 'Buscar produto' }).fill('sem-resultado-xyz')
    await expect(page.getByText('Nenhum produto encontrado')).toBeVisible()
  })
})
import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('shows a phone home: brand header, springboard, and dock', async ({ page }) => {
  await expect(page.getByText('lobatools')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Job Match (coming soon)' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'MCP Server (coming soon)' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Welcome' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Notes' })).toBeVisible()
})

test('does not show the desktop menu bar', async ({ page }) => {
  await expect(page.getByText('Julianne Lobato')).toHaveCount(0)
})

test('tapping an app opens it; the breadcrumb returns to the springboard', async ({ page }) => {
  await page.getByRole('button', { name: 'Job Match (coming soon)' }).click()
  await expect(page.getByText("It's not live yet")).toBeVisible()
  await expect(page.getByRole('button', { name: 'MCP Server (coming soon)' })).toHaveCount(0)

  await page.getByRole('button', { name: 'lobatools' }).click()
  await expect(page.getByRole('button', { name: 'MCP Server (coming soon)' })).toBeVisible()
})

test('coming-soon apps still open from the springboard', async ({ page }) => {
  await page.getByRole('button', { name: 'MCP Server (coming soon)' }).click()
  await expect(page.getByText("It's not live yet")).toBeVisible()
  await page.getByRole('button', { name: 'lobatools' }).click()
  await expect(page.getByRole('button', { name: 'Job Match (coming soon)' })).toBeVisible()
})

test('Notes lists the text files and each opens with a Notes breadcrumb', async ({ page }) => {
  await page.getByRole('button', { name: 'Notes' }).click()
  await expect(page.getByRole('button', { name: /readme\.txt/ })).toBeVisible()

  await page.getByRole('button', { name: /why-a-wolf\.txt/ }).click()
  await expect(page.getByText('Why a wolf?')).toBeVisible()

  await page.getByRole('button', { name: 'Notes' }).click()
  await expect(page.getByRole('button', { name: /readme\.txt/ })).toBeVisible()

  await page.getByRole('button', { name: /readme\.txt/ }).click()
  await expect(page.getByText('one source of truth')).toBeVisible()

  await page.getByRole('button', { name: 'lobatools' }).click()
  await expect(page.getByRole('button', { name: 'Job Match (coming soon)' })).toBeVisible()
})

test('a #hash link opens that app, and back returns home', async ({ page }) => {
  await page.goto('/#why-a-wolf')
  await expect(page.getByText('Why a wolf?')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Notes' })).toBeVisible()

  await page.goto('/')
  await page.getByRole('button', { name: 'MCP Server (coming soon)' }).click()
  await expect(page).toHaveURL(/#mcp$/)
  await page.goBack()
  await expect(page.getByRole('button', { name: 'Job Match (coming soon)' })).toBeVisible()
})

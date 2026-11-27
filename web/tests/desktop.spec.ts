import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('renders the desktop shell: brand, user, clock', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'lobatools' })).toBeVisible()
  await expect(page.getByText('Julianne Lobato')).toBeVisible()
  await expect(page.locator('header').first()).toContainText(/\d{2}:\d{2}/)
})

test('shows the desktop post-it on the wallpaper', async ({ page }) => {
  await expect(page.getByText("Hi, I'm Julianne", { exact: false })).toBeVisible()
})

test('dock brand tile opens the Welcome window', async ({ page }) => {
  await page.getByRole('button', { name: 'Welcome' }).click()
  await expect(page.getByText('Things I build, for me and for you.')).toBeVisible()
})

test('dock opens Job Match and marks it running', async ({ page }) => {
  await page.getByRole('button', { name: 'Job Match (coming soon)' }).click()
  await expect(page.getByRole('heading', { name: 'Job Match' })).toBeVisible()
  await expect(page.getByText("It's not live yet")).toBeVisible()
})

test('close button removes the window', async ({ page }) => {
  await page.getByRole('button', { name: 'Job Match (coming soon)' }).click()
  await expect(page.getByText("It's not live yet")).toBeVisible()
  await page.getByRole('button', { name: 'Close' }).click()
  await expect(page.getByText("It's not live yet")).toHaveCount(0)
})

test('minimize hides the window; dock reopens it', async ({ page }) => {
  const dockJob = page.getByRole('button', { name: 'Job Match (coming soon)' })
  await dockJob.click()
  await expect(page.getByText("It's not live yet")).toBeVisible()
  await page.getByRole('button', { name: 'Minimize' }).click()
  await expect(page.getByText("It's not live yet")).toHaveCount(0)
  await dockJob.click()
  await expect(page.getByText("It's not live yet")).toBeVisible()
})

test('maximize expands the window to fill the desktop', async ({ page }) => {
  await page.getByRole('button', { name: 'Job Match (coming soon)' }).click()
  const win = page.locator('section').filter({ hasText: "It's not live yet" })
  const before = await win.boundingBox()
  await page.getByRole('button', { name: 'Maximize' }).click()
  const after = await win.boundingBox()
  expect(after!.width).toBeGreaterThan(before!.width + 200)
})

test('ignores an invalid persisted wallpaper and falls back to the default', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'lobatools:settings',
      JSON.stringify({ wallpaper: 'vinho', reduceMotion: 'nope' }),
    )
  })
  await page.goto('/')

  await expect(page.locator('html')).toHaveAttribute('data-wallpaper', 'aubergine')
  await expect(page.locator('html')).toHaveAttribute('data-reduce-motion', 'false')

  await page.getByRole('button', { name: 'Settings', exact: true }).click()
  await expect(page.getByRole('radio', { name: 'Aubergine' })).toHaveAttribute(
    'aria-checked',
    'true',
  )
})

test('a window cannot be dragged off-screen under the menu bar', async ({ page }) => {
  await page.getByRole('button', { name: 'Job Match (coming soon)' }).click()
  const win = page.locator('section').filter({ hasText: "It's not live yet" })
  const header = win.locator('header').first()
  const box = await header.boundingBox()

  await page.mouse.move(box!.x + 80, box!.y + 10)
  await page.mouse.down()
  await page.mouse.move(5, 5, { steps: 12 })
  await page.mouse.up()

  const after = await win.boundingBox()
  expect(after!.y).toBeGreaterThanOrEqual(40)
  expect(after!.x + after!.width).toBeGreaterThan(70)
})

test('a window can be resized from the bottom-right corner', async ({ page }) => {
  await page.getByRole('button', { name: 'Job Match (coming soon)' }).click()
  const win = page.locator('section').filter({ hasText: "It's not live yet" })
  const before = await win.boundingBox()

  const handle = win.locator('[data-resize]')
  const box = await handle.boundingBox()
  await page.mouse.move(box!.x + 4, box!.y + 4)
  await page.mouse.down()
  await page.mouse.move(box!.x + 4 + 140, box!.y + 4 + 90, { steps: 12 })
  await page.mouse.up()

  const after = await win.boundingBox()
  expect(after!.width).toBeGreaterThan(before!.width + 90)
  expect(after!.height).toBeGreaterThan(before!.height + 50)
})

test('opening the same app twice keeps a single window', async ({ page }) => {
  const dockJob = page.getByRole('button', { name: 'Job Match (coming soon)' })
  await dockJob.click()
  await dockJob.click()
  await expect(page.locator('section').filter({ hasText: "It's not live yet" })).toHaveCount(1)
})

test('double-clicking readme.txt opens the file', async ({ page }) => {
  await page.getByRole('button', { name: 'Open readme.txt' }).dblclick()
  await expect(page.getByText('one source of truth')).toBeVisible()
})

test('double-clicking why-a-wolf.txt opens the file', async ({ page }) => {
  await page.getByRole('button', { name: 'Open why-a-wolf.txt' }).dblclick()
  await expect(page.getByText('Why a wolf?')).toBeVisible()
})

test('a #hash link opens that window', async ({ page }) => {
  await page.goto('/#why-a-wolf')
  await expect(page.getByText('Why a wolf?')).toBeVisible()
})

test('Notes is a phone-only app and stays out of the launcher', async ({ page }) => {
  await page.getByRole('button', { name: 'Show applications' }).click()
  await expect(page.getByRole('button', { name: 'why-a-wolf.txt', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Notes', exact: true })).toHaveCount(0)
})

test('the app launcher opens all apps from the dock', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'readme.txt', exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Show applications' }).click()
  await expect(page.getByRole('button', { name: 'readme.txt', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Explore my API', exact: true })).toBeVisible()
})

test('Settings opens and changes the wallpaper', async ({ page }) => {
  await page.getByRole('button', { name: 'Settings', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Pick a wallpaper' })).toBeVisible()
  await expect(page.getByText('About lobatools')).toBeVisible()

  await page.getByRole('radio', { name: 'Forest' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-wallpaper', 'forest')

  await page.getByRole('switch', { name: 'Calm things down' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-reduce-motion', 'true')
})

test('the desktop post-it can be dragged', async ({ page }) => {
  const sticky = page.locator('aside').filter({ hasText: "Hi, I'm Julianne" })
  const before = await sticky.boundingBox()
  await sticky.hover({ position: { x: 24, y: 20 } })
  await page.mouse.down()
  await page.mouse.move(before!.x + 24 + 160, before!.y + 20 + 90, { steps: 12 })
  await page.mouse.up()
  const after = await sticky.boundingBox()
  expect(Math.abs(after!.x - before!.x)).toBeGreaterThan(100)
  expect(Math.abs(after!.y - before!.y)).toBeGreaterThan(50)
})

test('clicking a window brings it to the front', async ({ page }) => {
  await page.getByRole('button', { name: 'Job Match (coming soon)' }).click()
  await page.getByRole('button', { name: 'Welcome' }).click()

  const jobWin = page.locator('section').filter({ hasText: "It's not live yet" })
  const welcomeWin = page.locator('section').filter({ hasText: 'Things I build' })
  const zOf = (loc: ReturnType<typeof page.locator>) =>
    loc.evaluate((el) => Number(getComputedStyle(el).zIndex) || 0)

  expect(await zOf(welcomeWin)).toBeGreaterThan(await zOf(jobWin))

  await jobWin.locator('header').click()
  expect(await zOf(jobWin)).toBeGreaterThan(await zOf(welcomeWin))
})

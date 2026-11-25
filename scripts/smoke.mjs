import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { root, openApp, navigate } from './browser.mjs'

const app = await openApp()
const { page } = app
const checks = []
const pass = name => { checks.push(name); console.log(`PASS ${name}`) }
try {
  const initial = await page.locator('.metric-demand strong').innerText()
  await page.getByRole('button', { name: 'Electricity', exact: true }).click()
  await page.waitForFunction(value => document.querySelector('.metric-demand strong')?.textContent !== value, initial)
  assert.notEqual(await page.locator('.metric-demand strong').innerText(), initial)
  await page.getByRole('combobox', { name: 'Select company site' }).selectOption('hamilton')
  await page.getByRole('button', { name: '7D', exact: true }).click()
  assert.equal(await page.getByRole('button', { name: '7D', exact: true }).getAttribute('aria-pressed'), 'true')
  pass('Overview site, resource and period filters respond')

  await navigate(page, 'Operations')
  const search = page.getByRole('textbox', { name: 'Find an asset' })
  await search.fill('no-such-asset')
  await page.getByText('No assets match', { exact: false }).waitFor()
  await search.fill('Compressed air')
  assert.equal(await page.locator('.operations-table .table-row').count(), 1)
  await page.getByRole('button', { name: 'View methodology' }).click()
  await page.getByText('Calculation note', { exact: true }).waitFor()
  pass('Operations search, empty state and methodology')

  await navigate(page, 'Anomalies')
  await page.getByRole('button', { name: 'Low', exact: true }).click()
  assert.equal(await page.locator('.anomaly-queue > button').count(), 1)
  await page.locator('.anomaly-queue > button').first().click()
  await page.getByRole('dialog').waitFor()
  await page.getByText('Observed fact', { exact: true }).waitFor()
  await page.getByRole('button', { name: 'Create action', exact: false }).click()
  const card = page.locator('.action-card').filter({ hasText: 'Investigate Paint Booth 01' })
  await card.waitFor()
  assert.equal(await page.locator('.action-card').count(), 5)
  const labels = ['Send to review', 'Approve action', 'Schedule action', 'Mark implemented', 'Verify result']
  for (const label of labels) await card.getByRole('button', { name: label, exact: false }).click()
  assert.equal(await card.getByRole('button', { name: 'Verified', exact: false }).isDisabled(), true)
  await page.reload({ waitUntil: 'networkidle' })
  await navigate(page, 'Actions')
  const persisted = page.locator('.action-card').filter({ hasText: 'Investigate Paint Booth 01' })
  assert.equal(await persisted.getByRole('button', { name: 'Verified', exact: false }).isDisabled(), true)
  pass('Anomaly creates an action, all status transitions work, state survives reload')

  await navigate(page, 'Performance')
  await page.getByRole('heading', { name: 'What did we actually save?' }).waitFor()
  await navigate(page, 'Reports')
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export CSV', exact: false }).click()
  const download = await downloadEvent
  const text = await readFile(await download.path(), 'utf8')
  assert.ok(text.startsWith('site,resource,period,value,unit,quality\n'))
  assert.equal(text.split('\n').length, 3)
  pass('Performance renders and Reports downloads the two-row demonstration CSV')

  await navigate(page, 'Data Sources')
  assert.equal(await page.locator('.source-table .table-row').count(), 5)
  await navigate(page, 'Settings')
  await page.locator('.settings-panel .switch').first().click()
  assert.equal(await page.locator('.settings-panel input[type=checkbox]').first().isChecked(), true)
  await page.reload({ waitUntil: 'networkidle' })
  assert.match(await page.locator('.app').getAttribute('class'), /compact-density/)
  await page.getByRole('button', { name: 'Start guided demo' }).click()
  for (let step = 0; step < 4; step++) await page.getByRole('button', { name: 'Continue', exact: false }).click()
  await page.getByRole('button', { name: 'Finish demo', exact: false }).click()
  await page.locator('.demo-guide').waitFor({ state: 'detached' })
  pass('Data Sources, persisted compact mode and five-step guided demo')

  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const view of ['Overview', 'Operations', 'Anomalies', 'Actions', 'Performance', 'Reports', 'Data Sources', 'Settings']) {
      await navigate(page, view)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      assert.ok(overflow <= 1, `${view} overflows ${overflow}px at ${width}px`)
    }
  }
  pass('All eight views fit 390px, 768px and 1440px viewports')
  assert.deepEqual(app.errors, [])
  pass('No uncaught browser errors')
  await mkdir(path.join(root, 'test-results'), { recursive: true })
  await writeFile(path.join(root, 'test-results/smoke.json'), JSON.stringify({
    testedAt: new Date().toISOString(), checks, pageErrors: app.errors,
    browser: process.env.PLAYWRIGHT_CHANNEL || 'playwright-chromium',
    reducedMotion: true,
  }, null, 2) + '\n')
} finally { await app.close() }

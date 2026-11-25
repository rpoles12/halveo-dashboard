import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { root, openApp, navigate } from './browser.mjs'

const output = path.join(root, 'docs/media')
await mkdir(output, { recursive: true })
const app = await openApp()
const { page } = app
const captures = []
async function capture(name, fullPage = false) {
  await page.waitForTimeout(900)
  await page.mouse.move(1910, 1070)
  await page.screenshot({ path: path.join(output, `${name}.png`), fullPage })
  captures.push({ file: `${name}.png`, viewport: page.viewportSize(), fullPage })
  console.log(`Captured ${name}`)
}
try {
  await capture('overview')
  await capture('overview-full', true)
  for (const [label, name] of [['Operations', 'operations'], ['Anomalies', 'anomalies']]) {
    await navigate(page, label)
    await capture(name)
  }
  await page.locator('.anomaly-queue > button').first().click()
  await capture('anomaly-detail')
  await page.getByRole('button', { name: 'Close', exact: true }).click()
  for (const [label, name] of [['Actions', 'actions'], ['Performance', 'performance'], ['Reports', 'reports'], ['Data Sources', 'data-sources'], ['Settings', 'settings']]) {
    await navigate(page, label)
    await capture(name)
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await navigate(page, 'Overview')
  await capture('overview-mobile', true)
  if (app.errors.length) throw new Error(app.errors.join('\n'))
  await writeFile(path.join(output, 'captures.json'), JSON.stringify({
    capturedAt: new Date().toISOString(),
    source: 'Production build; fresh browser context; deterministic fictional fixtures',
    reducedMotion: true,
    captures,
  }, null, 2) + '\n')
} finally { await app.close() }

import { chromium } from 'playwright'
import { preview } from 'vite'
import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const root = fileURLToPath(new URL('../', import.meta.url))

export async function openApp(options = {}) {
  const filePreview = process.env.HALVEO_FILE_PREVIEW === '1'
  const server = filePreview ? null : await preview({ root, preview: { host: '127.0.0.1', port: 0 } })
  let browser
  try {
    browser = await chromium.launch({
      headless: true,
      ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}),
    })
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      reducedMotion: 'reduce',
      ...options,
    })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    let url
    if (filePreview) {
      // Render local build bytes at a virtual origin when loopback networking is unavailable.
      const dist = path.join(root, 'dist')
      const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' }
      await page.route('**/*', async route => {
        const target = new URL(route.request().url())
        if (target.hostname !== 'halveo.local') return route.abort()
        const file = path.resolve(dist, '.' + decodeURIComponent(target.pathname === '/' ? '/index.html' : target.pathname))
        if (!file.startsWith(dist + path.sep)) return route.abort()
        try { await route.fulfill({ body: await readFile(file), contentType: types[path.extname(file)] || 'application/octet-stream' }) }
        catch { await route.fulfill({ status: 404, body: 'Not found' }) }
      })
      url = 'https://halveo.local/'
    } else {
      const address = server.httpServer.address()
      url = `http://127.0.0.1:${address.port}/`
    }
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.getByRole('heading', { name: 'What is happening?' }).waitFor()
    return {
      page, context, errors, url,
      close: async () => { await browser.close(); if (server) await new Promise(resolve => server.httpServer.close(resolve)) },
    }
  } catch (error) {
    await browser?.close()
    if (server) await new Promise(resolve => server.httpServer.close(resolve))
    throw error
  }
}

export async function navigate(page, label) {
  const direct = page.getByRole('button', { name: label, exact: true })
  if (await direct.count()) await direct.first().click()
  else {
    await page.locator('.more-navigation > button').click()
    await page.getByRole('menuitem', { name: label, exact: true }).click()
  }
  await page.waitForTimeout(350)
}

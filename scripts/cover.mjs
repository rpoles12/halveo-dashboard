import { chromium } from 'playwright'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { root } from './browser.mjs'

const embed = async (file, mime) => `data:${mime};base64,${(await readFile(path.join(root, file))).toString('base64')}`
const background = await embed('docs/brand/cover-background.png', 'image/png')
const logo = await embed('docs/brand/logo-white.svg', 'image/svg+xml')
const screenshot = await embed('docs/media/overview.png', 'image/png')
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}),
})
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
    *{box-sizing:border-box}body{margin:0;background:#0a0a0a;color:#e5e4e2;font-family:Arial,Helvetica,sans-serif}
    .cover{width:1920px;height:1080px;overflow:hidden;position:relative;background:#0a0a0a}
    .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.63}
    .veil{position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,10,10,.62),transparent 84%)}
    .top{position:absolute;top:73px;left:88px;right:88px;display:flex;justify-content:space-between;align-items:center}
    .logo{width:258px;height:auto}.meta{font-size:14px;letter-spacing:2.8px;text-transform:uppercase;color:#a9b1b5}
    .copy{position:absolute;left:88px;top:298px;width:750px;z-index:3}
    .eyebrow{font-size:16px;letter-spacing:3px;color:#91a8b7;margin-bottom:28px;text-transform:uppercase}
    h1{font-size:94px;line-height:1.01;letter-spacing:-5.6px;font-weight:500;margin:0 0 34px}
    .copy p{font-size:24px;line-height:1.5;color:#aab0b4;width:570px;margin:0}
    .flow{margin-top:55px;font-size:16px;color:#91a8b7;letter-spacing:.4px}
    .window{position:absolute;left:918px;top:241px;width:1130px;padding:9px;background:#13181c;border:1px solid #53697766;border-radius:18px;box-shadow:-24px 40px 110px #000b;transform:perspective(2000px) rotateY(-10deg) rotateX(4deg) rotateZ(-2deg);overflow:hidden}
    .window img{display:block;width:100%;border-radius:10px}
    .bottom{position:absolute;bottom:60px;left:88px;right:88px;border-top:1px solid #53697766;padding-top:22px;display:flex;justify-content:space-between;align-items:center}
    .bottom span{font-size:13px;letter-spacing:1px;color:#929ca2}.bottom strong{font-size:15px;font-weight:400;color:#e5e4e2}
  </style></head><body><div class="cover"><img class="bg" src="${background}" alt=""><div class="veil"></div>
  <div class="top"><img class="logo" src="${logo}" alt="Halveo"><span class="meta">Brand identity & digital experience</span></div>
  <div class="copy"><div class="eyebrow">Operational resource intelligence</div><h1>Precision.<br>From data<br>to action.</h1><p>A brand-led dashboard for industrial<br>water, energy and resource decisions.</p><div class="flow">Measure &nbsp;→&nbsp; Compare &nbsp;→&nbsp; Explain &nbsp;→&nbsp; Act &nbsp;→&nbsp; Verify</div></div>
  <div class="window"><img src="${screenshot}" alt="Actual Halveo overview screenshot"></div>
  <div class="bottom"><strong>Halveo / Dashboard prototype</strong><span>Portfolio case &nbsp;·&nbsp; Rafael Poles / Ruptive® &nbsp;·&nbsp; 2026</span></div>
  </div></body></html>`
  await page.setContent(html, { waitUntil: 'load' })
  await page.screenshot({ path: path.join(root, 'docs/media/cover.png') })
  await page.setViewportSize({ width: 1280, height: 640 })
  await page.addStyleTag({ content: '.cover{transform:scale(.666666667);transform-origin:top left}.bottom{bottom:142px}' })
  await page.screenshot({ path: path.join(root, 'docs/media/social-preview.png') })
  console.log('Composed 1920×1080 cover and 1280×640 social preview using original vectors and app capture.')
} finally { await browser.close() }

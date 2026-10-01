import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const out = '/opt/cursor/artifacts'
fs.mkdirSync(out, { recursive: true })
const base = process.env.LJ_URL || 'http://127.0.0.1:4180/'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await page.goto(base, { waitUntil: 'networkidle' })

await page.getByRole('button', { name: 'Studio', exact: true }).click()
await page.waitForSelector('.studio-sheet')

const hero = page.locator('.studio-hero')
const before = await hero.getAttribute('src')
if (!before || !/\/cozy\//.test(before)) {
  throw new Error('Expected default cozy loadout: ' + before)
}

await page.locator('.slider').nth(0).fill('90')
await page.locator('.slider').nth(1).fill('80')
await page.getByRole('button', { name: 'Athletic', exact: true }).click()
const figureStyle = await page.locator('.studio-hero-wrap').getAttribute('style')
if (!figureStyle || !/scale\(/.test(figureStyle)) {
  throw new Error('Expected body scale transform: ' + figureStyle)
}

const loadouts = ['Athletic', 'Stylish', 'Fancy', 'Casual', 'Undergarments', 'Cozy']
const folders = ['athletic', 'stylish', 'fancy', 'casual', 'undergarments', 'cozy']
for (let i = 0; i < loadouts.length; i++) {
  await page.locator('.pack-card', { hasText: loadouts[i] }).click()
  await page.waitForTimeout(200)
  const src = await hero.getAttribute('src')
  if (!src || !src.includes(`/packs/${folders[i]}/`)) {
    throw new Error(`Expected ${folders[i]} pack after ${loadouts[i]}: ${src}`)
  }
}

await page.screenshot({ path: path.join(out, 'live_journal_loadouts_studio.png'), fullPage: true })
console.log('OK studio loadouts', { before, figureStyle })
await browser.close()

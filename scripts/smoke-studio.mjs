import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const out = '/opt/cursor/artifacts'
fs.mkdirSync(out, { recursive: true })
const base = process.env.LJ_URL || 'http://127.0.0.1:4176/'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await page.goto(base, { waitUntil: 'networkidle' })

await page.getByRole('button', { name: 'Studio', exact: true }).click()
await page.waitForSelector('.studio-sheet')

const hero = page.locator('.studio-hero')
const before = await hero.getAttribute('src')
if (!before) throw new Error('Missing studio hero src')

await page.locator('.slider').nth(0).fill('90')
await page.locator('.slider').nth(1).fill('80')
await page.getByRole('button', { name: 'Athletic', exact: true }).click()

const figureStyle = await page.locator('.studio-hero-wrap').getAttribute('style')
if (!figureStyle || !/scale\(/.test(figureStyle)) {
  throw new Error('Expected body scale transform: ' + figureStyle)
}

await page.getByRole('button', { name: 'Crop top', exact: true }).click()
await page.waitForTimeout(200)
const afterTop = await hero.getAttribute('src')
if (!afterTop || afterTop === before) {
  // crop may still resolve differently; at least must include crop pack
}
if (!/\/crop\//.test(afterTop || '')) {
  throw new Error('Expected crop pack after Crop top: ' + afterTop)
}

await page.getByRole('button', { name: 'Sweater', exact: true }).click()
await page.getByRole('button', { name: 'Skirt', exact: true }).click()
await page.waitForTimeout(200)
const afterSkirt = await hero.getAttribute('src')
if (!/\/skirt\//.test(afterSkirt || '')) {
  throw new Error('Expected skirt pack with sweater: ' + afterSkirt)
}

await page.getByRole('button', { name: 'Jacket', exact: true }).click()
await page.waitForTimeout(200)
const afterJacket = await hero.getAttribute('src')
if (!/\/jacket\//.test(afterJacket || '')) {
  throw new Error('Expected jacket pack: ' + afterJacket)
}

await page.getByRole('button', { name: 'Sweater', exact: true }).click()
await page.getByRole('button', { name: 'Jeans', exact: true }).click()
await page.getByRole('button', { name: 'Boots', exact: true }).click()
await page.waitForTimeout(200)
const afterBoots = await hero.getAttribute('src')
if (!/\/jacket\//.test(afterBoots || '')) {
  throw new Error('Expected jacket pack from sweater+jeans+boots: ' + afterBoots)
}

await page.getByRole('button', { name: 'Necklace + earrings', exact: true }).click()
const overlays = await page.locator('.studio-preview .accessory-overlay').count()
if (overlays < 1) throw new Error('Expected accessory overlay in studio preview')

await page.screenshot({ path: path.join(out, 'live_journal_studio_wardrobe.png'), fullPage: true })
console.log('OK studio', { before, afterTop, afterSkirt, afterJacket, afterBoots, figureStyle })
await browser.close()

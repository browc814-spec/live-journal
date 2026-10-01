import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const out = '/opt/cursor/artifacts'
fs.mkdirSync(out, { recursive: true })
const base = process.env.LJ_URL || 'https://browc814-spec.github.io/live-journal/'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await page.goto(base, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Studio', exact: true }).click()
await page.waitForSelector('.studio-sheet')

await page.locator('.slider').nth(0).fill('35')
await page.locator('.slider').nth(1).fill('40')
await page.getByRole('button', { name: 'Slim', exact: true }).click()
await page.getByRole('button', { name: 'Crop top', exact: true }).click()
await page.getByRole('button', { name: 'Shorts', exact: true }).click()
await page.getByRole('button', { name: 'Earrings', exact: true }).click()
await page.waitForTimeout(400)
await page.screenshot({
  path: path.join(out, 'studio_crop_top_slim.png'),
  fullPage: true,
})

await page.locator('.slider').nth(0).fill('85')
await page.locator('.slider').nth(1).fill('70')
await page.getByRole('button', { name: 'Athletic', exact: true }).click()
await page.getByRole('button', { name: 'Jacket', exact: true }).click()
await page.getByRole('button', { name: 'Jeans', exact: true }).click()
await page.getByRole('button', { name: 'Boots', exact: true }).click()
await page.getByRole('button', { name: 'Necklace + earrings', exact: true }).click()
await page.waitForTimeout(400)
await page.screenshot({
  path: path.join(out, 'studio_jacket_athletic.png'),
  fullPage: true,
})

await page.getByRole('button', { name: 'Sweater', exact: true }).click()
await page.getByRole('button', { name: 'Skirt', exact: true }).click()
await page.getByRole('button', { name: 'Flats', exact: true }).click()
await page.getByRole('button', { name: 'Soft', exact: true }).click()
await page.waitForTimeout(400)
await page.screenshot({
  path: path.join(out, 'studio_skirt_sweater.png'),
  fullPage: true,
})

console.log('captured studio looks')
await browser.close()

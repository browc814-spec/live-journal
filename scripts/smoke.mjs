import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const out = '/opt/cursor/artifacts'
fs.mkdirSync(out, { recursive: true })
const base = process.env.LJ_URL || 'http://127.0.0.1:4176/'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await page.goto(base, { waitUntil: 'networkidle' })

const body = await page.locator('body').innerText()
if (!/Live Journal/i.test(body)) throw new Error('Missing brand')
if (!/Juniper/i.test(body)) throw new Error('Missing avatar name')

await page.getByRole('button', { name: 'Log', exact: true }).click()
await page.getByRole('tab', { name: 'Drink' }).click()
await page.locator('form select').first().selectOption('coffee')
await page.getByLabel('Cups / servings').fill('3')
await page.getByRole('button', { name: 'Log drink' }).click()
await page.waitForTimeout(400)

let text = await page.locator('.avatar-stage').innerText()
if (!/buzzing|jitter/i.test(text) && !/Jittery/i.test(text)) {
  throw new Error('Expected jittery after coffee: ' + text.slice(0, 200))
}
await page.screenshot({ path: path.join(out, 'live_journal_jittery.png'), fullPage: true })

await page.getByRole('button', { name: 'Log', exact: true }).click()
await page.getByRole('tab', { name: 'Food' }).click()
await page.getByPlaceholder('Oatmeal, burger, salad…').fill('Eggs and toast')
await page.locator('form select').first().selectOption('healthy')
await page.getByRole('button', { name: 'Log food' }).click()
await page.waitForTimeout(400)
text = await page.locator('.avatar-stage').innerText()
if (/buzzing|Jittery/i.test(text)) throw new Error('Still jittery after food')

await page.getByRole('button', { name: 'Log', exact: true }).click()
await page.getByRole('tab', { name: 'Exercise' }).click()
await page.getByPlaceholder('Walk, lift, ride, yoga…').fill('Brisk walk')
await page.getByRole('button', { name: 'Log exercise' }).click()
await page.waitForTimeout(400)
text = await page.locator('.avatar-stage').innerText()
if (!/Proud|Encouraged|Energized|felt that|spark|nodding/i.test(text)) {
  throw new Error('Expected goal-positive pose: ' + text.slice(0, 240))
}
await page.screenshot({ path: path.join(out, 'live_journal_proud.png'), fullPage: true })

console.log('OK', text.split('\n').slice(0, 8))
await browser.close()

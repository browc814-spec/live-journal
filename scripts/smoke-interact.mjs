import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const out = '/opt/cursor/artifacts'
fs.mkdirSync(out, { recursive: true })
const base = process.env.LJ_URL || 'http://127.0.0.1:4182/'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await page.goto(base, { waitUntil: 'networkidle' })

await page.getByRole('button', { name: /Talk to/i }).click()
await page.waitForSelector('.speech-bubble')
const tapText = await page.locator('.speech-bubble').innerText()
if (!tapText.trim()) throw new Error('Empty tap bubble')
await page.screenshot({ path: path.join(out, 'interactive_tap_bubble.png'), fullPage: true })

await page.getByRole('button', { name: 'Log', exact: true }).click()
await page.getByRole('tab', { name: 'Drink' }).click()
await page.locator('form select').first().selectOption('water')
await page.getByLabel('Cups / servings').fill('1')
await page.getByRole('button', { name: 'Log drink' }).click()
await page.waitForSelector('.speech-bubble')
const logText = await page.locator('.speech-bubble').innerText()
if (!/Hydration|Drink|crisp|sip/i.test(logText)) {
  throw new Error('Unexpected log bubble: ' + logText)
}
await page.screenshot({ path: path.join(out, 'interactive_log_bubble.png'), fullPage: true })

const blinking = await page.locator('.avatar-stack.is-blinking').count()
// blink is brief; just ensure lids element exists
const lids = await page.locator('.blink-lids').count()
if (lids < 1) throw new Error('Missing blink lids')

console.log('OK interact', { tapText, logText, blinking })
await browser.close()

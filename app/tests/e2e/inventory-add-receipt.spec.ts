import { test, expect } from '@playwright/test'
import {
  haveE2eCreds,
  signUpAndCreateCrewWithPremises,
} from './helpers/onboard'

// A 1x1 PNG — just enough for the capture step's canvas downscale to decode.
const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64',
)

test.describe('Adding Inventory — Receipt scan', () => {
  test.skip(
    !haveE2eCreds,
    'Set CLERK_* and VITE_SUPABASE_* in app/.env.test to enable. See README.',
  )

  test('gates unresolved lines, then creates + imports them', async ({
    page,
  }) => {
    await signUpAndCreateCrewWithPremises(page)

    const stamp = Date.now()
    const alpha = `E2E Receipt Alpha ${stamp}`
    const bravo = `E2E Receipt Bravo ${stamp}`

    // Mock the vision/resolution edge function: a fresh crew has an empty
    // catalog, so both lines come back unresolved (no candidates) and must be
    // explicitly created before import — exercising the gate.
    await page.route('**/functions/v1/parse-receipt', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          merchant: 'E2E Mart',
          rows: [
            {
              raw_text: 'ALPHA RAW',
              canonical_name: alpha,
              brand: null,
              category: null,
              quantity: 3,
              unit: 'count',
              unit_price: 2.5,
              resolution: 'new',
              product_id: null,
              product_name: null,
              candidates: [],
              confidence: 0,
            },
            {
              raw_text: 'BRAVO RAW',
              canonical_name: bravo,
              brand: null,
              category: null,
              quantity: 1,
              unit: 'count',
              unit_price: null,
              resolution: 'new',
              product_id: null,
              product_name: null,
              candidates: [],
              confidence: 0,
            },
          ],
        }),
      }),
    )

    await page.goto('/inventory/add/receipt')

    await page.getByLabel('Receipt photo').setInputFiles({
      name: 'receipt.png',
      mimeType: 'image/png',
      buffer: PNG_1X1,
    })

    // Preview shows both lines needing review; import is gated.
    await expect(page.getByText(/2 need review/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /^Add /i })).toBeDisabled()

    // Explicitly create a product for each unresolved line.
    await page
      .getByRole('button', { name: new RegExp(`Create.*${alpha}`) })
      .click()
    await page
      .getByRole('button', { name: new RegExp(`Create.*${bravo}`) })
      .click()

    // Both resolved → import enabled → commit via the real RPC.
    const addButton = page.getByRole('button', { name: /add 2 items/i })
    await expect(addButton).toBeEnabled()
    await addButton.click()

    await expect(page.getByText(/imported 2 items\./i)).toBeVisible()
  })
})

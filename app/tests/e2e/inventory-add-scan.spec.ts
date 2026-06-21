import { test, expect } from '@playwright/test'
import {
  haveE2eCreds,
  signUpAndCreateCrewWithPremises,
} from './helpers/onboard'

test.describe('Adding Inventory — Barcode scan', () => {
  test.skip(
    !haveE2eCreds,
    'Set CLERK_* and VITE_SUPABASE_* in app/.env.test to enable. See README.',
  )

  // Exercises the scanner's always-available manual-entry fallback. Decoding a
  // real barcode off a live camera isn't reliable headless, so the camera path
  // itself is intentionally out of scope here.
  test('looks up a hand-entered barcode, then adds the item', async ({
    page,
  }) => {
    const { premisesName } = await signUpAndCreateCrewWithPremises(page)

    await page.goto('/inventory/add/scan')

    // A barcode with no catalog match routes to custom product creation with
    // the code pre-filled.
    const barcode = `980${Date.now()}`
    await page.getByPlaceholder('012345678905').fill(barcode)
    await page.getByRole('button', { name: /look up/i }).click()

    const productName = `E2E Scan ${Date.now()}`
    await page.getByPlaceholder('Heinz tomato paste').fill(productName)
    await page.getByRole('button', { name: /^create product$/i }).click()

    // Details form: pick the Premises, then add.
    await page
      .getByLabel('Current location')
      .selectOption({ label: premisesName })
    await page.getByRole('button', { name: /add to inventory/i }).click()

    await expect(page.getByText(`Added ${productName}.`)).toBeVisible()
    await expect(
      page.getByText(/1 item scanned this session/i),
    ).toBeVisible()
  })
})

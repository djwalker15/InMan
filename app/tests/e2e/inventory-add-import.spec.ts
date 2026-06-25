import { test, expect } from '@playwright/test'
import {
  haveE2eCreds,
  signUpAndCreateCrewWithPremises,
} from './helpers/onboard'

test.describe('Adding Inventory — Bulk import', () => {
  test.skip(
    !haveE2eCreds,
    'Set CLERK_* and VITE_SUPABASE_* in app/.env.test to enable. See README.',
  )

  test('imports a CSV through map → preview → result', async ({ page }) => {
    await signUpAndCreateCrewWithPremises(page)

    await page.goto('/inventory/add/import')

    // headers (name/quantity/unit) match the auto-mapper's synonyms, so the
    // column-map step needs no manual mapping. Unique names stay "new"; the
    // location is unmapped and falls back to the crew's Premises default.
    const stamp = Date.now()
    const csv = [
      'name,quantity,unit',
      `E2E Import Alpha ${stamp},3,count`,
      `E2E Import Bravo ${stamp},2,count`,
      '',
    ].join('\n')

    await page.getByLabel('Spreadsheet file').setInputFiles({
      name: 'inventory-sample.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from(csv),
    })

    // Map step → all required fields auto-mapped → preview.
    await page.getByRole('button', { name: /preview import/i }).click()

    // Preview reflects both rows as importable, then commit via the RPC.
    await expect(page.getByText(/2 ready to import/i)).toBeVisible()
    await page.getByRole('button', { name: /import 2 items/i }).click()

    // Result step confirms the atomic bulk_import_inventory round-trip.
    await expect(page.getByText(/imported 2 items\./i)).toBeVisible()
  })
})

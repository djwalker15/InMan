import { test, expect } from '@playwright/test'
import {
  haveE2eCreds,
  signUpAndCreateCrewWithPremises,
} from './helpers/onboard'

test.describe('Adding Inventory — Manual search/create', () => {
  test.skip(
    !haveE2eCreds,
    'Set CLERK_* and VITE_SUPABASE_* in app/.env.test to enable. See README.',
  )

  test('creates a custom product, adds it, then restocks it', async ({
    page,
  }) => {
    const { premisesName } = await signUpAndCreateCrewWithPremises(page)

    await page.goto('/inventory/add/manual')

    const productName = `E2E Manual ${Date.now()}`

    // --- First add: search (no match) → create custom → details form --------
    await page.getByLabel('Search for a product').fill(productName)
    await page
      .getByRole('button', { name: /create a custom product/i })
      .click()

    await page.getByPlaceholder('Heinz tomato paste').fill(productName)
    await page.getByRole('button', { name: /^create product$/i }).click()

    // Details form: quantity (1) and unit (count) default; pick the Premises.
    await page
      .getByLabel('Current location')
      .selectOption({ label: premisesName })
    await page.getByRole('button', { name: /add to inventory/i }).click()

    await expect(page.getByText(`Added ${productName}.`)).toBeVisible()

    // --- Second pass: same product is now in inventory → restock branch -----
    await page.getByLabel('Search for a product').fill(productName)
    const restockThis = page.getByRole('button', { name: /restock this/i })
    await expect(restockThis).toBeVisible()
    await restockThis.click()

    // Restock form adds to the existing item (qty defaults to 1).
    await page.getByRole('button', { name: /^restock$/i }).click()

    await expect(
      page.getByText(/2 items added this session/i),
    ).toBeVisible()
  })
})

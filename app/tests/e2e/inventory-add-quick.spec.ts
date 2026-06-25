import { test, expect } from '@playwright/test'
import {
  haveE2eCreds,
  signUpAndCreateCrewWithPremises,
} from './helpers/onboard'

test.describe('Adding Inventory — Quick add', () => {
  test.skip(
    !haveE2eCreds,
    'Set CLERK_* and VITE_SUPABASE_* in app/.env.test to enable. See README.',
  )

  test('adds a minimal item via the quick-add form', async ({ page }) => {
    await signUpAndCreateCrewWithPremises(page)

    await page.goto('/inventory/add/quick')

    // Type a unique name with no catalog match → quick add creates a
    // crew-private product on submit (the deterministic path — no dependency
    // on what's in the seeded catalog).
    const productName = `E2E Quick ${Date.now()}`
    await page.getByLabel('What did you get?').fill(productName)

    // Quantity (1) and unit (count) default; the location defaults to the
    // crew's Premises once it loads, which enables the submit button.
    const addButton = page.getByRole('button', { name: /add to inventory/i })
    await expect(addButton).toBeEnabled()
    await addButton.click()

    // Stay-in-flow success: the status banner only renders after the
    // record_purchase round-trip resolves, so this proves the write landed.
    await expect(page.getByText(`Added ${productName}.`)).toBeVisible()
    await expect(
      page.getByText(/1 item added this session/i),
    ).toBeVisible()
  })
})

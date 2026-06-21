import { expect, type Page } from '@playwright/test'
import { setupClerkTestingToken } from '@clerk/testing/playwright'

/**
 * E2E credentials are only present when app/.env.test is configured (see
 * playwright.config.ts, which loads it before the dev server starts). Specs
 * gate on this so the suite skips cleanly in environments without Clerk +
 * Supabase wired up, mirroring auth-flow.spec.ts.
 */
export const haveE2eCreds =
  !!process.env.CLERK_PUBLISHABLE_KEY &&
  !!process.env.CLERK_SECRET_KEY &&
  !!process.env.VITE_SUPABASE_URL &&
  !!process.env.VITE_SUPABASE_PUBLISHABLE_KEY

export interface OnboardResult {
  email: string
  crewName: string
  premisesName: string
}

export interface OnboardOptions {
  crewName?: string
  premisesName?: string
}

/**
 * Drives a brand-new user from sign-up through to a crew with one Premises —
 * the minimum state every Adding Inventory method needs, since adds require a
 * location and a fresh user owns no crew or spaces.
 *
 * Mirrors the proven selectors in auth-flow.spec.ts: Clerk test instances
 * auto-verify any `+clerk_test@example.com` address with the fixed code 424242.
 * Each call uses a unique timestamped email so tests stay independent.
 */
export async function signUpAndCreateCrewWithPremises(
  page: Page,
  opts: OnboardOptions = {},
): Promise<OnboardResult> {
  const stamp = Date.now()
  const crewName = opts.crewName ?? `E2E Crew ${stamp}`
  const premisesName = opts.premisesName ?? `E2E Home ${stamp}`
  const email = `e2e-${stamp}+clerk_test@example.com`

  await setupClerkTestingToken({ page })

  // Sign up with email + password, then verify the emailed code.
  await page.goto('/sign-up')
  await page.getByPlaceholder('name@company.com').fill(email)
  await page.getByPlaceholder('••••••••').fill('e2e-password-A123!')
  await page.getByRole('button', { name: /create account/i }).click()
  await page.getByPlaceholder('123456').fill('424242')
  await page.getByRole('button', { name: /^verify$/i }).click()

  // Fresh, crew-less user lands on the dashboard; resume into onboarding.
  await expect(page).toHaveURL(/\/dashboard/)
  await page.getByRole('link', { name: /resume/i }).click()
  await expect(page).toHaveURL(/\/onboarding$/)

  // "Start a new Crew" is the default selection → continue to the crew form.
  await page.getByRole('button', { name: /continue/i }).click()
  await expect(page).toHaveURL(/\/onboarding\/new/)
  await page.getByPlaceholder('My House').fill(crewName)
  await page.getByRole('button', { name: /create crew/i }).click()
  await expect(page).toHaveURL(/\/onboarding\/spaces/)

  // Spaces step: a fresh browser shows the explainer first — dismiss it, then
  // name the Premises. The explainer is skipped once dismissed (localStorage),
  // so guard the click.
  const gotIt = page.getByRole('button', { name: /got it, let's build/i })
  if (await gotIt.isVisible().catch(() => false)) {
    await gotIt.click()
  }
  await page.getByPlaceholder('My House').fill(premisesName)
  await page.getByRole('button', { name: /continue/i }).click()

  // The Premises insert resolves into the guided phase, where the new node
  // shows in the live tree — proof the row landed before we add inventory.
  await expect(page.getByText(premisesName).first()).toBeVisible()

  return { email, crewName, premisesName }
}

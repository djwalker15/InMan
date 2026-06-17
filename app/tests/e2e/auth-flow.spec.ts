import { test, expect } from '@playwright/test'
import { setupClerkTestingToken } from '@clerk/testing/playwright'

const haveClerkCreds =
  !!process.env.CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY
const haveSupabaseCreds =
  !!process.env.VITE_SUPABASE_URL && !!process.env.VITE_SUPABASE_PUBLISHABLE_KEY

test.describe('auth flow smoke', () => {
  test.skip(
    !haveClerkCreds || !haveSupabaseCreds,
    'Set CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY in app/.env.test to enable. See README.',
  )

  test('sign-up → dashboard → create crew', async ({ page }) => {
    await setupClerkTestingToken({ page })

    // Clerk test instances auto-verify any address ending in +clerk_test@example.com
    // with the fixed code 424242.
    const email = `e2e-${Date.now()}+clerk_test@example.com`

    // Sign up with email + password.
    await page.goto('/sign-up')
    await page.getByPlaceholder('name@company.com').fill(email)
    await page.getByPlaceholder('••••••••').fill('e2e-password-A123!')
    await page.getByRole('button', { name: /create account/i }).click()

    // Verify the emailed code.
    await page.getByPlaceholder('123456').fill('424242')
    await page.getByRole('button', { name: /^verify$/i }).click()

    // A fresh, crew-less user lands on the dashboard with the onboarding
    // checklist (same destination the OAuth sign-up branch uses).
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.getByRole('heading', { name: /welcome,/i })).toBeVisible()

    // The checklist's first incomplete step ("Create your Crew") resumes into
    // the onboarding decision page.
    await page.getByRole('link', { name: /resume/i }).click()
    await expect(page).toHaveURL(/\/onboarding$/)

    // "Start a new Crew" is selected by default → continue to the crew form.
    await page.getByRole('button', { name: /continue/i }).click()
    await expect(page).toHaveURL(/\/onboarding\/new/)

    // Create the crew. This writes crews + crew_members under RLS, so reaching
    // the spaces step proves the authenticated write path works end to end.
    await page.getByPlaceholder('My House').fill('E2E Test Crew')
    await page.getByRole('button', { name: /create crew/i }).click()

    await expect(page).toHaveURL(/\/onboarding\/spaces/)
  })
})

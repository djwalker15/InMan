import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/protected-route'
import { PublicOnlyRoute } from './components/public-only-route'
import { RestoreAccountGate } from './components/account/restore-account-gate'
import LandingPage from './routes/landing'
import SignInPage from './routes/sign-in'
import SignUpPage from './routes/sign-up'
import SSOCallbackPage from './routes/sso-callback'
import CrewDecisionPage from './routes/onboarding/decision'
import CrewCreationPage from './routes/onboarding/new'
import OnboardingSpacesPage from './routes/onboarding/spaces'
import SpacesPage from './routes/spaces'
import InventoryPage from './routes/inventory'
import AddInventoryPage from './routes/inventory/add'
import AlertsPage from './routes/alerts'
import CrewsPage from './routes/crews'
import CrewSettingsPage from './routes/crew/settings'
import AccountSettingsPage from './routes/settings/account'
import InviteAcceptPage, { InviteEntryPage } from './routes/invite-accept'
import DashboardPage from './routes/dashboard'

export default function App() {
  return (
    <>
      <RestoreAccountGate />
      <Routes>
        <Route path="/sso-callback" element={<SSOCallbackPage />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<CrewDecisionPage />} />
          <Route path="/onboarding/new" element={<CrewCreationPage />} />
          <Route path="/onboarding/spaces" element={<OnboardingSpacesPage />} />
          <Route path="/spaces" element={<SpacesPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/inventory/add" element={<AddInventoryPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/crews" element={<CrewsPage />} />
          <Route path="/crew/settings" element={<CrewSettingsPage />} />
          <Route path="/settings/account" element={<AccountSettingsPage />} />
          <Route path="/invite" element={<InviteEntryPage />} />
          <Route path="/invite/:code" element={<InviteAcceptPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

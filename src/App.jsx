import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Toaster } from '@/components/ui/sonner'
import DashboardLayout from '@/layouts/DashboardLayout'
import Home from '@/pages/Home'
import LoginPage from '@/pages/LoginPage'
import SignUpPage from '@/pages/SignUpPage'
import AuditSessionsPage from '@/pages/dashboard/AuditSessionsPage'
import OverviewPage from '@/pages/dashboard/OverviewPage'
import SettingsPage from '@/pages/dashboard/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="sessions" element={<AuditSessionsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* Legacy commerce routes → sessions */}
          <Route path="orders" element={<Navigate to="/dashboard/sessions" replace />} />
          <Route path="customers" element={<Navigate to="/dashboard" replace />} />
          <Route path="analytics" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  )
}

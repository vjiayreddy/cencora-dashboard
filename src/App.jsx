import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import Home from '@/pages/Home'
import AnalyticsPage from '@/pages/dashboard/AnalyticsPage'
import CustomersPage from '@/pages/dashboard/CustomersPage'
import OrdersPage from '@/pages/dashboard/OrdersPage'
import OverviewPage from '@/pages/dashboard/OverviewPage'
import SettingsPage from '@/pages/dashboard/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

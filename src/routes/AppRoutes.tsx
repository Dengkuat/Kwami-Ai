import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ChatPage from '../pages/ChatPage'
import ChecklistPage from '../pages/ChecklistPage'
import LandingPage from '../pages/LandingPage'
import ProfilePage from '../pages/ProfilePage'
import ServicesPage from '../pages/ServicesPage'
import { ROUTE_PATHS } from './routePaths'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_PATHS.landing} element={<LandingPage />} />
        <Route path={ROUTE_PATHS.services} element={<ServicesPage />} />
        <Route path={ROUTE_PATHS.chat} element={<ChatPage />} />
        <Route path={ROUTE_PATHS.checklist} element={<ChecklistPage />} />
        <Route path={ROUTE_PATHS.profile} element={<ProfilePage />} />
        <Route path="*" element={<Navigate to={ROUTE_PATHS.landing} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes

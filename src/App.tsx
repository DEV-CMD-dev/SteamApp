import './App.css'
import AuthForm from './components/Auth/AuthForm'
import { AuthProvider } from './contexts/AuthContext'
import MainLayout from './MainLayout'
import ConfirmedEmailPage from './pages/ConfirmedEmailPage'
import EditProfilePage from './pages/EditProfilePage'
import LibraryPage from './pages/LibraryPage'
import ProfilePage from './pages/ProfilePage'
import RequestResetPasswordPage from './pages/RequestResetPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import StorePage from './pages/StorePage'
import SettingsPage from './pages/SettingsPage'
import { Routes, Route } from 'react-router-dom'
import WishListPage from './pages/WishListPage'
import { ProtectedRoute } from './contexts/ProtectedRoute'
import GamePageContainer from './components/GameDetailPage/GamePageContainer'
import TwoFactorConfirmationPage from './pages/TwoFactorConfirmationPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/auth' element={<AuthForm />} />
        <Route path='/forgot-password' element={<RequestResetPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='/confirm-email' element={<ConfirmedEmailPage />} />
        <Route path='/login-2fa' element={<TwoFactorConfirmationPage />} />

        <Route element={<MainLayout />}>
          <Route path='/' element={<StorePage />} />
          <Route path='/library' element={
            <ProtectedRoute>
              <LibraryPage />
            </ProtectedRoute>
          } />
          <Route path='/profile' element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path='/profile/edit' element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          } />
          <Route path='/settings' element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } />
          <Route path='/wishlist' element={
            <ProtectedRoute>
              <WishListPage />
            </ProtectedRoute>
          } />
          <Route path="/game/:id" element={
            <GamePageContainer />
          } />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App

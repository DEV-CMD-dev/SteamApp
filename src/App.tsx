import './App.css'
import AuthForm from './components/Auth/AuthForm'
import { AuthProvider } from './contexts/AuthContext'
import MainLayout from './MainLayout'
import ConfirmedEmailPage from './pages/ConfirmedEmailPage'
import GamePageContainer from './components/GameDetailPage/GamePageContainer'
import LibraryPage from './pages/LibraryPage'
import ProfilePage from './pages/ProfilePage'
import RequestResetPasswordPage from './pages/RequestResetPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import StorePage from './pages/StorePage'
import { Routes, Route } from 'react-router-dom'
import WishListPage from './pages/WishListPage'
import { ProtectedRoute } from './contexts/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/auth' element={<AuthForm />} />
        <Route path='/forgot-password' element={<RequestResetPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='/confirm-email' element={<ConfirmedEmailPage />} />

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
          <Route path='/wishlist' element={
            <ProtectedRoute>
              <WishListPage />
            </ProtectedRoute>
          } />
          <Route path="/game/:id" element={
            <ProtectedRoute>
              <GamePageContainer />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App

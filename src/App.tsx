import './App.css'
import AuthForm from './components/Auth/AuthForm'
import { AuthProvider } from './contexts/AuthContext'
import MainLayout from './MainLayout'
import ConfirmedEmailPage from './pages/ConfirmedEmailPage'
import LibraryPage from './pages/LibraryPage'
import ProfilePage from './pages/ProfilePage'
import RequestResetPasswordPage from './pages/RequestResetPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import StorePage from './pages/StorePage'
import {Routes, Route} from 'react-router-dom'
import WishListPage from './pages/WishListPage'

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
          <Route path='/library' element={<LibraryPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/wishlist' element={<WishListPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App

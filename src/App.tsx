import './App.css'
import AuthForm from './components/Auth/AuthForm'
import { AuthProvider } from './contexts/AuthContext'
import LibraryPage from './pages/LibraryPage'
import ProfilePage from './pages/ProfilePage'
import StorePage from './pages/StorePage'
import MainLayout from './layouts/MainLayout';
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="auth" element={<AuthForm />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<StorePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
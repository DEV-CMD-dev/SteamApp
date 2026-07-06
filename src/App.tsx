import './App.css'
import AuthForm from './components/Auth/AuthForm'
import { AuthProvider } from './contexts/AuthContext'
import LibraryPage from './pages/LibraryPage'
import ProfilePage from './pages/ProfilePage'
import StorePage from './pages/StorePage'
import Navbar from './partials/Navbar'
import {Routes, Route} from 'react-router-dom'

function App() {
  return (
    <>
      <AuthProvider>
        <div className="site-wrapper"> 
          <Navbar />
          <div className='pages-container'>
            <Routes>
              <Route path='auth' element={<AuthForm />} />
              <Route path='/' element={<StorePage />} />
              <Route path='/library' element={<LibraryPage />} />
              <Route path='/profile' element={<ProfilePage />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </>
  )
}

export default App

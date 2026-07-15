import { Link } from 'react-router-dom'
import lockImg from '../assets/password-reset/lock.png'
import '../css/resetPasswordPage.css'
import logo from '../assets/logo.svg';

export default function ResetPasswordPage(){
    return(
        <div className='reset-password-page-wrapper'>
            <Link to='/' className="auth-logo-wrapper">
                <img src={logo} alt="Website Logo" className="auth-logo" />
            </Link>
            <div className='reset-password-form-wrapper'>
                <div className='lock-image-wrapper'>
                    <img src={lockImg} alt="" className='lock-image'/>
                </div>
                <h2>Reset your password</h2>
                <p>Forgot your password? Please enter your email or username and we'll send you reset link.</p>
                <form action="POST" className='reset-password-form'>
                    <input type="text" placeholder='Enter your email or username'/>
                    <button className='reset-password-button'>Send reset link</button>
                </form>
                <Link to='/auth' className='back-to-login'>Back to login page</Link>
            </div>
        </div>
    )
}
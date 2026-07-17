import { Link, useNavigate } from 'react-router-dom'
import lockImg from '../assets/password-reset/lock.png'
import { userHelperService } from '../services/userHelperService'
import '../css/resetPasswordPage.css'
import logo from '../assets/logo.svg';
import { useState } from 'react';
import type { RequestPasswordResetTokenDto } from '../DTOs/UserHelper/RequestPasswordResetTokenDto';

export default function RequestResetPasswordPage(){
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const [form, setForm] = useState<RequestPasswordResetTokenDto>({
        identifier: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
      };

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) =>{
        e.preventDefault();

        try {

            if (!form.identifier.trim()) {
                setErrorMessage("Please enter your email or username.");
                return;
            }

            setIsLoading(true);
            setErrorMessage(null);

            await userHelperService.requestResetPassword({
                identifier: form.identifier.trim()
            })
            setForm({identifier: ""});
            alert("If account existed link has been sent to your email")

            setTimeout(() => {
                navigate("/auth");
            }, 3000);
        }
        catch (err: any) 
        {
            if (err.message === "Failed to fetch") {
                setErrorMessage("Cannot connect to the server");
            } 
            else
            {
                setErrorMessage(err.message || "An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
        
    }

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
                <form onSubmit={handleSubmit} className='reset-password-form'>
                    <input 
                        required
                        disabled={isLoading}
                        name="identifier"
                        value={form.identifier}
                        onChange={handleChange}
                        type="text"
                        placeholder='Enter your email or username'/>
                    <button 
                        type='submit'
                        className='reset-password-button'
                        disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send reset link"}
                    </button>
                </form>
                <Link to='/auth' className='back-to-login'>Back to login page</Link>
                {errorMessage && (
                    <div className='user-helper-error'>{errorMessage}</div>
                )}
            </div>
        </div>
    )
}
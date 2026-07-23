import { Link, useNavigate, useSearchParams } from "react-router-dom";
import lockImg from "../assets/password-reset/lock.png";
import logo from "../assets/logo.svg";
import "../css/resetPasswordPage.css";
import type { PasswordResetDto } from "../DTOs/UserHelper/PasswordResetDto";
import { useState } from "react";
import { userHelperService } from "../services/userHelperService";

type ResetPasswordForm = PasswordResetDto & {
        confirmPassword: string;
    };

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const tokenParam = searchParams.get("token");
    const identifierParam = searchParams.get("identifier")

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [form, setForm] = useState<ResetPasswordForm>({
        identifier: identifierParam ?? "",
        token: tokenParam ?? "",
        newPassword: "",
        confirmPassword: ""
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) =>{
        e.preventDefault();
    
        try {

            if(!form.newPassword.trim() || !form.confirmPassword.trim()){
                setErrorMessage("Please fill in all the fields.")
                return;
            }
            if(form.newPassword !== form.confirmPassword){
                setErrorMessage("Passwords don't match.")
                return;
            }

            setIsLoading(true);
            setErrorMessage(null);

            await userHelperService.resetPassword({
                identifier: form.identifier,
                token: form.token,
                newPassword: form.newPassword
            })
            setForm(prev => ({
                ...prev,
                newPassword: "",
                confirmPassword: ""
            }));
            alert("Password has been reset successfully")
            
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

    return (
        <div className="reset-password-page-wrapper">
            <Link to="/" className="auth-logo-wrapper">
                <img src={logo} alt="Website Logo" className="auth-logo" />
            </Link>

            <div className="reset-password-form-wrapper">
                <div className="lock-image-wrapper">
                    <img src={lockImg} alt="" className="lock-image" />
                </div>

                <h2>Create a new password</h2>
                <p>
                    Enter your new password below and confirm it to reset your
                    account password.
                </p>

                <form className="reset-password-form" onSubmit={handleSubmit}>
                    <input
                        type="password"
                        disabled={isLoading}
                        name="newPassword"
                        placeholder="New password"
                        value={form.newPassword}
                        onChange={handleChange}/>
                    <input
                        type="password"
                        disabled={isLoading}
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        value={form.confirmPassword}
                        onChange={handleChange}/>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="reset-password-button">
                        {isLoading ? "Resetting..." : "Reset password"}
                    </button>
                </form>

                <Link to="/auth" className="back-to-login">
                    Back to login page
                </Link>
                {errorMessage && (
                    <div className='user-helper-error'>{errorMessage}</div>
                )}
            </div>
        </div>
    );
}
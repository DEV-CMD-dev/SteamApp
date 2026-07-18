import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { userHelperService } from "../services/userHelperService";

import logo from "../assets/logo.svg";
import emailImg from "../assets/email-confirmation/mail-confirm.png";
import "../css/resetPasswordPage.css";

export default function ConfirmedEmailPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");
    const identifier = searchParams.get("identifier");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const confirmEmail = async () => {
            if (!token || !identifier) {
                setStatus("error");
                setErrorMessage("Invalid confirmation link.");
                return;
            }

            try {
                await userHelperService.confirmEmail({
                    identifier,
                    token,
                });

                setStatus("success");

                setTimeout(() => {
                    navigate("/auth");
                }, 5000);
            } catch (err: any) {
                setStatus("error");

                if (err.message === "Failed to fetch") {
                    setErrorMessage("Cannot connect to the server.");
                } else {
                    setErrorMessage(
                        err.message || "Email confirmation failed."
                    );
                }
            }
        };

        confirmEmail();
    }, [identifier, token, navigate]);

    return (
        <div className="reset-password-page-wrapper">
            <Link to="/" className="auth-logo-wrapper">
                <img src={logo} alt="Website Logo" className="auth-logo" />
            </Link>

            <div className="reset-password-form-wrapper">
                <div className="lock-image-wrapper">
                    <img
                        src={emailImg}
                        alt="Email confirmation"
                        className="lock-image"/>
                </div>

                {status === "loading" && (
                    <div>
                        <h2>Confirming your email...</h2>
                        <p>Please wait while we verify your email address.</p>
                    </div>
                )}

                {status === "success" && (
                    <div>
                        <h2>Email confirmed!</h2>
                        <p>
                            Your email has been successfully confirmed.
                            <br />
                            You will be redirected to the login page in a few
                            seconds.
                        </p>

                        <Link to="/auth" className="back-to-login">
                            Go to login now
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div>
                        <h2>Confirmation failed</h2>
                        <p>{errorMessage}</p>

                        <Link to="/auth" className="back-to-login">
                            Back to login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
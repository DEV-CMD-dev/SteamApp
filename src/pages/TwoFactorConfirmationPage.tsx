import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { authService } from "../services/authService";
import styles from "../css/TwoFactorConfirmationPage.module.css";
import logo from "../assets/logo.svg";

export default function TwoFactorConfirmationPage() {
    const { username, login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const submitCode = async (verificationCode: string) => {
        if (!username || verificationCode.length !== 6 || isLoading) return;

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const data = await authService.loginTwoFactor({
                identifier: username,
                code: verificationCode
            });

            login(data.accessToken, new Date(data.expirationTime), data.userName);
            navigate("/");
        } catch (err: any) {
            if (err.message === "Failed to fetch") {
                setErrorMessage("Cannot connect to the server");
            } else {
                setErrorMessage(err.message || "Invalid verification code");
            }

            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);

        const newCode = [...code];
        newCode[index] = digit;
        setCode(newCode);
        setErrorMessage(null);

        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        if (digit && index === 5) {
            const verificationCode = newCode.join("");

            if (verificationCode.length === 6) {
                submitCode(verificationCode);
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        const pastedCode = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!pastedCode) return;

        const newCode = ["", "", "", "", "", ""];

        pastedCode.split("").forEach((digit, index) => {
            newCode[index] = digit;
        });

        setCode(newCode);

        if (pastedCode.length === 6) {
            submitCode(pastedCode);
        } else {
            inputRefs.current[pastedCode.length]?.focus();
        }
    };

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        submitCode(code.join(""));
    };

    return (
        <div className={styles.twoFactorPageWrapper}>
            <Link to="/" className={styles.logoWrapper}>
                <img src={logo} alt="Website Logo" className={styles.logo} />
            </Link>

            <div className={styles.twoFactorFormWrapper}>
                <h2>Two-factor authentication</h2>

                <p>
                    Enter the 6-digit verification code we sent to your email
                </p>

                <form className={styles.twoFactorForm} onSubmit={handleSubmit}>
                    <div className={styles.twoFactorCodeInputs}>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(element) => {
                                    inputRefs.current[index] = element;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                disabled={isLoading}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                autoFocus={index === 0}/>
                        ))}
                    </div>

                    {errorMessage && (
                        <div className={styles.twoFactorError}>
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.twoFactorButton}>
                          Verify 2FA code
                    </button>
                </form>

                <Link to="/auth" className={styles.backToLogin}>
                    Back to login page
                </Link>
            </div>
        </div>
    );
}
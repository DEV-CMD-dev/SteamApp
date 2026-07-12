import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import loginImg from "../../assets/authpage/login.png";
import logoImg from "../../assets/authpage/logo.png";
import "../../css/authForm.css";

type FormState = {
  identifier: string;
  email: string;
  password: string;
  country: string;
};

const API_BASE = "https://localhost:7166";

const SOCIAL_PROVIDERS = ["discord", "google", "facebook", "x"] as const;

const AuthForm: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<FormState>({
    identifier: "",
    email: "",
    password: "",
    country: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchMode = (target: boolean) => {
    if (target === isLogin) return;
    setIsLogin(target);
    setErrorMessage(null);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isLogin) {
        const res = await fetch(`${API_BASE}/api/Auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Identifier: form.identifier,
            Password: form.password,
            RememberMe: rememberMe,
          }),
        });

        const contentType = res.headers.get("content-type");
        const data = contentType?.includes("application/json") ? await res.json() : null;

        if (!res.ok) {
          setErrorMessage(data?.detail || data?.message || "Login failed. Please check your credentials.");
          return;
        }

        localStorage.setItem("accessToken", data.accessToken);
        login(data.accessToken, form.identifier);
        navigate("/");
      } else {
        if (!agreeToTerms) {
          setErrorMessage("You need to agree to the terms and conditions to continue.");
          return;
        }

        const res = await fetch(`${API_BASE}/api/Auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            UserName: form.identifier,
            Email: form.email,
            Password: form.password,
            Country: form.country,
          }),
        });

        const contentType = res.headers.get("content-type");
        const data = contentType?.includes("application/json") ? await res.json() : null;

        if (!res.ok) {
          if (data?.errors) {
            setErrorMessage(Object.values(data.errors).flat().join(". "));
          } else {
            setErrorMessage(data?.detail || data?.message || "Registration failed. Try again.");
          }
          return;
        }

        alert("Registration successful! Please login.");
        setForm((prev) => ({ ...prev, email: "", country: "" }));
        setAgreeToTerms(false);
        setIsLogin(true);
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("Cannot connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="nexus-auth">
      <div className="nexus-auth__stage">
        <img src={loginImg} alt="" className="nexus-auth__stage-img" />
      </div>

      <div className="nexus-auth__panel">
        <div className="nexus-auth__header">
          <Link to="/" className="nexus-auth__logo-link" aria-label="Go to homepage">
            <img src={logoImg} alt="nexus" className="nexus-auth__logo" />
          </Link>
          <div className="nexus-auth__tabs" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              role="tab"
              aria-selected={isLogin}
              className={`nexus-auth__tab ${isLogin ? "is-active" : ""}`}
              onClick={() => handleSwitchMode(true)}
            >
              Log In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isLogin}
              className={`nexus-auth__tab ${!isLogin ? "is-active" : ""}`}
              onClick={() => handleSwitchMode(false)}
            >
              Register
            </button>
          </div>
        </div>

        <div className="nexus-auth__card">
          <form onSubmit={handleSubmit} className="nexus-auth__form" noValidate>
            {!isLogin && (
              <label className="nexus-field">
                <span className="nexus-field__label">Email</span>
                <input
                  type="email"
                  name="email"
                  placeholder="teamNEXUS@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </label>
            )}

            <label className="nexus-field">
              <span className="nexus-field__label">Username</span>
              <input
                type="text"
                name="identifier"
                placeholder="Light2077"
                value={form.identifier}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </label>

            <label className="nexus-field">
              <span className="nexus-field__label">Password</span>
              <div className="nexus-field__password">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Gogol_nexus"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                />
                <button
                  type="button"
                  className="nexus-field__toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <EyeIcon crossed={!showPassword} />
                </button>
              </div>
            </label>

            {!isLogin && (
              <label className="nexus-field">
                <span className="nexus-field__label">Country</span>
                <input
                  type="text"
                  name="country"
                  placeholder="Enter to Continue"
                  value={form.country}
                  onChange={handleChange}
                  autoComplete="country-name"
                  required
                />
              </label>
            )}

            {isLogin ? (
              <div className="nexus-auth__row">
                <a href="/forgot-password" className="nexus-link">
                  Forgot the password?
                </a>
                <label className="nexus-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
              </div>
            ) : (
              <label className="nexus-checkbox nexus-checkbox--standalone">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  required
                />
                <span>
                  I agree to the <a href="/terms" className="nexus-link">terms and conditions</a>
                </span>
              </label>
            )}

            {errorMessage && <div className="nexus-auth__error">{errorMessage}</div>}

            <button type="submit" className="nexus-submit" disabled={isLoading}>
              {isLoading ? "Loading..." : isLogin ? "Log In" : "Sign Up"}
            </button>
          </form>

          <div className="nexus-auth__oauth">
            <span className="nexus-auth__oauth-label">{isLogin ? "Log in via" : "Register via"}</span>
            <div className="nexus-auth__oauth-buttons">
              {SOCIAL_PROVIDERS.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`nexus-oauth-btn nexus-oauth-btn--${p}`}
                  aria-label={`${isLogin ? "Log in" : "Register"} with ${p}`}
                >
                  <SocialIcon provider={p} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EyeIcon: React.FC<{ crossed?: boolean }> = ({ crossed }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    {crossed && <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />}
  </svg>
);

const SocialIcon: React.FC<{ provider: (typeof SOCIAL_PROVIDERS)[number] }> = ({ provider }) => {
  switch (provider) {
    case "discord":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 5.5c-1.6-.8-3.3-1.3-5-1.6l-.3.5c1.6.4 3 1 4.3 1.8-2-1-4.4-1.6-6.9-1.6s-4.9.6-6.9 1.6c1.3-.8 2.7-1.4 4.3-1.8L9.2 3.9c-1.7.3-3.4.8-5 1.6C1.7 9 1 12.4 1.3 15.7c1.8 1.4 3.6 2.2 5.3 2.7l.7-1.2c-.9-.3-1.8-.7-2.6-1.3.2.2.5.3.7.5 2 1.1 4.2 1.6 6.6 1.6s4.6-.5 6.6-1.6c.2-.1.5-.3.7-.5-.8.6-1.7 1-2.6 1.3l.7 1.2c1.7-.5 3.5-1.3 5.3-2.7.4-3.9-.6-7.2-2.7-10.2ZM8.8 13.6c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7Zm6.4 0c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7Z" />
        </svg>
      );
    case "google":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4c-.2 1.3-1 2.3-2 3v2.5h3.3c1.9-1.8 3-4.4 3-7.4Z" />
          <path d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3v2.6C4.7 19.9 8.1 22 12 22Z" />
          <path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3C2.4 8.8 2 10.4 2 12s.4 3.2 1 4.6l3.4-2.6Z" />
          <path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9C16.9 2.8 14.7 2 12 2 8.1 2 4.7 4.1 3 7.4l3.4 2.6c.8-2.3 3-4.1 5.6-4.1Z" />
        </svg>
      );
    case "facebook":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.5 21.9v-8.1h2.7l.4-3.2h-3.1V8.5c0-.9.3-1.6 1.6-1.6h1.7V4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.6H7.7v3.2h2.7v8.1h3.1Z" />
        </svg>
      );
    case "x":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.9 2.5h3.2l-7 8 8.2 11h-6.4l-5-6.6-5.8 6.6H2l7.5-8.5-7.9-10.5h6.6l4.6 6.1 5.1-6.1Zm-1.1 17.2h1.8L7.3 4.2H5.4l12.4 15.5Z" />
        </svg>
      );
  }
};

export default AuthForm;
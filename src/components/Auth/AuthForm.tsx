import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { authService } from "../../services/authService";
import "../../css/authForm.css";
import logo from "../../assets/logo.svg";
import googleLogo from "../../assets/auth/google.png"

type FormState = {
  identifier: string;
  email: string;
  password: string;
  country: string;
};

const AuthForm: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    identifier: "",
    email: "",
    password: "",
    country: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isLogin) {
        const data = await authService.login({
          Identifier: form.identifier,
          Password: form.password,
        });

        localStorage.setItem("accessToken", data.accessToken);
        login(data.accessToken, form.identifier);
        navigate("/");
      } else {
        await authService.register({
          UserName: form.identifier,
          Email: form.email,
          Password: form.password,
          Country: form.country,
        });

        alert("Registration successful! Please login.");
        setForm(prev => ({ ...prev, email: "", country: "" }));
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === "Failed to fetch") {
        setErrorMessage("Cannot connect to the server");
      } else {
        setErrorMessage(err.message || "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-area">
        <Link to='/' className="auth-logo-wrapper">
          <img src={logo} alt="Website Logo" className="auth-logo" />
        </Link>
        <div className="auth-form-method-buttons">
          <button onClick={() => setIsLogin(true)} style={isLogin ? {color: "white"} : {}}>Log In</button>
          <button onClick={() => setIsLogin(false)} style={!isLogin ? {color: "white"} : {}}>Register</button>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">

          <div className="auth-form-group">
            <label>
              {isLogin ? "Username or Email" : "Username"}
            </label>
            <input
              type="text"
              name="identifier"
              placeholder={isLogin ? "Username or Email" : "Username"}
              value={form.identifier}
              onChange={handleChange}
              required/>
          </div>

          {!isLogin && (
            <div className="auth-form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required/>
            </div>
          )}

          <div className="auth-form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required/>
          </div>

          {!isLogin && (
            <div className="auth-form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
                required/>
            </div>
          )}

          {isLogin && (
            <Link to='/' className="forgot-password">Forgot password?</Link>
          )}

          <button type="submit" className={`auth-button ${isLoading ? "disabled" : ""}`} disabled={isLoading}>
            {isLoading ? "Loading..." : isLogin ? "Log In" : "Register"}
          </button>

          {errorMessage && (
            <div className="auth-error">
              {errorMessage}
            </div>
          )}

          <div className="auth-method-divider">
            <hr />
            <p>Or</p>
            <hr />
          </div>

          <button type="button" className="another-auth-method-button">
            <div>
              <img src={googleLogo} alt="" />
              <p>Continue with Google</p>
            </div>
          </button>

        </form>
      </div>

      <div className="auth-form-image"></div>
    </div>
  );
};

export default AuthForm;
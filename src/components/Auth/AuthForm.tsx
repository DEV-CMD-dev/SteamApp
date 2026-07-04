import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import "../../css/authForm.css";

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

  const handleSwitchMode = () => {
    setIsLogin(prev => !prev);
    setErrorMessage(null);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isLogin) {
        const res = await fetch(`http://localhost:5215/api/Auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            Identifier: form.identifier, 
            Password: form.password 
          }),
        });
        
        const contentType = res.headers.get("content-type");
        const data = contentType && contentType.includes("application/json") ? await res.json() : null;

        // Login error handler
        if (!res.ok) {
          setErrorMessage(data?.detail || data?.message || "Login failed. Please check your credentials.");
          return;
        }

        localStorage.setItem("accessToken", data.accessToken);
        login(data.accessToken, form.identifier);
        navigate("/");
      } else {
        const res = await fetch(`http://localhost:5215/api/Auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserName: form.identifier,
            Email: form.email,
            Password: form.password,
            Country: form.country,
          }),
        });

        const contentType = res.headers.get("content-type");
        const data = contentType && contentType.includes("application/json") ? await res.json() : null;

        //Register error handler
        if (!res.ok) {
          if (data?.errors) {
            const parsedErrors = Object.values(data.errors).flat().join(". ");
            setErrorMessage(parsedErrors);
          } else {
            setErrorMessage(data?.detail || data?.message || "Registration failed. Try again.");
          }
          return;
        }

        alert("Registration successful! Please login.");
        setForm(prev => ({ ...prev, email: "", country: "" }));
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
    <div className="auth-wrapper">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        <input
          type="text"
          name="identifier"
          placeholder={isLogin ? "Username or Email" : "Username"}
          value={form.identifier}
          onChange={handleChange}
          required
        />

        {!isLogin && (
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {!isLogin && (
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            required
          />
        )}

        <button type="submit" className={isLoading ? "disabled" : ""} disabled={isLoading}>
          {isLoading ? "Loading..." : isLogin ? "Login" : "Register"}
        </button>

        {errorMessage && (
          <div className="auth-error" style={{ color: "red", fontSize: "14px", textAlign: "center" }}>
            {errorMessage}
          </div>
        )}

        <p className="auth-switch">
          {isLogin ? "No account? " : "Already have an account? "}
          <span onClick={handleSwitchMode} className="auth-link">
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;

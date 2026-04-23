import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">🔐</div>
            <h1>Welcome Back</h1>
            <p>Sign in to manage your grievances</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} id="login-form">
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError(); }}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError(); }}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              id="login-btn"
            >
              {loading ? <span className="spinner"></span> : "Sign In"}
            </button>
          </form>

          <div className="auth-footer">
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

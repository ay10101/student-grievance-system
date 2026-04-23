import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">🎓</div>
            <h1>Create Account</h1>
            <p>Register to submit and track your grievances</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} id="register-form">
            <div className="form-group">
              <label htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                type="text"
                className="form-input"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => { setName(e.target.value); clearError(); }}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); clearError(); }}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                type="password"
                className="form-input"
                placeholder="Create a password (min 6 chars)"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError(); }}
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              id="register-btn"
            >
              {loading ? <span className="spinner"></span> : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

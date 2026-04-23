import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">📋</div>
        <span className="navbar-title">Grievance Portal</span>
      </div>
      <div className="navbar-user">
        <span className="navbar-user-name">
          Welcome, <strong>{user?.name}</strong>
        </span>
        <button
          className="btn btn-secondary btn-sm"
          onClick={logout}
          id="logout-btn"
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

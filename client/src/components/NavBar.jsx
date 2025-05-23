import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/Navbar.css";

function NavBar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">COMPANION</Link>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>

      <div className={`navbar-right ${menuOpen ? "open" : ""}`}>
        {isAuthenticated ? (
          <>
            <Link to="/" className="nav-item" onClick={toggleMenu}>Home</Link>
            <Link to="/interview" className="nav-item" onClick={toggleMenu}>Interview</Link>
            <Link to="/dashboardqna" className="nav-item" onClick={toggleMenu}>Dashboard</Link>
            <button onClick={() => { handleLogout(); toggleMenu(); }} className="nav-item nav-button">Logout</button>
            <div className="nav-avatar">👤 You</div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item" onClick={toggleMenu}>Login</Link>
            <Link to="/signup" className="nav-item" onClick={toggleMenu}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;

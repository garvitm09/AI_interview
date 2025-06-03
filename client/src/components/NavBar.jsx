import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../css/Navbar.css";

function NavBar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const loggedInUser = localStorage.getItem("loggedInUser");


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

            <div className="nav-avatar-container" ref={dropdownRef}>
              <div className="nav-avatar" onClick={toggleDropdown}>
                👤 {loggedInUser?.split(" ")[0] || "User"} ▼
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-item">{loggedInUser?.name}</div>
                  <hr style={{ margin: '4px 0', borderColor: '#444' }} />
                  <button onClick={handleLogout} className="dropdown-item">Logout</button>
                </div>
              )}
            </div>
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

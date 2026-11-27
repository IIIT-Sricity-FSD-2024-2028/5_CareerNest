// Data Flow (public-pages/landing/components/Navbar.jsx):
// Backend API -> Redux Thunks/Slices (publicSlice) -> useSelector(selectNavScrolled, selectTheme) -> UI render
// User Actions -> dispatch(slice actions) -> Slice reducers/thunks -> Redux state update
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import {
  selectNavScrolled,
  selectTheme,
  setNavScrolled,
  toggleTheme,
} from "../../store/publicSlice.js";

function Navbar() {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const scrolled = useSelector(selectNavScrolled);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      dispatch(setNavScrolled(window.scrollY > 30));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch]);

  const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`} id="navbar">
      <div className="nav-inner">
        <a
          href="#hero"
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("hero");
          }}
        >
          <span className="logo-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
              <line x1="16" y1="8" x2="2" y2="22" />
              <line x1="17.5" y1="15" x2="9" y2="15" />
            </svg>
          </span>
          <span className="logo-text">CareerNest</span>
        </a>

        <ul className="nav-links" id="nav-links">
          <li>
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("hero");
              }}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#roles"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("roles");
              }}
            >
              Roles
            </a>
          </li>
          <li>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("features");
              }}
            >
              Features
            </a>
          </li>
          <li>
            <a
              href="#process"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("process");
              }}
            >
              How It Works
            </a>
          </li>
          <li>
            <a
              href="#faq"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("faq");
              }}
            >
              FAQ
            </a>
          </li>
          <li>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
            >
              Contact
            </a>
          </li>
        </ul>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            id="theme-toggle"
            onClick={() => dispatch(toggleTheme())}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span className="theme-icon" id="theme-icon">
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
          </button>

          <button
            className="login-btn"
            id="login-btn"
            onClick={() => navigate("/login")}
          >
            <span>Login</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

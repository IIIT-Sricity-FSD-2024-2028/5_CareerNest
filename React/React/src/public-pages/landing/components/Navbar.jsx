import { useBrowserCommands } from '../../../store/useBrowserCommands.js';
import { ReduxAnchor } from '../../../shared/components/ReduxLink.jsx';
import { useReduxNavigate } from '../../../store/useBrowserCommands.js';
import { useViewState } from '../../../store/useViewState.js';
import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [{ scrolled }, { setScrolled }] = useViewState('publicPages', 'Navbar', () => ({
    scrolled: false,
  }));
  const navigate = useReduxNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { scrollTo: scrollToSection } = useBrowserCommands();

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`} id="navbar">
      <div className="nav-inner">
        <ReduxAnchor
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
        </ReduxAnchor>

        <ul className="nav-links" id="nav-links">
          <li>
            <ReduxAnchor
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("hero");
              }}
            >
              Home
            </ReduxAnchor>
          </li>
          <li>
            <ReduxAnchor
              href="#roles"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("roles");
              }}
            >
              Roles
            </ReduxAnchor>
          </li>
          <li>
            <ReduxAnchor
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("features");
              }}
            >
              Features
            </ReduxAnchor>
          </li>
          <li>
            <ReduxAnchor
              href="#process"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("process");
              }}
            >
              How It Works
            </ReduxAnchor>
          </li>
          <li>
            <ReduxAnchor
              href="#faq"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("faq");
              }}
            >
              FAQ
            </ReduxAnchor>
          </li>
          <li>
            <ReduxAnchor
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
              }}
            >
              Contact
            </ReduxAnchor>
          </li>
        </ul>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            id="theme-toggle"
            onClick={toggleTheme}
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

import { useBrowserCommands } from '../../../store/useBrowserCommands.js';
import { ReduxAnchor } from '../../../shared/components/ReduxLink.jsx';
import { useViewState } from '../../../store/useViewState.js';
import { infoDialog } from '../../../shared/components/AppDialog.jsx';

function Footer() {
  const [{ email, subscribed }, { setEmail, setSubscribed }] = useViewState('publicPages', 'Footer', () => ({
    email: "",
    subscribed: false,
  }));

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    } else {
      infoDialog("Please enter a valid email address.");
    }
  };

  const { scrollTo } = useBrowserCommands();

  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-container">
          {/* Brand */}
          <div className="footer-brand">
            <ReduxAnchor
              href="#hero"
              className="logo"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("hero");
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

            <p>
              Transforming campus placements with intelligent automation and transparency.
              Empowering students, recruiters, alumni, and institutions.
            </p>

            <div className="footer-contact">
              <div>
                <span className="contact-icon">✉️</span> hello@careernest.com
              </div>
              <div>
                <span className="contact-icon">📞</span> 1234567890
              </div>
              <div>
                <span className="contact-icon">📍</span> Hyderabad, India
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="footer-links-group">
            <div className="footer-col">
              <h4>Product</h4>
              <ReduxAnchor
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("features");
                }}
              >
                Features
              </ReduxAnchor>
              <ReduxAnchor
                href="#process"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("process");
                }}
              >
                How It Works
              </ReduxAnchor>
              <ReduxAnchor
                href="#roles"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("roles");
                }}
              >
                Stakeholder Roles
              </ReduxAnchor>
              <ReduxAnchor
                href="#faq"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("faq");
                }}
              >
                FAQ
              </ReduxAnchor>
            </div>

            <div className="footer-col">
              <h4>Company</h4>
              <ReduxAnchor href="#hero">About Us</ReduxAnchor>
              <ReduxAnchor href="#hero">Careers</ReduxAnchor>
              <ReduxAnchor href="#hero">Blog</ReduxAnchor>
              <ReduxAnchor href="#hero">Press</ReduxAnchor>
            </div>

            <div className="footer-col">
              <h4>Support</h4>
              <ReduxAnchor href="#faq">Help Center</ReduxAnchor>
              <ReduxAnchor href="#faq">Documentation</ReduxAnchor>
              <ReduxAnchor href="#footer">Privacy Policy</ReduxAnchor>
              <ReduxAnchor href="#footer">Terms of Service</ReduxAnchor>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Get the latest updates on placement trends and platform features.</p>
            <form className="subscribe-box" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                required
              />
              <button type="submit" aria-label="Subscribe">
                ➤
              </button>
            </form>
            {subscribed && (
              <p style={{ color: "#38bdf8", marginTop: "8px", fontSize: "13px" }}>
                ✓ Subscribed! You will receive portal updates from CareerNest.
              </p>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 CareerNest. All rights reserved.</p>
          <div className="socials">
            <ReduxAnchor href="#" aria-label="LinkedIn">
              in
            </ReduxAnchor>
            <ReduxAnchor href="#" aria-label="Twitter">
              𝕏
            </ReduxAnchor>
            <ReduxAnchor href="#" aria-label="Facebook">
              f
            </ReduxAnchor>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
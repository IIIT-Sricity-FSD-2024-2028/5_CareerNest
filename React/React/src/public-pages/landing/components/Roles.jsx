// Data Flow (public-pages/landing/components/Roles.jsx):
// Backend API -> Redux Thunks/Slices (publicSlice) -> useSelector(selectLandingContent) -> UI render
// User Actions -> dispatch(slice actions) -> Slice reducers/thunks -> Redux state update
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectLandingContent } from '../../store/publicSlice.js';

function Roles() {
  const { roles } = useSelector(selectLandingContent);
  return (
    <section className="roles" id="roles">
      <div className="container">
        <div className="section-header">
          <span className="tag">GET STARTED</span>
          <h2>Select Your Role to Continue</h2>
          <p className="section-subtitle">
            Choose the role that best describes you and get a personalised experience tailored to your needs.
          </p>
        </div>

        <div className="role-container">
          {roles.map((role) => (
            <div
              className="role-card"
              data-role={role.role}
              key={role.role}
            >
              <div
                className={`role-icon-wrap ${role.gradientClass || ""}`}
                style={
                  role.customGradient
                    ? { background: role.customGradient }
                    : undefined
                }
              >
                {role.icon}
              </div>

              <h3>{role.title}</h3>
              <p>{role.description}</p>

              <Link
                to={`/login?role=${role.role}`}
                className="role-link"
              >
                <span>Enter as {role.title}</span>
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
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Roles;
// Data Flow (public-pages/landing/components/Features.jsx):
// Backend API -> Redux Thunks/Slices (publicSlice) -> useSelector(selectActiveFeatureRole, selectFeatureRole, selectLandingContent) -> UI render
// User Actions -> dispatch(slice actions) -> Slice reducers/thunks -> Redux state update
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveFeatureRole,
  selectFeatureRole,
  selectLandingContent,
} from '../../store/publicSlice.js';

function Features() {
  const dispatch = useDispatch();
  // Redux data source: publicSlice (featureData per role + selected feature tab).
  const { featureData, featureRoles: roles } = useSelector(selectLandingContent);
  const activeRole = useSelector(selectActiveFeatureRole);

  const selected = featureData[activeRole];

  return (
    <section
      className="features"
      id="features"
    >
      <div className="container">

        <div className="section-header">

          <span className="tag">
            FEATURES
          </span>

          <h2>
            Powerful Features for
            <br />
            Every Stakeholder
          </h2>

          <p className="section-subtitle">
            Designed to meet the unique needs of
            candidates, recruiters, alumni, and
            placement officers.
          </p>

        </div>

        <div className="tabs">

          {roles.map((role) => (
            <button
              key={role.id}
              className={`tab ${
                activeRole === role.id
                  ? "active"
                  : ""
              }`}
              onClick={() => dispatch(selectFeatureRole(role.id))}
            >
              <span className="tab-icon">
                {role.icon}
              </span>

              <span>
                {role.label}
              </span>
            </button>
          ))}

        </div>

        <div className="feature-box">

          <div className="feature-box-header">

            <div
              className="feature-box-icon"
              style={{
                background: selected.gradient,
              }}
            >
              {selected.icon}
            </div>

            <h3>
              {selected.title}
            </h3>

          </div>

          <div className="feature-list">

            {selected.features.map(
              (feature) => (
                <div
                  className="feature-item"
                  key={feature}
                >
                  <div
                    className="feature-check"
                    style={{
                      background:
                        selected.gradient,
                    }}
                  >
                    ✓
                  </div>

                  <p>
                    {feature}
                  </p>
                </div>
              )
            )}

          </div>

        </div>

      </div>
    </section>
  );
}

export default Features;
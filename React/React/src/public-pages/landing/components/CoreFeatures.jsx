import { useSelector } from 'react-redux';
import { selectLandingContent } from '../../../store/publicSlice.js';
function CoreFeatures() {
  const { coreFeatures: features } = useSelector(selectLandingContent);
  return (
    <section
      className="core-features"
      id="core-features"
    >
      <div className="container">

        <div className="section-header">
          <span className="tag-pill">
            ⭐ CORE FEATURES
          </span>

          <h2>
            Everything You Need for
            <br />

            <span className="gradient-text">
              Seamless Placements
            </span>
          </h2>

          <p className="section-subtitle">
            A comprehensive platform designed to
            model real-world placement workflows
            with transparency and efficiency.
          </p>
        </div>

        <div className="core-grid">

          {features.map((feature) => (
            <div
              className="core-card"
              key={feature.title}
            >
              <div
                className="core-icon"
                style={{
                  background: feature.gradient,
                }}
              >
                {feature.icon}
              </div>

              <h3>
                {feature.title}
              </h3>

              <p>
                {feature.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default CoreFeatures;
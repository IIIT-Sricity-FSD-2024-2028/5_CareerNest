// Data Flow (public-pages/landing/components/Problem.jsx):
// Backend API -> Redux Thunks/Slices (publicSlice) -> useSelector(selectLandingContent) -> UI render
// User Actions -> dispatch(slice actions) -> Slice reducers/thunks -> Redux state update
import { useSelector } from 'react-redux';
import { selectLandingContent } from '../../store/publicSlice.js';

function Problem() {
  const { problems } = useSelector(selectLandingContent);
  return (
    <section className="problem" id="problem">
      <div className="container">

        <div className="section-header">
          <span className="tag">
            THE PROBLEM
          </span>

          <h2>
            Why Traditional Placement
            <br />
            Systems Fall Short
          </h2>

          <p className="section-subtitle">
            Campus placements rely on emails,
            spreadsheets, and manual coordination —
            creating chaos for everyone involved.
          </p>
        </div>

        <div className="problem-grid">

          {problems.map((problem) => (
            <div
              className="problem-card"
              key={problem.title}
            >
              <div className="problem-icon">
                {problem.icon}
              </div>

              <h3>
                {problem.title}
              </h3>

              <p>
                {problem.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Problem;
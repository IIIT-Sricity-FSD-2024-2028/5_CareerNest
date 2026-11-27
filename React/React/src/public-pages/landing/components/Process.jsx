// Data Flow (public-pages/landing/components/Process.jsx):
// Backend API -> Redux Thunks/Slices (publicSlice) -> useSelector(selectLandingContent) -> UI render
// User Actions -> dispatch(slice actions) -> Slice reducers/thunks -> Redux state update
import { useSelector } from 'react-redux';
import { selectLandingContent } from '../../store/publicSlice.js';

function Process() {
  const { processSteps } = useSelector(selectLandingContent);
  return (
    <section className="process" id="process">
      <div className="container">

        <div className="section-header">
          <span className="tag">
            PROCESS
          </span>

          <h2>
            How CareerNest Works
          </h2>

          <p className="section-subtitle">
            A streamlined four-step journey from
            opportunity submission to successful
            placement.
          </p>
        </div>

        <div className="process-timeline">

          <div className="timeline-line" />

          {processSteps.map((step) => (
            <div
              className="process-card"
              key={step.number}
            >
              <div className="process-number">
                {step.number}
              </div>

              <div className="process-content">

                <div className="process-icon">
                  {step.icon}
                </div>

                <h3>
                  {step.title}
                </h3>

                <p>
                  {step.description}
                </p>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Process;
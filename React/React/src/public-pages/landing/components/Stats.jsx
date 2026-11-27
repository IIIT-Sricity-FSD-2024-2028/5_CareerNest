// Data Flow (public-pages/landing/components/Stats.jsx):
// Backend API -> Redux Thunks/Slices (publicSlice) -> useSelector(selectLandingContent, selectStatsStarted, selectStatsValues) -> UI render
// User Actions -> dispatch(slice actions) -> Slice reducers/thunks -> Redux state update
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLandingContent,
  selectStatsStarted,
  selectStatsValues,
  setStatsValues,
  startStatsAnimation,
} from "../../store/publicSlice.js";

function Stats() {
  const dispatch = useDispatch();
  const { stats } = useSelector(selectLandingContent);
  const started = useSelector(selectStatsStarted);
  const values = useSelector(selectStatsValues);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          dispatch(startStatsAnimation());
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [dispatch]);

  useEffect(() => {
    if (!started) return;

    const duration = 2000;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      dispatch(setStatsValues(stats.map((stat) => Math.round(stat.target * eased))));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [dispatch, started, stats]);

  return (
    <section className="stats" id="stats" ref={sectionRef}>
      <div className="stats-inner">
        {stats.map((stat, index) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value-wrap">
              <span className="stat-number">
                {values[index].toLocaleString()}
              </span>
              <span className="stat-suffix">{stat.suffix}</span>
            </div>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;
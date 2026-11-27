// Data Flow (public-pages/landing/components/Hero.jsx):
// Backend API -> Redux Thunks/Slices (publicSlice) -> useSelector(selectHeroImageIndex, selectLandingContent) -> UI render
// User Actions -> dispatch(slice actions) -> Slice reducers/thunks -> Redux state update
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  advanceHeroImage,
  selectHeroImageIndex,
  selectLandingContent,
} from "../../store/publicSlice.js";

function Hero() {
  const dispatch = useDispatch();
  // Redux data source: publicSlice (heroImages, stats, and active hero slide index).
  const { heroImages, stats } = useSelector(selectLandingContent);
  const currentImage = useSelector(selectHeroImageIndex);
  const collegeCount = stats.find((stat) => stat.label === 'Colleges');

  useEffect(() => {
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const interval = setInterval(() => {
      dispatch(advanceHeroImage());
    }, 5000);

    return () => clearInterval(interval);
  }, [dispatch, heroImages]);

  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, index) => ({
      id: index,
      left: `${(index * 37) % 100}%`,
      top: `${(index * 29) % 100}%`,
      size: `${(index % 4) + 2}px`,
      delay: `${(index % 6) * 0.8}s`,
      duration: `${4 + (index % 4)}s`,
      opacity: 0.15 + (index % 5) * 0.08,
    }));
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="hero" id="hero">
      <div
        className="hero-bg-slider"
        id="hero-bg-slider"
        style={{
          backgroundImage: `url(${heroImages[currentImage]})`,
        }}
      />

      <div className="hero-overlay" />

      <div className="particles" id="particles">
        {particles.map((p) => (
          <div
            className="particle"
            key={p.id}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <span>🎓</span>
          <span>Trusted by {collegeCount.target}{collegeCount.suffix} Colleges Nationwide</span>
        </div>

        <h1>
          <span className="hero-line">Empowering</span>
          <span className="hero-line gradient-text">Campus Placements</span>
          <span className="hero-line">with Transparency</span>
        </h1>

        <p className="hero-subtitle">
          A centralized, structured platform connecting students, recruiters, alumni, 
          and placement officers — replacing spreadsheets and emails with clarity.
        </p>

        <div className="hero-cta">
          <button
            className="btn-primary"
            onClick={() => scrollTo("roles")}
          >
            <span>Explore Roles</span>
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

          <button
            className="btn-outline"
            onClick={() => scrollTo("process")}
          >
            <span>How It Works</span>
          </button>
        </div>
      </div>

      <div
        className="hero-scroll-indicator"
        onClick={() => scrollTo("stats")}
        style={{ cursor: "pointer" }}
      >
        <div className="mouse">
          <div className="mouse-wheel" />
        </div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
}

export default Hero;

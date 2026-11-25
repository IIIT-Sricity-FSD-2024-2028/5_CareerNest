import { useSelector } from 'react-redux';
import { selectLandingContent } from '../../../store/publicSlice.js';
function Testimonials() {
  const { testimonials } = useSelector(selectLandingContent);
  return (
    <section
      className="testimonials"
      id="testimonials"
    >
      <div className="container">

        <div className="section-header">

          <span className="tag">
            TESTIMONIALS
          </span>

          <h2>
            Loved by Thousands
          </h2>

          <p className="section-subtitle">
            Hear from the people who use CareerNest
            every day.
          </p>

        </div>

        <div className="testimonial-grid">

          {testimonials.map((testimonial) => (
            <div
              className={`testimonial-card ${
                testimonial.featured
                  ? "featured"
                  : ""
              }`}
              key={testimonial.name}
            >

              <div className="testimonial-rating">
                {testimonial.rating}
              </div>

                <p className="testimonial-text">
                  {testimonial.text}
                </p>

              <div className="testimonial-profile">

                <div
                  className="avatar"
                  style={{
                    background:
                      testimonial.gradient,
                  }}
                >
                  {testimonial.initials}
                </div>

                <div>
                  <h4>
                    {testimonial.name}
                  </h4>

                  <span>
                    {testimonial.role}
                  </span>
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Testimonials;
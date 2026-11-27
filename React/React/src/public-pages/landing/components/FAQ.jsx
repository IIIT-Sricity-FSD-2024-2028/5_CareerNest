// Data Flow (public-pages/landing/components/FAQ.jsx):
// Backend API -> Redux Thunks/Slices (publicSlice) -> useSelector(selectActiveFaqIndex, selectLandingContent) -> UI render
// User Actions -> dispatch(slice actions) -> Slice reducers/thunks -> Redux state update
import { useDispatch, useSelector } from 'react-redux';
import {
  selectActiveFaqIndex,
  selectLandingContent,
  toggleFaqItem,
} from '../../store/publicSlice.js';

function FAQ() {
  const dispatch = useDispatch();
  const { faqs } = useSelector(selectLandingContent);
  const activeIndex = useSelector(selectActiveFaqIndex);

  return (
    <section className="faq" id="faq">
      <div className="container">

        <div className="section-header">

          <span className="tag-pill">
            ❓ FAQ
          </span>

          <h2>
            Frequently Asked
            <br />

            <span className="gradient-text">
              Questions
            </span>
          </h2>

        </div>

        <div className="faq-list">

          {faqs.map((faq, index) => {
            const active =
              activeIndex === index;

            return (
              <div
                className={`faq-item ${
                  active ? "active" : ""
                }`}
                key={faq.question}
              >

                <button
                  className="faq-question"
                  onClick={() => dispatch(toggleFaqItem(index))}
                  aria-expanded={active}
                >
                  <span>
                    {faq.question}
                  </span>

                  <svg
                    className="faq-chevron"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <div className="faq-answer">
                  <p>
                    {Array.isArray(faq.answer)
                      ? faq.answer.map(({ text, bold }) => bold ? <strong key={text}>{text}</strong> : text)
                      : faq.answer}
                  </p>
                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default FAQ;
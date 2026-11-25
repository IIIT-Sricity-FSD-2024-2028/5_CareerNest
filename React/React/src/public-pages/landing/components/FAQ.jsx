import { useSelector } from 'react-redux';
import { selectLandingContent } from '../../../store/publicSlice.js';
import { useViewState } from '../../../store/useViewState.js';

function FAQ() {
  const { faqs } = useSelector(selectLandingContent);
  const [{ activeIndex }, { setActiveIndex }] = useViewState('publicPages', 'FAQ', () => ({
    activeIndex: null,
  }));

  const toggleFAQ = (index) => {
    setActiveIndex(
      activeIndex === index ? null : index
    );
  };

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
                  onClick={() =>
                    toggleFAQ(index)
                  }
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
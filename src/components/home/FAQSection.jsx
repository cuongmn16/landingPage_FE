import React, { useState } from 'react';
import { FAQ } from '../../data/appData';

export default function FAQSection() {
  const [openIndices, setOpenIndices] = useState({});

  const toggleFAQ = (index) => {
    setOpenIndices(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section className="section" id="faq">
      <div className="container">
        <p className="section__label mono reveal is-visible">FAQ — HỖ TRỢ</p>
        <h2 className="section__title reveal is-visible">Câu hỏi thường gặp</h2>
        <div className="faq">
          {FAQ.map((f, i) => {
            const isOpen = !!openIndices[i];
            return (
              <div key={i} className={`faq__item reveal is-visible ${isOpen ? 'is-open' : ''}`}>
                <button
                  className="faq__question"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => toggleFAQ(i)}
                >
                  <span>{f.q}</span>
                  <span className="faq__icon"></span>
                </button>
                <div className="faq__answer" id={`faq-${i}`}>
                  <p>{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

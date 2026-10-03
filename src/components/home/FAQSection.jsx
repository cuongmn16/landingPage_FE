import React, { useState } from 'react';
import { FAQ } from '../../data/appData';

export default function FAQSection() {
  const [openIndices, setOpenIndices] = useState({});

  const toggleFAQ = (index) => {
    setOpenIndices(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section class="section" id="faq">
      <div class="container">
        <p class="section__label mono reveal is-visible">FAQ — HỖ TRỢ</p>
        <h2 class="section__title reveal is-visible">Câu hỏi thường gặp</h2>
        <div class="faq">
          {FAQ.map((f, i) => {
            const isOpen = !!openIndices[i];
            return (
              <div key={i} class={`faq__item reveal is-visible ${isOpen ? 'is-open' : ''}`}>
                <button
                  class="faq__question"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => toggleFAQ(i)}
                >
                  <span>{f.q}</span>
                  <span class="faq__icon"></span>
                </button>
                <div class="faq__answer" id={`faq-${i}`}>
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

import React from 'react';
import { STORY } from '../../data/appData';

export default function StorySection() {
  return (
    <section className="section section--light" id="story">
      <div className="container">
        <p className="section__label mono reveal is-visible">ARCHIVE No. 000 — CÂU CHUYỆN</p>
        <h2 className="section__title reveal is-visible">Câu chuyện 25 năm</h2>
        <div className="story__grid">
          <div className="story__text reveal is-visible">
            <p>{STORY.paragraph}</p>
            <p className="story__note">{STORY.note}</p>
          </div>
          <div className="story__cards">
            {STORY.cards.map((c, i) => (
              <div key={i} className="story__card reveal is-visible">
                <h3 className="story__card-title">{c.title}</h3>
                <p className="story__card-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

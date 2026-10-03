import React from 'react';
import { STORY } from '../../data/appData';

export default function StorySection() {
  return (
    <section class="section section--light" id="story">
      <div class="container">
        <p class="section__label mono reveal is-visible">ARCHIVE No. 000 — CÂU CHUYỆN</p>
        <h2 class="section__title reveal is-visible">Câu chuyện 25 năm</h2>
        <div class="story__grid">
          <div class="story__text reveal is-visible">
            <p>{STORY.paragraph}</p>
            <p class="story__note">{STORY.note}</p>
          </div>
          <div class="story__cards">
            {STORY.cards.map((c, i) => (
              <div key={i} class="story__card reveal is-visible">
                <h3 class="story__card-title">{c.title}</h3>
                <p class="story__card-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

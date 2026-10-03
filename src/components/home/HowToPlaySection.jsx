import React from 'react';
import { HOW_TO_PLAY } from '../../data/appData';

export default function HowToPlaySection() {
  return (
    <section class="section" id="how-to-play">
      <div class="container">
        <p class="section__label mono reveal is-visible">PROTOCOL — CÁCH CHƠI</p>
        <h2 class="section__title reveal is-visible">Cách chơi</h2>
        <div class="htp__intro reveal is-visible">
          <h3>{HOW_TO_PLAY.intro.title}</h3>
          {HOW_TO_PLAY.intro.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <h3 class="htp__subtitle reveal is-visible">Chu trình mỗi Mission</h3>
        <div class="stepper">
          {HOW_TO_PLAY.steps.map((s, i) => (
            <div key={i} class="step reveal is-visible">
              <span class="step__num">BƯỚC {s.num}</span>
              <h4 class="step__title">{s.title}</h4>
              <p class="step__desc">{s.desc}</p>
            </div>
          ))}
        </div>
        <div class="fairplay__grid">
          {HOW_TO_PLAY.fairplay.map((f, i) => (
            <div key={i} class="fairplay__card reveal is-visible">
              <h4 class="fairplay__title">{f.title}</h4>
              <p class="fairplay__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

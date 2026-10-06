import React from 'react';
import { HOW_TO_PLAY } from '../../data/appData';

export default function HowToPlaySection() {
  return (
    <section className="section" id="how-to-play">
      <div className="container">
        <p className="section__label mono reveal is-visible">PROTOCOL — CÁCH CHƠI</p>
        <h2 className="section__title reveal is-visible">Cách chơi</h2>
        <div className="htp__intro reveal is-visible">
          <h3>{HOW_TO_PLAY.intro.title}</h3>
          {HOW_TO_PLAY.intro.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <h3 className="htp__subtitle reveal is-visible">Chu trình mỗi Mission</h3>
        <div className="stepper">
          {HOW_TO_PLAY.steps.map((s, i) => (
            <div key={i} className="step reveal is-visible">
              <span className="step__num">BƯỚC {s.num}</span>
              <h4 className="step__title">{s.title}</h4>
              <p className="step__desc">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="fairplay__grid">
          {HOW_TO_PLAY.fairplay.map((f, i) => (
            <div key={i} className="fairplay__card reveal is-visible">
              <h4 className="fairplay__title">{f.title}</h4>
              <p className="fairplay__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

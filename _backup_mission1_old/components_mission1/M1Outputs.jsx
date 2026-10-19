import React from 'react';
import { M1_CONFIG } from '../../data/mission1Data';

export default function M1Outputs() {
  return (
    <section className="m1-section" id="m1-outputs">
      <div className="container">
        <p className="m1-section__label mono">SECTION 05 — SẢN PHẨM</p>
        <h2 className="m1-section__title">Hai sản phẩm cần nộp</h2>

        <div className="m1-outputs">
          {M1_CONFIG.outputs.map((out) => (
            <article key={out.code} className="m1-output-card">
              <span className="m1-output-card__code">SẢN PHẨM {out.code}</span>
              <h3 className="m1-output-card__name">{out.name}</h3>
              <p className="m1-output-card__req">{out.requirement}</p>
              <span className="m1-output-card__fmt">{out.format}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

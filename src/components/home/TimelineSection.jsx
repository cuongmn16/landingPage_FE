import React from 'react';
import { TIMELINE, fmtDate } from '../../data/appData';

export default function TimelineSection() {
  return (
    <section class="section section--light" id="timeline">
      <div class="container">
        <p class="section__label mono reveal is-visible">CHRONOLOGY — TIMELINE</p>
        <h2 class="section__title reveal is-visible">Timeline chương trình</h2>
        <div class="timeline" id="timelineList">
          {TIMELINE.map((t, i) => (
            <div key={i} class="tl-item reveal is-visible">
              <p class="tl-item__date">
                {t.endDate ? `${fmtDate(t.date)} – ${fmtDate(t.endDate)}` : fmtDate(t.date)}
              </p>
              <h3 class="tl-item__title">{t.title}</h3>
              <p class="tl-item__desc">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { TIMELINE, fmtDate } from '../../data/appData';

export default function TimelineSection() {
  return (
    <section className="section section--light" id="timeline">
      <div className="container">
        <p className="section__label mono reveal is-visible">CHRONOLOGY — TIMELINE</p>
        <h2 className="section__title reveal is-visible">Timeline chương trình</h2>
        <div className="timeline" id="timelineList">
          {TIMELINE.map((t, i) => (
            <div key={i} className="tl-item reveal is-visible">
              <p className="tl-item__date">
                {t.endDate ? `${fmtDate(t.date)} – ${fmtDate(t.endDate)}` : fmtDate(t.date)}
              </p>
              <h3 className="tl-item__title">{t.title}</h3>
              <p className="tl-item__desc">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { TIMELINE, fmtDate } from '../../data/appData';

export default function TimelineSection() {
  return (
    <section className="section section--light" id="timeline">
      <div className="container">
        <p className="section__label mono reveal is-visible">CHRONOLOGY — TIMELINE</p>
        <h2 className="section__title reveal is-visible">Timeline chương trình</h2>

        <div
          className="reveal is-visible"
          style={{
            margin: '0 0 32px 0',
            padding: '14px 18px',
            background: 'var(--clr-orange-pale)',
            borderLeft: '4px solid var(--clr-orange)',
            borderRadius: '6px',
            color: 'var(--clr-ink)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            fontWeight: 600
          }}
        >
          💡 Cả 04 nhiệm vụ được mở ngay từ đầu. Bạn có thể tự do lựa chọn nhiệm vụ và thứ tự thực hiện trong thời gian từ ngày 06/11 đến hết ngày 15/11/2026.
        </div>

        <div className="timeline" id="timelineList">
          {TIMELINE.map((t, i) => (
            <div key={i} className="tl-item reveal is-visible">
              <p className="tl-item__date">
                {t.endDate ? `${fmtDate(t.date)} – ${fmtDate(t.endDate)}` : fmtDate(t.date)}
              </p>
              <h3 className="tl-item__title">{t.title}</h3>
              <p className="tl-item__desc" style={{ whiteSpace: 'pre-line', lineHeight: 1.65 }}>
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

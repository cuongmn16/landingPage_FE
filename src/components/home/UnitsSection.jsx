import React from 'react';
import { UNITS_SAMPLE } from '../../data/appData';

export default function UnitsSection() {
  return (
    <section className="section" id="progress">
      <div className="container">
        <p className="section__label mono reveal is-visible">UNITS — TIẾN ĐỘ ĐƠN VỊ</p>
        <h2 className="section__title reveal is-visible">Tiến độ đơn vị</h2>
        <p className="section__desc reveal is-visible">
          Tỷ lệ CBNV tham gia hợp lệ được cập nhật sau khi BTC xác minh.
        </p>
        <div className="hunters__grid">
          {UNITS_SAMPLE.map((u, i) => {
            const rate = ((u.valid / u.eligible) * 100).toFixed(2);
            return (
              <article key={i} className="hunter-card reveal is-visible">
                <div className="hunter-card__head">
                  <div className="hunter-card__avatar">{u.name.charAt(0)}</div>
                  <div>
                    <h3 className="hunter-card__name">{u.name}</h3>
                    <p className="hunter-card__unit">{u.eligible} nhân sự đủ điều kiện</p>
                  </div>
                </div>
                <div className="unit-progress">
                  <div className="unit-progress__bar">
                    <div className="unit-progress__fill" style={{ width: `${rate}%` }}></div>
                  </div>
                  <p className="unit-progress__rate">
                    <strong>{rate}%</strong> tham gia hợp lệ ({u.valid}/{u.eligible})
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

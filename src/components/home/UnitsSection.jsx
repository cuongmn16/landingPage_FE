import React from 'react';
import { UNITS_SAMPLE } from '../../data/appData';

export default function UnitsSection() {
  return (
    <section class="section" id="progress">
      <div class="container">
        <p class="section__label mono reveal is-visible">UNITS — TIẾN ĐỘ ĐƠN VỊ</p>
        <h2 class="section__title reveal is-visible">Tiến độ đơn vị</h2>
        <p class="section__desc reveal is-visible">
          Tỷ lệ CBNV tham gia hợp lệ được cập nhật sau khi BTC xác minh.
        </p>
        <div class="hunters__grid">
          {UNITS_SAMPLE.map((u, i) => {
            const rate = ((u.valid / u.eligible) * 100).toFixed(2);
            return (
              <article key={i} class="hunter-card reveal is-visible">
                <div class="hunter-card__head">
                  <div class="hunter-card__avatar">{u.name.charAt(0)}</div>
                  <div>
                    <h3 class="hunter-card__name">{u.name}</h3>
                    <p class="hunter-card__unit">{u.eligible} nhân sự đủ điều kiện</p>
                  </div>
                </div>
                <div class="unit-progress">
                  <div class="unit-progress__bar">
                    <div class="unit-progress__fill" style={{ width: `${rate}%` }}></div>
                  </div>
                  <p class="unit-progress__rate">
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

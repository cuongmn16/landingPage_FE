import React, { useState } from 'react';
import { PRIZES } from '../../data/appData';

export default function PrizesSection() {
  const [activeTab, setActiveTab] = useState('personal');

  const items = activeTab === 'personal' ? PRIZES.personal : activeTab === 'unit' ? PRIZES.unit : PRIZES.bonus;

  return (
    <section class="section" id="prizes">
      <div class="container">
        <p class="section__label mono reveal is-visible">REWARDS — GIẢI THƯỜNG</p>
        <h2 class="section__title reveal is-visible">Giải thưởng</h2>
        <div class="prizes__tabs reveal is-visible" role="tablist">
          <button
            class={`prizes__tab ${activeTab === 'personal' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Cá nhân
          </button>
          <button
            class={`prizes__tab ${activeTab === 'unit' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('unit')}
          >
            Đơn vị
          </button>
          <button
            class={`prizes__tab ${activeTab === 'bonus' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('bonus')}
          >
            Ghi nhận bổ sung
          </button>
        </div>

        <div class="prizes__panel">
          <div class="prizes__grid">
            {items.map((p, i) => (
              <article key={i} class="prize-card">
                <h3 class="prize-card__title">{p.rank}</h3>
                {p.desc && <p class="prize-card__desc">{p.desc}</p>}
              </article>
            ))}
          </div>
        </div>
        <p class="prizes__note">{PRIZES.note}</p>
      </div>
    </section>
  );
}

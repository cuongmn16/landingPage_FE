import React, { useState } from 'react';
import { PRIZES } from '../../data/appData';

export default function PrizesSection() {
  const [activeTab, setActiveTab] = useState('personal');

  const items = activeTab === 'personal' ? PRIZES.personal : activeTab === 'unit' ? PRIZES.unit : PRIZES.bonus;

  return (
    <section className="section" id="prizes">
      <div className="container">
        <p className="section__label mono reveal is-visible">REWARDS — GIẢI THƯỜNG</p>
        <h2 className="section__title reveal is-visible">Giải thưởng</h2>
        <div className="prizes__tabs reveal is-visible" role="tablist">
          <button
            className={`prizes__tab ${activeTab === 'personal' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Cá nhân
          </button>
          <button
            className={`prizes__tab ${activeTab === 'unit' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('unit')}
          >
            Đơn vị
          </button>
          <button
            className={`prizes__tab ${activeTab === 'bonus' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('bonus')}
          >
            Ghi nhận bổ sung
          </button>
        </div>

        <div className="prizes__panel">
          <div className="prizes__grid">
            {items.map((p, i) => (
              <article key={i} className="prize-card">
                <h3 className="prize-card__title">{p.rank}</h3>
                {p.desc && <p className="prize-card__desc">{p.desc}</p>}
              </article>
            ))}
          </div>
        </div>
        <p className="prizes__note">{PRIZES.note}</p>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { M1_GROUPS, M1_CARDS } from '../../data/mission1Data';

export default function M1ClueCards({ selectedCards, onToggleSelectCard, onViewCard }) {
  const [activeGroup, setActiveGroup] = useState('B');

  const filteredCards = M1_CARDS.filter(c => c.group === activeGroup);

  return (
    <section className="m1-section" id="m1-cards">
      <div className="container">
        <p className="m1-section__label mono">SECTION 03 — KHO MANH MỐI</p>
        <h2 className="m1-section__title">24 thẻ manh mối</h2>
        <p className="m1-section__desc">
          Chọn nhóm để duyệt. Nhấn "Mở hồ sơ" để xem đầy đủ nội dung thẻ, hoặc "Chọn ghép cụm" để tạo cụm.
        </p>

        <div className="m1-tabs" role="tablist">
          {M1_GROUPS.map((g) => {
            const count = M1_CARDS.filter(c => c.group === g.id).length;
            const isActive = activeGroup === g.id;
            return (
              <button
                key={g.id}
                className={`m1-tab ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveGroup(g.id)}
                role="tab"
              >
                <span>{g.icon} {g.short}</span>
                <span className="m1-tab__count">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="m1-cards">
          {filteredCards.map((card) => {
            const isSelected = selectedCards.includes(card.id);
            return (
              <article
                key={card.id}
                className={`m1-card ${isSelected ? 'is-selected' : ''}`}
              >
                <div className="m1-card__thumb" onClick={() => onViewCard(card)} style={{ cursor: 'pointer' }}>
                  <img src={card.coverImage} alt={card.alt || card.teaser} loading="lazy" />
                  <span className="m1-card__id">{card.id}</span>
                  <span className="m1-card__group-badge">Group {card.group}</span>
                </div>

                <div className="m1-card__body">
                  <h3 className="m1-card__teaser">{card.teaser}</h3>

                  <div className="m1-card__actions">
                    <button
                      className="m1-card__btn"
                      type="button"
                      onClick={() => onViewCard(card)}
                    >
                      Mở hồ sơ
                    </button>
                    <button
                      className={`m1-card__btn m1-card__btn--select ${isSelected ? 'is-active' : ''}`}
                      type="button"
                      onClick={() => onToggleSelectCard(card.id)}
                    >
                      {isSelected ? 'Đã chọn' : '+ Ghép cụm'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import React from 'react';

export default function M1CardModal({ card, isOpen, onClose, isSelected, onToggleSelectCard }) {
  if (!isOpen || !card) return null;

  const displayImage = card.openImage || card.coverImage;

  return (
    <div className={`modal ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen} role="dialog">
      <div className="modal__backdrop" onClick={onClose}></div>
      <div className="modal__panel" style={{ maxWidth: '640px' }}>
        <button className="modal__close" onClick={onClose} aria-label="Đóng">&times;</button>

        <p className="mono modal__label">Group {card.group} · {card.id}</p>
        <h3 className="modal__title">{card.teaser}</h3>

        <div style={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--clr-line)' }}>
          <img src={displayImage} alt={card.alt || card.teaser} style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>

        <p style={{ fontSize: '0.98rem', color: 'var(--clr-ink-2)', lineHeight: '1.7', marginBottom: '24px' }}>
          {card.clue}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            className={`btn ${isSelected ? 'btn--gold' : 'btn--outline'}`}
            onClick={() => {
              onToggleSelectCard(card.id);
            }}
          >
            {isSelected ? '✓ Đã chọn ghép cụm' : '+ Chọn ghép cụm'}
          </button>
          <button className="btn btn--outline" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

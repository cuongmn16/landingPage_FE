import React, { useState } from 'react';

const TYPE_ICON  = { image: '🖼️', video: '🎬', pdf: '📄', ppt: '📊' };
const TYPE_LABEL = { image: 'Ảnh', video: 'Video', pdf: 'PDF', ppt: 'Slide' };

export default function M1Submissions({ submissions, onSelectSubmission }) {
  const [showAll, setShowAll] = useState(false);
  const limit = 6;

  const m1Subs = submissions
    .filter(s => s.missionId === 'M1')
    .sort((a, b) => a.team.localeCompare(b.team, 'vi'));

  const visibleSubs = showAll ? m1Subs : m1Subs.slice(0, limit);
  const hasMore = m1Subs.length > limit;

  return (
    <section className="m1-section m1-section--light" id="m1-submissions">
      <div className="container">
        <p className="m1-section__label mono">SECTION 06 — BÀI DỰ THI</p>
        <h2 className="m1-section__title">Bài dự thi của các đội</h2>
        <p className="m1-section__desc">Danh sách bài nộp Mission 1 ({m1Subs.length} bài)</p>

        {!m1Subs.length ? (
          <div className="submissions-block submissions-block--empty">
            <div className="empty-state">
              <div className="empty-state__icon">📁</div>
              <h3 className="empty-state__title">Chưa có bài nộp nào</h3>
              <p className="empty-state__desc">Bài dự thi Mission 1 sẽ được cập nhật khi BTC nhận bài từ các đội.</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="submissions-grid">
              {visibleSubs.map(s => (
                <article
                  key={s.id}
                  className="submission-card"
                  onClick={() => onSelectSubmission(s)}
                  tabIndex={0}
                  role="button"
                >
                  <div className="submission-card__thumb">
                    {s.type === 'image' && s.link ? (
                      <img src={s.link} alt={s.title} loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div className="submission-card__thumb-placeholder">{TYPE_ICON[s.type] || '📄'}</div>
                    )}
                    <span className="submission-card__type">{TYPE_LABEL[s.type] || s.type}</span>
                  </div>
                  <div className="submission-card__body">
                    <p className="submission-card__team">{s.team}</p>
                    <h5 className="submission-card__title">{s.title}</h5>
                  </div>
                </article>
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <button
                  className="btn btn--outline"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? 'Thu gọn bài nộp' : `Xem thêm (${m1Subs.length - limit} bài)`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

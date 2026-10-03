import React from 'react';
import { fmtDate, fmtDateTime } from '../../data/appData';

const TYPE_ICON  = { image: '🖼️', video: '🎬', pdf: '📄', ppt: '📊' };
const TYPE_LABEL = { image: 'Ảnh', video: 'Video', pdf: 'PDF', ppt: 'Slide' };

export default function MissionModal({ mission, submissions, scoresMap, isOpen, onClose, onSelectSubmission }) {
  if (!isOpen || !mission) return null;

  const now = Date.now();
  const openTime = mission.openDate ? new Date(mission.openDate).getTime() : 0;
  const isLocked = mission.id === 'M1' && openTime > 0 && now < openTime;

  const missionSubs = submissions.filter(s => s.missionId === mission.id);

  return (
    <div className={`modal ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen} role="dialog">
      <div className="modal__backdrop" onClick={onClose}></div>
      <div className="modal__panel">
        <button className="modal__close" onClick={onClose} aria-label="Đóng">&times;</button>

        <p className="mono modal__label">Mission {mission.num} · {mission.name}</p>
        <h3 className="modal__title">{mission.name}</h3>

        {isLocked ? (
          <div className="modal-locked">
            <div className="modal-locked__icon">🔒</div>
            <h3 className="modal-locked__heading">Mission chưa mở</h3>
            <p className="modal-locked__desc">
              Mission 01 sẽ chính thức mở vào<br />
              <strong>{fmtDateTime(mission.openDate)}</strong>
            </p>
            <p className="modal-locked__note">Vui lòng quay lại sau. Ban tổ chức sẽ thông báo khi Mission sẵn sàng.</p>
          </div>
        ) : (
          <div className="modal__body">
            <p><strong>Trọng tâm:</strong> {mission.focus}</p>
            <p><strong>Trọng số:</strong> {mission.weight}%</p>
            <p><strong>Ngày mở:</strong> {mission.openDate ? fmtDate(mission.openDate) : 'Sẽ cập nhật'}</p>
            <p><strong>Hạn nộp:</strong> {mission.dueDate ? fmtDate(mission.dueDate) : 'Sẽ cập nhật'}</p>
            <p><strong>Giải Mission:</strong> {mission.prizeName} — {mission.prizeValue}</p>

            <div className="submissions-block" style={{ marginTop: '24px' }}>
              <div className="submissions-block__head">
                <h4>📁 Bài dự thi của các đội <span>({missionSubs.length} bài)</span></h4>
                <p className="submissions-block__hint">Click vào từng ô để xem chi tiết và điểm chấm</p>
              </div>

              {!missionSubs.length ? (
                <div className="submissions-block--empty">
                  <p>Chưa có bài nộp nào cho Mission này.</p>
                </div>
              ) : (
                <div className="submissions-grid">
                  {missionSubs.map(s => {
                    const score = scoresMap[s.team] ? scoresMap[s.team][mission.id.toLowerCase()] : null;
                    return (
                      <article
                        key={s.id}
                        className="submission-card"
                        onClick={() => onSelectSubmission(s, mission)}
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
                          {score != null && <span className="submission-card__score">{score} đ</span>}
                        </div>
                        <div className="submission-card__body">
                          <p className="submission-card__team">{s.team}</p>
                          <h5 className="submission-card__title">{s.title}</h5>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

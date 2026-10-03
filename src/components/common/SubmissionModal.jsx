import React from 'react';

export default function SubmissionModal({ submission, mission, scoresMap, isOpen, onClose }) {
  if (!isOpen || !submission) return null;

  const missionId = mission ? mission.id.toLowerCase() : 'm1';
  const score = scoresMap[submission.team] ? scoresMap[submission.team][missionId] : null;

  return (
    <div className={`modal modal--submission ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen} role="dialog">
      <div className="modal__backdrop" onClick={onClose}></div>
      <div className="modal__panel modal__panel--large">
        <button className="modal__close" onClick={onClose} aria-label="Đóng">&times;</button>

        <div className="submission-detail">
          <div className="submission-detail__header">
            <p className="submission-detail__team">{submission.team}</p>
            <h2 className="submission-detail__title">"{submission.title}"</h2>
            {mission && (
              <p className="submission-detail__mission">Mission {mission.num} · {mission.name}</p>
            )}
          </div>

          {submission.type === 'image' && submission.link && (
            <div className="submission-detail__image">
              <img src={submission.link} alt={submission.title} />
            </div>
          )}

          {submission.type === 'video' && submission.link && (
            <div className="submission-detail__video">
              <iframe src={submission.link} title={submission.title} frameBorder="0" allowFullScreen loading="lazy"></iframe>
            </div>
          )}

          {(submission.type === 'pdf' || submission.type === 'ppt') && submission.link && (
            <div className="submission-detail__file">
              <div className="submission-detail__file-icon">
                {submission.type === 'pdf' ? '📄' : '📊'}
              </div>
              <a href={submission.link} target="_blank" rel="noopener noreferrer" className="btn btn--gold">
                {submission.type === 'pdf' ? 'Mở file PDF' : 'Mở slide PPT'} →
              </a>
            </div>
          )}

          {score != null ? (
            <div className="submission-detail__points">
              <span className="label">Điểm chấm Mission {mission ? mission.num : ''}</span>
              <span className="value">{score}</span>
            </div>
          ) : (
            <div className="submission-detail__points is-pending">
              <span className="label">Điểm chấm</span>
              <span className="value" style={{ fontSize: '1rem' }}>Chưa chấm</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

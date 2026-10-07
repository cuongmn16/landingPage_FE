import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, auth } from '../services/api';
import { getMissionState, getSubmissionStatus, fmtDateTime } from '../data/appData';
import MissionSubmitModal from '../components/common/MissionSubmitModal';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [missions, setMissions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review Modal state
  const [selectedReviewSub, setSelectedReviewSub] = useState(null);
  const [selectedReviewMission, setSelectedReviewMission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Submit Modal state
  const [submitMissionId, setSubmitMissionId] = useState('1');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const refreshSubmissions = async () => {
    try {
      setSubmissions(await api.getUserSubmissions());
    } catch (err) {}
  };

  const handleStartMission = (mId) => {
    setSubmitMissionId(String(mId));
    setIsSubmitModalOpen(true);
  };

  useEffect(() => {
    async function init() {
      const u = await auth.load();
      if (!u) {
        navigate('/login');
        return;
      }
      if (u.role === 'admin') {
        navigate('/admin');
        return;
      }
      setUser(u);

      try {
        const [mList, sList] = await Promise.all([
          api.getMissions(),
          api.getUserSubmissions()
        ]);
        setMissions(mList);
        setSubmissions(sList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [navigate]);

  const handleOpenReview = (mId) => {
    const sub = submissions.find(s => Number(s.mission_id) === Number(mId));
    if (!sub) return;
    const mission = missions.find(m => Number(m.id) === Number(mId));
    setSelectedReviewSub(sub);
    setSelectedReviewMission(mission);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseReview = () => {
    setIsModalOpen(false);
    setSelectedReviewSub(null);
    setSelectedReviewMission(null);
    document.body.style.overflow = '';
  };

  if (loading) {
    return (
      <main className="dashboard">
        <div className="container">
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--clr-ink-3)' }}>Đang tải Dashboard…</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="dashboard">
        <div className="container">
          <h1 className="dashboard__title">Xin chào, <span>{user?.full_name || 'bạn'}</span></h1>
          <p className="dashboard__sub">
            {user?.employee_id || ''} · {user?.unit || ''} · {user?.email || ''}
          </p>

          {error && <p style={{ color: '#C25B5B', marginBottom: '20px' }}>Lỗi: {error}</p>}

          <div className="mission-grid">
            {missions.map(m => {
              const sub = submissions.find(s => Number(s.mission_id) === Number(m.id));
              const mState = getMissionState(m);
              const sState = getSubmissionStatus(sub);

              let btnText = 'Bắt đầu Mission';
              let btnDisabled = false;
              let isReview = false;

              if (sub) {
                isReview = true;
                if (sState.code === 'needs_supplement') btnText = 'Bổ sung bài →';
                else if (sState.code === 'invalid')     btnText = 'Xem lại bài';
                else if (sState.code === 'valid')       btnText = 'Xem bài đã duyệt';
                else                                    btnText = 'Xem bài đã nộp';
              } else if (mState.code === 'not_open') {
                btnText = 'Chưa mở';
                btnDisabled = true;
              } else if (mState.code === 'closed') {
                btnText = 'Đã đóng';
                btnDisabled = true;
              }

              let cardMod = '';
              if (sState.code === 'needs_supplement') cardMod = 'mission-card--warning';
              else if (sState.code === 'invalid')     cardMod = 'mission-card--invalid';
              else if (sState.code === 'valid')       cardMod = 'mission-card--valid';

              return (
                <article key={m.id} className={`mission-card ${cardMod}`}>
                  <div className="mission-card__badges">
                    <span className={`status-badge ${mState.cls} status-badge--sm`} title="Trạng thái Mission">
                      {mState.label}
                    </span>
                    <span className={`status-badge ${sState.cls} status-badge--sm`} title="Trạng thái bài nộp">
                      {sState.label}
                    </span>
                  </div>
                  <h3>{m.title}</h3>
                  <p>{m.description || ''}</p>
                  {isReview ? (
                    <button className="btn btn--outline" onClick={() => handleOpenReview(m.id)}>
                      {btnText}
                    </button>
                  ) : (
                    <button
                      className="btn btn--outline"
                      onClick={() => handleStartMission(m.id)}
                      disabled={btnDisabled}
                      style={btnDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
                      {btnText}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* MODAL XEM LẠI BÀI NỘP */}
      {isModalOpen && selectedReviewSub && (
        <div className="modal is-open" aria-hidden="false" role="dialog">
          <div className="modal__backdrop" onClick={handleCloseReview}></div>
          <div className="modal__panel modal__panel--large">
            <button className="modal__close" onClick={handleCloseReview} aria-label="Đóng">&times;</button>
            <div className="submission-detail">
              <div className="submission-detail__header">
                <p className="submission-detail__team">{user?.full_name} · {user?.unit}</p>
                <h2 className="submission-detail__title">Bài nộp Mission {selectedReviewSub.mission_id}</h2>
                <p className="submission-detail__mission">Nộp lúc: {fmtDateTime(selectedReviewSub.submitted_at)}</p>
                <div className="submission-detail__badges" style={{ marginTop: '12px', justifyContent: 'center' }}>
                  <span className={`status-badge ${getMissionState(selectedReviewMission).cls} status-badge--sm`}>
                    {getMissionState(selectedReviewMission).label}
                  </span>
                  <span className={`status-badge ${getSubmissionStatus(selectedReviewSub).cls}`}>
                    {getSubmissionStatus(selectedReviewSub).label}
                  </span>
                </div>
              </div>

              {selectedReviewSub.file_url ? (
                /\.(jpg|jpeg|png|gif|webp)$/i.test(selectedReviewSub.file_url) ? (
                  <div className="submission-detail__image">
                    <img src={selectedReviewSub.file_url} alt="Bài nộp" />
                  </div>
                ) : (
                  <div className="submission-detail__file">
                    <div className="submission-detail__file-icon">📄</div>
                    <a href={selectedReviewSub.file_url} target="_blank" rel="noopener noreferrer" className="btn btn--gold">
                      Mở file →
                    </a>
                  </div>
                )
              ) : (
                <div className="submission-detail__file"><p>Không có file đính kèm.</p></div>
              )}

              {selectedReviewSub.note && (
                <p style={{ color: 'var(--clr-ink-2)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  <strong>Ghi chú:</strong> {selectedReviewSub.note}
                </p>
              )}

              {selectedReviewSub.review_note && (
                <div className="submission-detail__review-note">
                  <strong>Ghi chú từ BTC:</strong> {selectedReviewSub.review_note}
                </div>
              )}

              {selectedReviewSub.score != null ? (
                <div className="submission-detail__points">
                  <span className="label">Điểm</span>
                  <span className="value">{selectedReviewSub.score}</span>
                </div>
              ) : (
                <div className="submission-detail__points is-pending">
                  <span className="label">Điểm</span>
                  <span className="value" style={{ fontSize: '1rem' }}>Chưa chấm</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <MissionSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => {
          setIsSubmitModalOpen(false);
          refreshSubmissions();
        }}
        initialMissionId={submitMissionId}
        onSuccess={refreshSubmissions}
      />
    </main>
  );
}

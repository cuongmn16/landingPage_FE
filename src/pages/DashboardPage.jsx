import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, auth } from '../services/api';
import { MISSIONS, getMissionState, getSubmissionStatus, fmtDateTime } from '../data/appData';
import MissionSubmitModal from '../components/common/MissionSubmitModal';

const MISSION_PAGES = { 1: '/mission-1', 2: '/mission-2', 3: '/mission-3', 4: '/mission-4' };

const FALLBACK_MISSIONS = MISSIONS.map((m, idx) => ({
  id: idx + 1,
  code: m.id,
  title: m.name,
  description: m.focus,
  status: 'open'
}));

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [missions, setMissions] = useState(FALLBACK_MISSIONS);
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
    if (MISSION_PAGES[Number(mId)]) {
      navigate(MISSION_PAGES[Number(mId)]);
      return;
    }
    setSubmitMissionId(String(mId));
    setIsSubmitModalOpen(true);
  };

  useEffect(() => {
    async function init() {
      let u = null;
      try { u = await auth.load(); } catch { u = null; }
      setUser(u);

      try {
        const mList = await api.getMissions();
        if (mList && mList.length) setMissions(mList);
        if (u && u.role !== 'admin') {
          const sList = await api.getUserSubmissions();
          setSubmissions(sList || []);
        }
      } catch (err) {
        // Fallback to local 4 missions if backend is unreachable
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [navigate]);

  const handleOpenReview = (mId) => {
    if (MISSION_PAGES[Number(mId)]) {
      navigate(MISSION_PAGES[Number(mId)]);
      return;
    }
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

  // Tính kết quả & mức thưởng cá nhân theo Tài liệu bàn giao kỹ thuật Giải thưởng
  const validMissionCount = submissions.filter(s => getSubmissionStatus(s).code === 'valid').length;
  const submittedMissionCount = submissions.length;
  const hasExplorerTitle = validMissionCount >= 2;
  const explorerTitle = hasExplorerTitle ? 'Nhà khám phá' : 'Chưa đủ điều kiện';
  const rewardAmount = hasExplorerTitle ? `${(validMissionCount * 100000).toLocaleString('vi-VN')} đồng` : '0 đồng';

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 className="dashboard__title">Xin chào, <span>{user?.full_name || 'Người khám phá CTIN'}</span></h1>
              <p className="dashboard__sub">
                {user
                  ? `${user.employee_id || ''} · ${user.unit || ''} · ${user.email || ''}`
                  : 'Chế độ xem giao diện — Bấm vào bất kỳ nhiệm vụ nào bên dưới để trải nghiệm'}
              </p>
            </div>
            {user?.role === 'admin' && (
              <Link to="/admin" className="btn btn--gold">Quản trị Admin →</Link>
            )}
          </div>

          {error && <p style={{ color: '#C25B5B', marginBottom: '20px' }}>Lỗi: {error}</p>}

          {/* Khối Kết quả cá nhân & Phần thưởng dự kiến */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--clr-line)',
              borderRadius: '12px',
              padding: '20px 24px',
              marginBottom: '28px',
              boxShadow: 'var(--shadow-sm)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--clr-ink-3)', textTransform: 'uppercase' }}>
                Tiến độ nhiệm vụ hợp lệ
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--clr-ink)', marginTop: '4px' }}>
                {validMissionCount} / 4 <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--clr-ink-3)' }}>(đã nộp: {submittedMissionCount}/4)</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--clr-ink-3)', textTransform: 'uppercase' }}>
                Danh hiệu cá nhân
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: hasExplorerTitle ? '#1A6C3D' : 'var(--clr-ink-2)', marginTop: '4px' }}>
                {hasExplorerTitle ? '🏅 ' : ''}{explorerTitle}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--clr-ink-3)', textTransform: 'uppercase' }}>
                Mức thưởng dự kiến
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--clr-orange-dark)', marginTop: '4px' }}>
                {rewardAmount}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <a href="/#prizes" className="btn btn--outline" style={{ fontSize: '0.85rem', padding: '8px 14px' }}>
                Xem cơ cấu giải thưởng →
              </a>
            </div>
          </div>

          <div className="mission-grid">
            {missions.map(m => {
              const sub = submissions.find(s => Number(s.mission_id) === Number(m.id));
              const mState = getMissionState(m);
              const sState = getSubmissionStatus(sub);

              let btnText = 'Bắt đầu Mission →';
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

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { M1_CONFIG, M1_GROUPS, M1_CARDS } from '../data/mission1Data';
import { api, auth } from '../services/api';
import { fmtDateTime, getSubmissionStatus } from '../data/appData';

export default function Mission1Page() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userSubmission, setUserSubmission] = useState(null);
  const [activeTabGroup, setActiveTabGroup] = useState('B');
  const [selectedCard, setSelectedCard] = useState(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // Cluster workspace state
  const [currentSlots, setCurrentSlots] = useState([]);
  const [savedClusters, setSavedClusters] = useState([]);

  // Form submission state
  const [file, setFile] = useState(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMsg, setToastMsg] = useState({ text: '', type: '' });

  // Countdown state
  const [timeLeft, setTimeLeft] = useState('');

  const showToast = (text, type = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg({ text: '', type: '' }), 3000);
  };

  useEffect(() => {
    async function load() {
      const u = await auth.load();
      setCurrentUser(u);
      if (u) {
        try {
          const subs = await api.getUserSubmissions();
          const m1Sub = subs.find(s => Number(s.mission_id) === 1);
          setUserSubmission(m1Sub);
        } catch (e) {}
      }
    }
    load();
  }, []);

  useEffect(() => {
    const dueAt = new Date(M1_CONFIG.dueAt).getTime();
    function tick() {
      const diff = dueAt - Date.now();
      if (diff <= 0) {
        setTimeLeft('⏱ Đã đóng nộp bài');
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${d} ngày ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    }
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  // Card modal
  const handleOpenCard = (card) => {
    setSelectedCard(card);
    setIsCardModalOpen(true);
  };

  const handleCloseCardModal = () => {
    setIsCardModalOpen(false);
    setSelectedCard(null);
  };

  // Cluster logic
  const handleSelectCardForCluster = (card) => {
    if (currentSlots.some(c => c.id === card.id)) {
      setCurrentSlots(currentSlots.filter(c => c.id !== card.id));
    } else {
      setCurrentSlots([...currentSlots, card]);
    }
  };

  const handleClearCurrentCluster = () => {
    setCurrentSlots([]);
  };

  const hasGroupB = currentSlots.some(c => c.group === 'B');

  const handleConfirmCluster = () => {
    if (!hasGroupB) {
      showToast('Mỗi cụm cần ít nhất 1 thẻ B (Time Fragments) làm mốc neo thời gian.', 'error');
      return;
    }
    setSavedClusters([...savedClusters, currentSlots]);
    setCurrentSlots([]);
    showToast('Đã lưu cụm manh mối.', 'success');
  };

  const handleRemoveCluster = (index) => {
    setSavedClusters(savedClusters.filter((_, i) => i !== index));
  };

  // Submission Form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!file && !userSubmission) {
      setFormError('Vui lòng chọn file đính kèm (PDF / DOCX / ảnh).');
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      if (file) fd.append('file', file);
      fd.append('note', note);

      await api.submitMission(1, fd);
      showToast('Nộp bài Mission 01 thành công!', 'success');
      const subs = await api.getUserSubmissions();
      const m1Sub = subs.find(s => Number(s.mission_id) === 1);
      setUserSubmission(m1Sub);
      setFile(null);
      setNote('');
    } catch (err) {
      setFormError(err.message || 'Lỗi nộp bài');
    } finally {
      setSubmitting(false);
    }
  };

  const currentGroupCards = M1_CARDS.filter(c => c.group === activeTabGroup);

  return (
    <main>
      {/* HERO */}
      <section class="m1-hero">
        <div class="m1-hero__bg"><div class="m1-hero__grid"></div></div>
        <div class="container m1-hero__inner">
          <Link to="/dashboard" class="m1-hero__back">← Quay lại Dashboard</Link>
          <span class="m1-hero__label mono">CLASSIFIED — MISSION 01</span>
          <h1 class="m1-hero__title">{M1_CONFIG.title}</h1>
          <p class="m1-hero__subtitle">{M1_CONFIG.subtitle}</p>

          <div class="m1-hero__meta">
            <div class="m1-hero__meta-item">
              <span class="m1-hero__meta-label">Trạng thái</span>
              <span class="m1-hero__meta-value" style={{ color: '#137333' }}>Đang mở</span>
            </div>
            <div class="m1-hero__meta-item">
              <span class="m1-hero__meta-label">Trọng số</span>
              <span class="m1-hero__meta-value">{M1_CONFIG.weight}%</span>
            </div>
            <div class="m1-hero__meta-item">
              <span class="m1-hero__meta-label">Mở từ</span>
              <span class="m1-hero__meta-value">05/10/2026</span>
            </div>
            <div class="m1-hero__meta-item">
              <span class="m1-hero__meta-label">Hạn nộp</span>
              <span class="m1-hero__meta-value">11/10/2026</span>
            </div>
          </div>

          <div class="m1-hero__countdown" id="m1Countdown" aria-live="polite">
            ⏱ Còn lại: <strong>{timeLeft}</strong>
          </div>
        </div>
      </section>

      {/* MỤC TIÊU */}
      <section class="m1-section">
        <div class="container">
          <span class="m1-section__label mono">BRIEF — MỤC TIÊU</span>
          <h2 class="m1-section__title">Mục tiêu Mission</h2>
          <p class="m1-section__text">{M1_CONFIG.goal}</p>
        </div>
      </section>

      {/* NHIỆM VỤ */}
      <section class="m1-section m1-section--light">
        <div class="container">
          <span class="m1-section__label mono">TASKS — NHIỆM VỤ</span>
          <h2 class="m1-section__title">Các bước thực hiện</h2>
          <ul class="m1-tasks">
            {M1_CONFIG.tasks.map((task, i) => (
              <li key={i}>{task}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* BỘ THẺ */}
      <section class="m1-section" id="m1-cards">
        <div class="container">
          <span class="m1-section__label mono">EVIDENCE — BỘ THẺ MANH MỐI</span>
          <h2 class="m1-section__title">Khám phá &amp; ghép cụm</h2>
          <p class="m1-section__desc">
            Mở từng thẻ để xem chi tiết. Chọn các thẻ liên quan để tạo thành một cụm lịch sử.
            Mỗi cụm phải có ít nhất <strong>1 thẻ B (Time Fragments)</strong> làm mốc neo.
          </p>

          <div class="m1-tabs" role="tablist">
            {M1_GROUPS.map(g => (
              <button
                key={g.id}
                class={`m1-tab ${activeTabGroup === g.id ? 'is-active' : ''}`}
                onClick={() => setActiveTabGroup(g.id)}
              >
                <span>{g.icon}</span> <span>{g.short} ({g.count})</span>
              </button>
            ))}
          </div>

          <div class="m1-cards">
            {currentGroupCards.map(c => {
              const isSelectedInSlot = currentSlots.some(s => s.id === c.id);
              return (
                <div
                  key={c.id}
                  class={`m1-card ${isSelectedInSlot ? 'is-selected' : ''}`}
                  onClick={() => handleOpenCard(c)}
                >
                  <div class="m1-card__inner">
                    <div class="m1-card__badge" style={{ background: M1_GROUPS.find(g => g.id === c.group)?.color }}>
                      {c.id}
                    </div>
                    <img src={c.coverImage} alt={c.alt} class="m1-card__cover" />
                    <div class="m1-card__footer">
                      <span class="m1-card__teaser">{c.teaser}</span>
                      <button
                        class="btn-sm btn--outline"
                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                        onClick={(e) => { e.stopPropagation(); handleSelectCardForCluster(c); }}
                      >
                        {isSelectedInSlot ? '✓ Đã chọn' : '+ Ghép cụm'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WORKSPACE CỤM MANH MỐI */}
      <section class="m1-section m1-section--light" id="m1-clusters">
        <div class="container">
          <span class="m1-section__label mono">CLUSTERS — CỤM MANH MỐI</span>
          <h2 class="m1-section__title">Cụm của bạn</h2>

          <div class="m1-cluster-current">
            <div class="m1-cluster-current__head">
              <span class="m1-cluster-current__title">Cụm đang chọn</span>
              <button class="m1-cluster-current__clear" type="button" onClick={handleClearCurrentCluster}>
                Xoá hết
              </button>
            </div>
            <div class="m1-cluster-current__slots">
              {currentSlots.length === 0 ? (
                <p style={{ color: 'var(--clr-ink-3)', fontSize: '0.9rem', width: '100%', textAlign: 'center', padding: '16px' }}>
                  Nhấn vào nút "+ Ghép cụm" trên các thẻ để thêm vào cụm này.
                </p>
              ) : (
                currentSlots.map(c => (
                  <div key={c.id} class="m1-slot-card">
                    <span class="m1-slot-card__id">{c.id}</span>
                    <span class="m1-slot-card__name">{c.teaser}</span>
                    <button
                      class="m1-slot-card__remove"
                      onClick={() => handleSelectCardForCluster(c)}
                    >&times;</button>
                  </div>
                ))
              )}
            </div>
            <button
              class="btn btn--gold m1-cluster-current__confirm"
              type="button"
              disabled={!hasGroupB || currentSlots.length === 0}
              onClick={handleConfirmCluster}
            >
              Xác nhận lưu cụm →
            </button>
          </div>

          <h3 class="m1-clusters-list__title" style={{ marginTop: '32px' }}>
            Các cụm đã lưu ({savedClusters.length})
          </h3>
          <div class="m1-clusters-list">
            {savedClusters.length === 0 ? (
              <p style={{ color: 'var(--clr-ink-3)', padding: '16px 0' }}>Chưa có cụm nào được lưu.</p>
            ) : (
              savedClusters.map((cluster, idx) => (
                <div key={idx} class="m1-cluster-item" style={{ background: '#FFFFFF', padding: '16px', borderRadius: '8px', border: '1px solid var(--clr-line)', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <strong>Cụm #{idx + 1}:</strong>{' '}
                    {cluster.map(c => `${c.id} (${c.teaser})`).join(', ')}
                  </div>
                  <button class="btn-sm btn-reject" onClick={() => handleRemoveCluster(idx)}>Xoá cụm</button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* SẢN PHẨM CẦN NỘP */}
      <section class="m1-section">
        <div class="container">
          <span class="m1-section__label mono">OUTPUTS — SẢN PHẨM</span>
          <h2 class="m1-section__title">Sản phẩm cần nộp</h2>
          <div class="m1-outputs">
            {M1_CONFIG.outputs.map((out, i) => (
              <div key={i} class="m1-output-card" style={{ background: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid var(--clr-line)', marginBottom: '16px' }}>
                <span class="mono" style={{ color: 'var(--clr-blue)', fontWeight: 600 }}>SẢN PHẨM {out.code}</span>
                <h3 style={{ fontSize: '1.2rem', margin: '8px 0' }}>{out.name}</h3>
                <p style={{ color: 'var(--clr-ink-2)', fontSize: '0.95rem', marginBottom: '8px' }}><strong>Yêu cầu:</strong> {out.requirement}</p>
                <p style={{ color: 'var(--clr-ink-3)', fontSize: '0.85rem' }}><strong>Định dạng:</strong> {out.format}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BÀI CỦA TÔI */}
      {userSubmission && (
        <section class="m1-section m1-section--light" id="m1-my-submission">
          <div class="container">
            <span class="m1-section__label mono">MY SUBMISSION</span>
            <h2 class="m1-section__title">Bài của tôi</h2>
            <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid var(--clr-line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span class={`status-badge ${getSubmissionStatus(userSubmission).cls}`}>
                  {getSubmissionStatus(userSubmission).label}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--clr-ink-3)' }}>
                  Nộp lúc: {fmtDateTime(userSubmission.submitted_at)}
                </span>
              </div>
              {userSubmission.file_url && (
                <div style={{ marginBottom: '12px' }}>
                  <a href={userSubmission.file_url} target="_blank" rel="noopener noreferrer" class="btn btn--gold">
                    📄 Xem file đã nộp →
                  </a>
                </div>
              )}
              {userSubmission.note && (
                <p style={{ fontSize: '0.92rem', color: 'var(--clr-ink-2)' }}>
                  <strong>Ghi chú:</strong> {userSubmission.note}
                </p>
              )}
              {userSubmission.score != null && (
                <div style={{ marginTop: '16px', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--clr-orange-dark)' }}>
                  Điểm: {userSubmission.score} / 100
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ADMIN SUBMISSIONS LINK */}
      {currentUser && currentUser.role === 'admin' && (
        <section class="m1-section m1-section--light">
          <div class="container">
            <span class="m1-section__label mono">ADMIN — MISSION 01 SUBMISSIONS</span>
            <h2 class="m1-section__title">Xem tất cả bài dự thi</h2>
            <Link to="/mission-1/all-submissions" class="btn btn--gold">
              Xem toàn bộ bài dự thi Mission 01 →
            </Link>
          </div>
        </section>
      )}

      {/* FORM NỘP BÀI */}
      <section class="m1-section m1-section--cta" id="m1-submit">
        <div class="container">
          <div class="m1-submit__inner">
            <span class="m1-section__label mono">SUBMIT — NỘP BÀI</span>
            <h2 class="m1-submit__title">Nộp bài Mission 01</h2>

            {!currentUser ? (
              <div class="m1-submit__status m1-submit__status--info">
                Bạn cần <Link to="/login" style={{ textDecoration: 'underline', fontWeight: 600 }}>Đăng nhập</Link> để nộp bài Mission 01.
              </div>
            ) : (
              <form class="m1-submit__form" onSubmit={handleSubmitForm}>
                <div class="form-group">
                  <label htmlFor="m1File">File đính kèm (PDF / DOCX / ảnh, tối đa 10 MB)</label>
                  <input
                    type="file"
                    id="m1File"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
                <div class="form-group">
                  <label htmlFor="m1Note">Ghi chú (tuỳ chọn)</label>
                  <textarea
                    id="m1Note"
                    placeholder="Mô tả ngắn về bài nộp, ghi chú về nguồn tư liệu…"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  ></textarea>
                </div>
                {formError && <div class="form-error" style={{ color: '#C25B5B', marginBottom: '16px' }}>{formError}</div>}
                <button type="submit" class="btn btn--gold btn--large" style={{ width: '100%' }} disabled={submitting}>
                  {submitting ? 'Đang gửi...' : userSubmission ? 'Nộp lại / Cập nhật bài nộp →' : 'Nộp bài Mission 01 →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CARD MODAL */}
      {isCardModalOpen && selectedCard && (
        <div class="m1-modal is-open" role="dialog" aria-modal="true">
          <div class="m1-modal__backdrop" onClick={handleCloseCardModal}></div>
          <div class="m1-modal__panel">
            <button class="m1-modal__close" onClick={handleCloseCardModal} aria-label="Đóng">&times;</button>
            <div class="m1-modal__content">
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <span class="mono" style={{ color: 'var(--clr-blue)', fontSize: '0.8rem', fontWeight: 600 }}>
                  {selectedCard.id} · GROUP {selectedCard.group}
                </span>
                <h3 style={{ fontSize: '1.4rem', marginTop: '4px' }}>{selectedCard.teaser}</h3>
              </div>
              <img src={selectedCard.openImage || selectedCard.coverImage} alt={selectedCard.alt} style={{ width: '100%', borderRadius: '6px', marginBottom: '16px' }} />
              <p style={{ fontSize: '0.98rem', lineHeight: 1.6, color: 'var(--clr-ink-2)' }}>
                {selectedCard.clue}
              </p>
              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button
                  class="btn btn--gold"
                  onClick={() => {
                    handleSelectCardForCluster(selectedCard);
                    handleCloseCardModal();
                  }}
                >
                  {currentSlots.some(s => s.id === selectedCard.id) ? '✓ Đã trong cụm' : '+ Thêm vào cụm manh mối'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toastMsg.text && (
        <div id="m1Toast" class={`m1-toast is-visible ${toastMsg.type ? 'm1-toast--' + toastMsg.type : ''}`} role="status">
          {toastMsg.text}
        </div>
      )}
    </main>
  );
}

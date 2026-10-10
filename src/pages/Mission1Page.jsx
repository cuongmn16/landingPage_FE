/* ============================================================
   MISSION 1 PAGE — port từ src_demo/mission-1 (index.html + mission-1.js)
   - Admin: xem bài nộp + nút "Xem toàn bộ"
   - User: nộp bài + xem bài của mình (kèm trạng thái)
   ============================================================ */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { M1_CONFIG, M1_GROUPS, M1_CARDS, m1FmtDateTime as fmtDateTime } from '../data/mission1Data';
import { api, auth } from '../services/api';
import { getSubmissionStatus } from '../data/appData';

const LS_KEY = 'ctin_th_m1_v1';
const ADMIN_SHOW_LIMIT = 6;

/* ---------- Helpers ---------- */
function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return { openedCards: data.openedCards || [], clusters: data.clusters || [] };
    }
  } catch { /* storage unavailable */ }
  return { openedCards: [], clusters: [] };
}

const getCard = (id) => M1_CARDS.find(c => c.id === id);
const getGroup = (id) => M1_GROUPS.find(g => g.id === id);
const hasCardB = (ids) => ids.some(id => getCard(id)?.group === 'B');

const isImageUrl = (url) => !!url && /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
const isPdfUrl = (url) => !!url && /\.pdf$/i.test(url);

const hideSelf = (e) => { e.currentTarget.style.display = 'none'; };

export default function Mission1Page() {
  const [openedCards, setOpenedCards] = useState(() => loadState().openedCards);
  const [clusters, setClusters] = useState(() => loadState().clusters);
  const [currentCluster, setCurrentCluster] = useState([]);
  const [activeTab, setActiveTab] = useState('B');

  const [currentUser, setCurrentUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [mySubmission, setMySubmission] = useState(null);

  const [adminSubs, setAdminSubs] = useState(null);
  const [adminError, setAdminError] = useState('');

  const [modalCardId, setModalCardId] = useState(null);
  const [toast, setToast] = useState({ msg: '', type: '', visible: false });

  const [note, setNote] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const clustersRef = useRef(null);
  const fileInputRef = useRef(null);
  const modalCloseRef = useRef(null);
  const lastFocusedRef = useRef(null);
  const modalOpenRef = useRef(false);
  const toastTimerRef = useRef(null);

  const isAdmin = currentUser?.role === 'admin';

  /* ---------- Persist ---------- */
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ openedCards, clusters }));
    } catch { /* storage unavailable */ }
  }, [openedCards, clusters]);

  function showToast(msg, type) {
    clearTimeout(toastTimerRef.current);
    setToast({ msg, type, visible: true });
    toastTimerRef.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2400);
  }
  useEffect(() => () => clearTimeout(toastTimerRef.current), []);

  /* ---------- INIT ---------- */
  async function loadMySubmission() {
    try {
      const subs = await api.getUserSubmissions();
      setMySubmission(subs.find(s => Number(s.mission_id) === 1) || null);
    } catch {
      setMySubmission(null);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function init() {
      let u = null;
      try { u = await auth.load(); } catch { u = null; }
      if (cancelled) return;
      setCurrentUser(u);
      setUserLoaded(true);

      if (u && u.role === 'admin') {
        try {
          const all = await api.getAllSubmissions();
          if (!cancelled) setAdminSubs(all.filter(s => Number(s.mission_id) === 1));
        } catch (e) {
          if (!cancelled) setAdminError(e.message);
        }
      } else if (u) {
        await loadMySubmission();
      }
    }
    init();
    return () => { cancelled = true; };
  }, []);

  /* ---------- MODAL ---------- */
  function openCardModal(id) {
    if (!getCard(id)) return;
    setOpenedCards(prev => (prev.includes(id) ? prev : [...prev, id]));
    lastFocusedRef.current = document.activeElement;
    setModalCardId(id);
  }

  function closeModal() {
    if (!modalOpenRef.current) return;
    modalOpenRef.current = false;
    setModalCardId(null);
    if (lastFocusedRef.current?.focus) lastFocusedRef.current.focus();
  }

  useEffect(() => {
    modalOpenRef.current = !!modalCardId;
    if (!modalCardId) return;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => modalCloseRef.current?.focus(), 50);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [modalCardId]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  /* ---------- CLUSTERS ---------- */
  function toggleSelectCard(id) {
    const c = getCard(id);
    if (!c) return;
    setCurrentCluster(prev => {
      if (prev.includes(id)) return prev.filter(cid => cid !== id);
      // Mỗi cụm chỉ có 1 thẻ B: chọn thẻ B mới sẽ thay thẻ B cũ
      const base = c.group === 'B' ? prev.filter(cid => getCard(cid)?.group !== 'B') : prev;
      return [...base, id];
    });
  }

  function confirmCluster() {
    if (!currentCluster.length) return;
    if (!hasCardB(currentCluster)) { showToast('Cần có 1 thẻ B làm mốc neo', 'error'); return; }

    const clusterId = 'M' + String(clusters.length + 1).padStart(2, '0');
    setClusters([...clusters, { id: clusterId, cards: [...currentCluster] }]);
    setCurrentCluster([]);
    showToast(`Đã lưu cụm ${clusterId}`, 'success');
  }

  function editCluster(id) {
    const cl = clusters.find(c => c.id === id);
    if (!cl) return;
    setCurrentCluster([...cl.cards]);
    setClusters(clusters.filter(c => c.id !== id));
    if (clustersRef.current) {
      window.scrollTo({ top: clustersRef.current.offsetTop - 80, behavior: 'smooth' });
    }
  }

  function deleteCluster(id) {
    if (!window.confirm('Xóa cụm này?')) return;
    setClusters(clusters.filter(c => c.id !== id));
  }

  /* ---------- SUBMIT ---------- */
  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    const file = fileInputRef.current?.files[0];
    const trimmedNote = note.trim();

    if (!file && !trimmedNote) {
      setFormError('Vui lòng đính kèm ít nhất 1 file hoặc ghi chú.');
      return;
    }
    if (file && file.size > 10 * 1024 * 1024) {
      setFormError('File vượt quá 10 MB. Vui lòng chọn file nhỏ hơn.');
      return;
    }

    const fd = new FormData();
    if (file) fd.append('file', file);
    if (trimmedNote) fd.append('note', trimmedNote);

    setSubmitting(true);
    try {
      await api.submitMission('1', fd);
      showToast('Nộp bài thành công!', 'success');
      setJustSubmitted(true);
      setNote('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadMySubmission();
    } catch (err) {
      setFormError(err.message || 'Nộp bài thất bại. Vui lòng thử lại.');
      showToast('Nộp bài thất bại', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  function submitStatus() {
    if (!userLoaded) return { cls: 'info', text: 'Đang kiểm tra trạng thái…' };
    if (!currentUser) return { cls: 'info', text: 'Bạn cần đăng nhập để nộp bài.' };
    if (justSubmitted) return { cls: 'success', text: 'Bài của bạn đã được ghi nhận và đang chờ BTC chấm.' };
    if (!mySubmission) return { cls: 'success', text: 'Mission đang mở. Bạn có thể nộp bài ngay bây giờ.' };
    const st = getSubmissionStatus(mySubmission);
    if (st.code === 'valid') return { cls: 'success', text: '✅ Bài của bạn đã được duyệt hợp lệ. Có thể nộp lại nếu muốn cập nhật.' };
    if (st.code === 'needs_supplement') return { cls: 'warning', text: '⚠️ Bài của bạn đang ở trạng thái "Cần bổ sung". Vui lòng nộp lại bản đã cập nhật.' };
    if (st.code === 'invalid') return { cls: 'error', text: '❌ Bài của bạn bị đánh dấu "Không hợp lệ". Liên hệ BTC hoặc nộp lại bản khác.' };
    return { cls: 'success', text: 'Bạn đã nộp bài. Có thể nộp lại để cập nhật.' };
  }

  /* ---------- RENDER PARTS ---------- */
  const cards = M1_CARDS.filter(c => c.group === activeTab);
  const modalCard = modalCardId ? getCard(modalCardId) : null;
  const modalGroup = modalCard ? getGroup(modalCard.group) : null;
  const modalSelected = modalCard ? currentCluster.includes(modalCard.id) : false;

  function renderAdminSubmissions() {
    if (adminError) {
      return <p style={{ color: '#C25B5B' }}>Không tải được bài nộp: {adminError}</p>;
    }
    if (adminSubs === null) {
      return <p style={{ color: 'var(--clr-ink-3)' }}>Đang tải…</p>;
    }
    if (!adminSubs.length) {
      return (
        <div className="submissions-block submissions-block--empty">
          <div className="empty-state">
            <div className="empty-state__icon">📁</div>
            <h3 className="empty-state__title">Chưa có bài nộp nào</h3>
            <p className="empty-state__desc">Bài dự thi Mission 1 sẽ hiển thị khi người dùng nộp bài.</p>
          </div>
        </div>
      );
    }

    const visible = adminSubs.slice(0, ADMIN_SHOW_LIMIT);
    const openFile = (s) => { if (s.file_url) window.open(s.file_url, '_blank', 'noopener'); };

    return (
      <div className="submissions-block">
        <div className="submissions-block__head">
          <h4>📁 Danh sách bài nộp <span>({adminSubs.length} bài)</span></h4>
          <p className="submissions-block__hint">Nhấn vào từng ô để mở file</p>
        </div>
        <div className="submissions-grid">
          {visible.map(s => {
            const fileUrl = s.file_url || '';
            const isImg = isImageUrl(fileUrl);
            const isPdf = isPdfUrl(fileUrl);
            const st = getSubmissionStatus(s);
            return (
              <article
                key={s.id}
                className="submission-card"
                tabIndex={0}
                role="button"
                onClick={() => openFile(s)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFile(s); }
                }}
              >
                <div className="submission-card__thumb">
                  {isImg
                    ? <img src={fileUrl} alt={s.user_name} loading="lazy" onError={hideSelf} />
                    : <div className="submission-card__thumb-placeholder">{isPdf ? '📄' : '📎'}</div>}
                  <span className="submission-card__type">{isImg ? 'Ảnh' : (isPdf ? 'PDF' : 'File')}</span>
                  {s.score != null
                    ? <span className="submission-card__score">{s.score} đ</span>
                    : <span className="submission-card__score submission-card__score--pending">Chưa chấm</span>}
                </div>
                <div className="submission-card__body">
                  <p className="submission-card__team">{s.user_name} · {s.user_unit}</p>
                  <h5 className="submission-card__title">Nộp lúc {fmtDateTime(s.submitted_at)}</h5>
                  <span className={`status-badge ${st.cls} status-badge--sm`} style={{ marginTop: '6px' }}>{st.label}</span>
                </div>
              </article>
            );
          })}
        </div>
        <div className="m1-submissions-toggle">
          <Link to="/mission-1/all-submissions" className="btn btn--outline">
            Xem toàn bộ {adminSubs.length} bài →
          </Link>
        </div>
      </div>
    );
  }

  function renderMySubmission() {
    const url = mySubmission.file_url;
    let media;
    if (isImageUrl(url)) {
      media = <div className="submission-detail__image"><img src={url} alt="Bài nộp" /></div>;
    } else if (isPdfUrl(url)) {
      media = (
        <div className="submission-detail__file">
          <div className="submission-detail__file-icon">📄</div>
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn--gold">Mở file PDF →</a>
        </div>
      );
    } else if (url) {
      media = (
        <div className="submission-detail__file">
          <div className="submission-detail__file-icon">📎</div>
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn--gold">Mở file →</a>
        </div>
      );
    } else {
      media = <div className="submission-detail__file"><p>Không có file đính kèm.</p></div>;
    }
    const st = getSubmissionStatus(mySubmission);

    return (
      <div className="submission-detail">
        <div className="submission-detail__header">
          <h3 className="submission-detail__title">Bài nộp Mission 01</h3>
          <p className="submission-detail__mission">Nộp lúc: {fmtDateTime(mySubmission.submitted_at)}</p>
          <div className="submission-detail__badges" style={{ marginTop: '12px', justifyContent: 'center' }}>
            <span className={`status-badge ${st.cls}`}>{st.label}</span>
          </div>
        </div>
        {media}
        {mySubmission.note && (
          <p style={{ color: 'var(--clr-ink-2)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            <strong>Ghi chú:</strong> {mySubmission.note}
          </p>
        )}
        {mySubmission.score != null ? (
          <div className="submission-detail__points">
            <span className="label">Điểm</span><span className="value">{mySubmission.score}</span>
          </div>
        ) : (
          <div className="submission-detail__points is-pending">
            <span className="label">Điểm</span><span className="value" style={{ fontSize: '1rem' }}>Chưa chấm</span>
          </div>
        )}
      </div>
    );
  }

  const status = submitStatus();

  return (
    <main>

      {/* HERO */}
      <section className="m1-hero">
        <div className="m1-hero__bg"><div className="m1-hero__grid"></div></div>
        <div className="container m1-hero__inner">
          <Link to="/dashboard" className="m1-hero__back">← Quay lại Dashboard</Link>
          <span className="m1-hero__label mono">CLASSIFIED — MISSION 01</span>
          <h1 className="m1-hero__title">{M1_CONFIG.title}</h1>
          <p className="m1-hero__subtitle">{M1_CONFIG.subtitle}</p>

          <div className="m1-hero__meta">
            <div className="m1-hero__meta-item">
              <span className="m1-hero__meta-label">Trạng thái</span>
              <span className="m1-hero__meta-value">Đang mở</span>
            </div>
            <div className="m1-hero__meta-item">
              <span className="m1-hero__meta-label">Trọng số</span>
              <span className="m1-hero__meta-value">{M1_CONFIG.weight}%</span>
            </div>
            <div className="m1-hero__meta-item">
              <span className="m1-hero__meta-label">Mở từ</span>
              <span className="m1-hero__meta-value">{fmtDateTime(M1_CONFIG.openAt)}</span>
            </div>
            <div className="m1-hero__meta-item">
              <span className="m1-hero__meta-label">Hạn nộp</span>
              <span className="m1-hero__meta-value">{fmtDateTime(M1_CONFIG.dueAt)}</span>
            </div>
          </div>

          <div className="m1-hero__countdown" aria-live="polite">
            ⏱ Mission đang mở · Trọng số {M1_CONFIG.weight}%
          </div>
        </div>
      </section>

      {/* MỤC TIÊU */}
      <section className="m1-section">
        <div className="container">
          <span className="m1-section__label mono">BRIEF — MỤC TIÊU</span>
          <h2 className="m1-section__title">Mục tiêu Mission</h2>
          <p className="m1-section__text">{M1_CONFIG.goal}</p>
        </div>
      </section>

      {/* NHIỆM VỤ */}
      <section className="m1-section m1-section--light">
        <div className="container">
          <span className="m1-section__label mono">TASKS — NHIỆM VỤ</span>
          <h2 className="m1-section__title">Các bước thực hiện</h2>
          <ul className="m1-tasks">
            {M1_CONFIG.tasks.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      </section>

      {/* BỘ THẺ */}
      <section className="m1-section" id="m1-cards">
        <div className="container">
          <span className="m1-section__label mono">EVIDENCE — BỘ THẺ MANH MỐI</span>
          <h2 className="m1-section__title">Khám phá &amp; ghép cụm</h2>
          <p className="m1-section__desc">
            Mở từng thẻ để xem chi tiết. Chọn các thẻ liên quan để tạo thành một cụm lịch sử.
            Mỗi cụm phải có ít nhất <strong>1 thẻ B (Time Fragments)</strong> làm mốc neo.
          </p>

          <div className="m1-tabs" role="tablist">
            {M1_GROUPS.map(g => (
              <button
                key={g.id}
                className={`m1-tab ${g.id === activeTab ? 'is-active' : ''}`}
                role="tab"
                type="button"
                aria-selected={g.id === activeTab}
                onClick={() => setActiveTab(g.id)}
              >
                <span>{g.icon} {g.short}</span>
                <span className="m1-tab__count">{g.count}</span>
              </button>
            ))}
          </div>

          <div className="m1-cards" aria-label={`Nhóm thẻ ${activeTab}`}>
            {cards.map(c => {
              const isOpened = openedCards.includes(c.id);
              const isSelected = currentCluster.includes(c.id);
              const group = getGroup(c.group);
              return (
                <article
                  key={c.id}
                  className={`m1-card ${isOpened ? 'is-opened' : ''} ${isSelected ? 'is-selected' : ''}`}
                  tabIndex={0}
                  onClick={(e) => { if (!e.target.closest('button')) openCardModal(c.id); }}
                  onKeyDown={(e) => {
                    if (e.target !== e.currentTarget) return;
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCardModal(c.id); }
                  }}
                >
                  <div className="m1-card__cover">
                    <img src={c.coverImage} alt={c.alt} loading="lazy" onError={hideSelf} />
                    <span className="m1-card__code">{c.id}</span>
                    {isOpened && <span className="m1-card__opened-badge">ĐÃ MỞ</span>}
                    {isSelected && <span className="m1-card__selected-badge">ĐÃ CHỌN</span>}
                  </div>
                  <div className="m1-card__body">
                    <span className="m1-card__group">{group.icon} {group.name}</span>
                    <h3 className="m1-card__teaser">{c.teaser}</h3>
                  </div>
                  <div className="m1-card__actions">
                    <button
                      className="m1-card__btn"
                      type="button"
                      onClick={(e) => { e.stopPropagation(); openCardModal(c.id); }}
                    >
                      Mở hồ sơ
                    </button>
                    <button
                      className={`m1-card__btn m1-card__btn--select ${isSelected ? 'm1-card__btn--selected' : ''}`}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleSelectCard(c.id); }}
                    >
                      {isSelected ? 'Bỏ chọn' : 'Chọn'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CỤM */}
      <section className="m1-section m1-section--light" id="m1-clusters" ref={clustersRef}>
        <div className="container">
          <span className="m1-section__label mono">CLUSTERS — CỤM MANH MỐI</span>
          <h2 className="m1-section__title">Cụm của bạn</h2>

          <div className="m1-cluster-current">
            <div className="m1-cluster-current__head">
              <span className="m1-cluster-current__title">Cụm đang chọn</span>
              <button className="m1-cluster-current__clear" type="button" onClick={() => setCurrentCluster([])}>
                Xoá hết
              </button>
            </div>
            <div className="m1-cluster-current__slots">
              {!currentCluster.length ? (
                <span className="m1-cluster-current__empty">
                  Chưa chọn thẻ nào. Bắt đầu bằng 1 thẻ B (Time Fragments).
                </span>
              ) : (
                currentCluster.map(id => {
                  const c = getCard(id);
                  if (!c) return null;
                  return (
                    <span key={c.id} className={`m1-slot m1-slot--${c.group}`}>
                      <span className="m1-slot__code">{c.id}</span>
                      <button
                        className="m1-slot__remove"
                        aria-label={`Bỏ thẻ ${c.id}`}
                        type="button"
                        onClick={() => toggleSelectCard(c.id)}
                      >×</button>
                    </span>
                  );
                })
              )}
            </div>
            <button
              className="btn btn--gold m1-cluster-current__confirm"
              type="button"
              disabled={!hasCardB(currentCluster)}
              onClick={confirmCluster}
            >
              Xác nhận lưu cụm →
            </button>
          </div>

          <h3 className="m1-clusters-list__title">
            Các cụm đã lưu ({clusters.length})
          </h3>
          <div className="m1-clusters-list">
            {!clusters.length ? (
              <div className="m1-clusters-empty">Chưa có cụm nào. Chọn thẻ rồi xác nhận để lưu cụm.</div>
            ) : (
              clusters.map(cl => (
                <article key={cl.id} className="m1-cluster-item">
                  <div className="m1-cluster-item__head">
                    <span className="m1-cluster-item__code">{cl.id} · {cl.cards.length} thẻ</span>
                    <div className="m1-cluster-item__actions">
                      <button title="Sửa" type="button" onClick={() => editCluster(cl.id)}>✎</button>
                      <button title="Xóa" type="button" onClick={() => deleteCluster(cl.id)}>🗑</button>
                    </div>
                  </div>
                  <div className="m1-cluster-item__chips">
                    {cl.cards.map(id => {
                      const c = getCard(id);
                      return c
                        ? <span key={id} className={`m1-cluster-chip m1-cluster-chip--${c.group}`}>{c.id}</span>
                        : null;
                    })}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* SẢN PHẨM */}
      <section className="m1-section">
        <div className="container">
          <span className="m1-section__label mono">OUTPUTS — SẢN PHẨM</span>
          <h2 className="m1-section__title">Sản phẩm cần nộp</h2>
          <div className="m1-outputs">
            {M1_CONFIG.outputs.map(o => (
              <article key={o.code} className="m1-output">
                <span className="m1-output__code">SẢN PHẨM {o.code}</span>
                <h3 className="m1-output__name">{o.name}</h3>
                <p className="m1-output__req">{o.requirement}</p>
                <p className="m1-output__format"><strong>Định dạng:</strong> {o.format}</p>
                {o.templateUrl && o.templateUrl !== '#' && (
                  <a className="m1-output__link" href={o.templateUrl} target="_blank" rel="noopener noreferrer">Tải mẫu →</a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BÀI CỦA TÔI (user) */}
      {!isAdmin && mySubmission && (
        <section className="m1-section m1-section--light" id="m1-my-submission">
          <div className="container">
            <span className="m1-section__label mono">MY SUBMISSION</span>
            <h2 className="m1-section__title">Bài của tôi</h2>
            {renderMySubmission()}
          </div>
        </section>
      )}

      {/* DANH SÁCH BÀI NỘP (admin) */}
      {isAdmin && (
        <section className="m1-section m1-section--light" id="m1-submissions">
          <div className="container">
            <span className="m1-section__label mono">ADMIN — SUBMISSIONS</span>
            <h2 className="m1-section__title">Danh sách bài nộp Mission 01</h2>
            {renderAdminSubmissions()}
          </div>
        </section>
      )}

      {/* FORM NỘP BÀI (user) */}
      {!isAdmin && (
        <section className="m1-section m1-section--cta" id="m1-submit">
          <div className="container">
            <div className="m1-submit__inner">
              <span className="m1-section__label mono">SUBMIT — NỘP BÀI</span>
              <h2 className="m1-submit__title">Nộp bài Mission 01</h2>

              <div className={`m1-submit__status m1-submit__status--${status.cls}`}>
                {status.text}
              </div>

              {userLoaded && !currentUser && (
                <div className="m1-submit__locked">
                  <p>Vui lòng đăng nhập bằng tài khoản CBNV đã được admin duyệt.</p>
                  <Link to="/login" className="btn btn--gold" style={{ marginTop: '16px' }}>Đăng nhập</Link>
                </div>
              )}

              {currentUser && (
                <form className="m1-submit__form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="m1File">File đính kèm (PDF / DOCX / ảnh, tối đa 10 MB)</label>
                    <input
                      type="file"
                      id="m1File"
                      ref={fileInputRef}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="m1Note">Ghi chú (tuỳ chọn)</label>
                    <textarea
                      id="m1Note"
                      placeholder="Mô tả ngắn về bài nộp, ghi chú về nguồn tư liệu…"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="form-error">{formError}</div>
                  <button type="submit" className="btn btn--gold btn--large" style={{ width: '100%' }} disabled={submitting}>
                    {submitting ? 'Đang nộp…' : 'Nộp bài Mission 01 →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      )}

      {/* MODAL */}
      <div
        className={`m1-modal ${modalCard ? 'is-open' : ''}`}
        aria-hidden={!modalCard}
        role="dialog"
        aria-modal="true"
        aria-labelledby="m1ModalTitle"
      >
        <div className="m1-modal__backdrop" onClick={closeModal}></div>
        <div className="m1-modal__panel">
          <button className="m1-modal__close" ref={modalCloseRef} onClick={closeModal} aria-label="Đóng">&times;</button>
          <div className="m1-modal__content">
            {modalCard && (
              <>
                <div className="m1-modal__image">
                  <img
                    src={modalCard.openImage}
                    alt={modalCard.alt}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.parentElement.style.display = 'none'; }}
                  />
                </div>
                <div className="m1-modal__body">
                  <span className="m1-modal__group">{modalGroup.icon} {modalGroup.name} · {modalCard.id}</span>
                  <h3 className="m1-modal__title" id="m1ModalTitle">{modalCard.teaser}</h3>
                  <p style={{ color: 'var(--clr-ink-2)', fontSize: '0.92rem', lineHeight: 1.65 }}>{modalCard.clue}</p>
                  <div className="m1-modal__actions">
                    <button
                      className={`m1-modal__btn ${modalSelected ? '' : 'm1-modal__btn--primary'}`}
                      type="button"
                      onClick={() => { toggleSelectCard(modalCard.id); closeModal(); }}
                    >
                      {modalSelected ? 'Bỏ chọn khỏi cụm' : 'Chọn vào cụm'}
                    </button>
                    <button className="m1-modal__btn" type="button" onClick={closeModal}>Đóng</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className={`m1-toast ${toast.type ? 'toast--' + toast.type : ''} ${toast.visible ? 'is-visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        {toast.msg}
      </div>
    </main>
  );
}

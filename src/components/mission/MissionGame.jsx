/* ============================================================
   MISSION GAME — khung chung cho các Mission chơi theo tab
   (Mission 02, 03, 04 — port từ src_demo/mission-2, mission-3, mission-4)
   - User / Guest: chơi và xem giao diện theo từng tab; tiến trình tự lưu.
     Nộp bài → gửi về admin chấm.
   - Admin: có thể chuyển đổi giữa xem giao diện chơi và xem danh sách bài nộp.
   ============================================================ */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  api, auth, submitMissionResponseApi, getMissionProgressApi, saveMissionProgressApi
} from '../../services/api';
import { getSubmissionStatus, fmtDateTime } from '../../data/appData';
import '../../styles/mission1.css';

const SYNC_DELAY_MS = 1500;

function loadLocal(key, normalizeState) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return normalizeState(JSON.parse(raw));
  } catch { /* storage unavailable */ }
  return normalizeState(null);
}

function saveLocal(key, state) {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch { /* quota */ }
}

function savedTime(s) {
  const t = s && s.savedAt ? Date.parse(s.savedAt) : 0;
  return Number.isFinite(t) ? t : 0;
}

export default function MissionGame({
  config, tabs, lsPrefix, normalizeState, maxReachableTab, isAllValid,
  buildSubmission, renderTab, getFiles, checkTab, canTryNext
}) {
  const navigate = useNavigate();
  const lastTab = tabs.length;
  const missionLabel = `Mission ${config.num}`;

  const [currentUser, setCurrentUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [storageKey, setStorageKey] = useState(null);
  const [state, setState] = useState(null);

  const [mySubmission, setMySubmission] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [adminSubs, setAdminSubs] = useState(null);
  const [adminError, setAdminError] = useState('');

  const [toastState, setToastState] = useState({ msg: '', type: '', visible: false });
  const toastTimerRef = useRef(null);
  const syncTimerRef = useRef(null);
  const pendingRemoteRef = useRef(null);
  const [exiting, setExiting] = useState(false);
  const [tabError, setTabError] = useState(null);

  const isAdmin = currentUser?.role === 'admin';

  function toast(msg, type) {
    clearTimeout(toastTimerRef.current);
    setToastState({ msg, type, visible: true });
    toastTimerRef.current = setTimeout(() => setToastState(t => ({ ...t, visible: false })), 2800);
  }
  useEffect(() => () => clearTimeout(toastTimerRef.current), []);

  async function loadMySubmission() {
    try {
      const subs = await api.getUserSubmissions();
      setMySubmission(subs.find(s => Number(s.mission_id) === config.id) || null);
    } catch {
      setMySubmission(null);
    }
  }

  /* ---------- INIT ---------- */
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
          if (!cancelled) setAdminSubs(all.filter(s => Number(s.mission_id) === config.id));
        } catch (e) {
          if (!cancelled) setAdminError(e.message);
        }
      } else if (u) {
        const key = lsPrefix + (u.id || u.email);
        let loaded = loadLocal(key, normalizeState);
        try {
          const remote = await getMissionProgressApi(config.id);
          if (remote && savedTime(remote.state) > savedTime(loaded)) loaded = normalizeState(remote.state);
        } catch { /* offline */ }
        if (cancelled) return;
        loaded.currentTab = Math.min(loaded.currentTab || 1, maxReachableTab(loaded));
        setStorageKey(key);
        setState(loaded);
        await loadMySubmission();
      }
    }
    init();
    return () => { cancelled = true; };
  }, []);

  /* ---------- Auto-save ---------- */
  useEffect(() => {
    if (!storageKey || !state) return;
    saveLocal(storageKey, state);
    if (currentUser && !isAdmin) {
      pendingRemoteRef.current = state;
      clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(() => { flushRemote(); }, SYNC_DELAY_MS);
    }
  }, [storageKey, state, currentUser, isAdmin]);

  useEffect(() => {
    const onUnload = () => { flushRemote(); };
    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('beforeunload', onUnload);
      clearTimeout(syncTimerRef.current);
      flushRemote();
    };
  }, []);

  async function flushRemote() {
    clearTimeout(syncTimerRef.current);
    const pending = pendingRemoteRef.current;
    if (!pending || !currentUser || isAdmin) return true;
    pendingRemoteRef.current = null;
    try {
      await saveMissionProgressApi(config.id, pending);
      return true;
    } catch {
      if (!pendingRemoteRef.current) pendingRemoteRef.current = pending;
      return false;
    }
  }

  function update(patch) {
    setTabError(null);
    setState(prev => {
      const p = typeof patch === 'function' ? patch(prev) : patch;
      return { ...prev, ...p, savedAt: new Date().toISOString() };
    });
  }

  const maxTab = state ? maxReachableTab(state) : 1;

  function goToTab(id) {
    if (!state || id < 1 || id > lastTab) return;
    if (id > maxTab) {
      toast('Hãy hoàn thành bước trước đó trước.', 'error');
      return;
    }
    update({ currentTab: id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function checkCurrentTab() {
    if (!checkTab || !state) return true;
    const err = checkTab(state.currentTab, state);
    if (!err) return true;
    setTabError({ tab: state.currentTab, ...err });
    toast(err.message, 'error');
    if (err.focusId) {
      setTimeout(() => {
        const el = document.getElementById(err.focusId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 0);
    }
    return false;
  }

  function handleNext() {
    if (!checkCurrentTab()) return;
    goToTab(state.currentTab + 1);
  }

  async function handleSaveAndExit() {
    if (storageKey && state) {
      const snapshot = { ...state, savedAt: new Date().toISOString() };
      saveLocal(storageKey, snapshot);
      if (currentUser && !isAdmin) pendingRemoteRef.current = snapshot;
    }
    if (!currentUser) {
      toast('Đã lưu tiến trình tạm trên trình duyệt này.', 'success');
      setTimeout(() => navigate('/'), 900);
      return;
    }
    setExiting(true);
    const ok = await flushRemote();
    setExiting(false);
    if (ok) toast('Đã lưu tiến trình lên hệ thống. Bạn có thể chơi tiếp trên bất kỳ máy nào.', 'success');
    else toast('Chưa lưu được lên hệ thống — tiến trình tạm lưu trên trình duyệt này.', 'error');
    setTimeout(() => navigate(isAdmin ? '/admin' : '/dashboard'), 1200);
  }

  async function handleSubmit() {
    if (!currentUser) {
      toast('Vui lòng đăng nhập tài khoản CBNV để nộp bài chính thức.', 'error');
      setTimeout(() => navigate('/login'), 1200);
      return;
    }
    if (!isAllValid(state)) {
      toast('Bài chưa đủ điều kiện hợp lệ.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const { longText, answers } = buildSubmission(state);
      await submitMissionResponseApi({
        missionId: config.id,
        longTextAnswer: longText,
        selectedOptionsJson: JSON.stringify(answers),
        evidenceSource: '',
        witnessName: ''
      }, getFiles ? getFiles() : []);
      update({ submittedAt: new Date().toISOString(), done: true });
      const successNotice = Number(config.id) === 2
        ? `Đã nộp ${missionLabel} thành công! Bài đã được gửi tới BTC chấm.`
        : `Đã hoàn thành ${missionLabel} thành công! Hệ thống đã tự động ghi nhận điểm hợp lệ.`;
      toast(successNotice, 'success');
      await loadMySubmission();
    } catch (err) {
      toast(err.message || 'Nộp bài thất bại.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------- RENDER PARTS ---------- */
  function renderMyStatus() {
    if (!mySubmission) return null;
    const st = getSubmissionStatus(mySubmission);
    let text;
    if (mySubmission.reopened) text = 'BTC đã mở lại bài của bạn để chỉnh sửa. Hãy cập nhật và nộp lại.';
    else if (st.code === 'valid') text = `Bài của bạn đã được duyệt hợp lệ — bạn nhận ${mySubmission.score != null ? mySubmission.score : config.points} điểm.`;
    else if (st.code === 'needs_supplement') text = 'BTC yêu cầu bổ sung. Hãy xem lại bài và nộp lại.';
    else if (st.code === 'invalid') text = 'Bài của bạn bị đánh dấu "Không hợp lệ". Liên hệ BTC hoặc nộp lại.';
    else text = 'Bài của bạn đã được gửi và đang chờ BTC chấm.';

    return (
      <div className="m1-summary-block" style={{ marginBottom: '20px' }}>
        <h4 style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          Bài nộp {missionLabel}
          <span className={`status-badge ${st.cls} status-badge--sm`}>{st.label}</span>
          {mySubmission.score != null && <span className="status-badge status-badge--sm">{mySubmission.score} điểm</span>}
        </h4>
        <p>{text} Nộp lúc {fmtDateTime(mySubmission.submitted_at)}.</p>
      </div>
    );
  }

  function renderAdminSubmissions() {
    if (adminError) return <p style={{ color: '#C25B5B' }}>Không tải được bài nộp: {adminError}</p>;
    if (adminSubs === null) return <p style={{ color: 'var(--clr-ink-3)' }}>Đang tải…</p>;
    if (!adminSubs.length) {
      return (
        <div className="submissions-block submissions-block--empty">
          <div className="empty-state">
            <div className="empty-state__icon">📁</div>
            <h3 className="empty-state__title">Chưa có bài nộp nào</h3>
            <p className="empty-state__desc">Bài làm {missionLabel} sẽ hiển thị khi người chơi nộp bài.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="submissions-block">
        <div className="submissions-block__head">
          <h4>📁 Danh sách bài nộp <span>({adminSubs.length} bài)</span></h4>
          <p className="submissions-block__hint">Nhấn vào từng ô để mở trang chấm bài</p>
        </div>
        <div className="submissions-grid">
          {adminSubs.map(s => {
            const st = getSubmissionStatus(s);
            return (
              <article
                key={s.id}
                className="submission-card"
                tabIndex={0}
                role="button"
                onClick={() => navigate('/admin')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/admin'); }
                }}
              >
                <div className="submission-card__thumb">
                  <div className="submission-card__thumb-placeholder">📝</div>
                  <span className="submission-card__type">Bài làm</span>
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
          <Link to="/admin" className="btn btn--gold">Chấm bài tại trang Admin →</Link>
        </div>
      </div>
    );
  }

  function renderBody() {
    if (!userLoaded) {
      return <section className="m1-panel"><p className="m1-panel__text">Đang tải…</p></section>;
    }
    if (!currentUser) {
      return (
        <section className="m1-panel" style={{ textAlign: 'center' }}>
          <h2 className="m1-panel__title">Bạn cần đăng nhập để chơi {missionLabel}</h2>
          <p className="m1-panel__text">Tiến trình chơi được lưu theo tài khoản CBNV CTIN.</p>
          <Link to="/login" className="btn btn--gold" style={{ marginTop: '16px' }}>Đăng nhập</Link>
        </section>
      );
    }
    if (isAdmin) {
      return (
        <section className="m1-panel">
          <span className="m1-section__label mono">ADMIN — SUBMISSIONS</span>
          <h2 className="m1-panel__title">Danh sách bài nộp {missionLabel}</h2>
          <p className="m1-panel__text">Hoàn thành {missionLabel} hợp lệ = {config.points} điểm cho người chơi.</p>
          {renderAdminSubmissions()}
        </section>
      );
    }
    if (!state) return null;
    return renderTab({
      tab: state.currentTab, state, update, toast, goToTab,
      tabError: tabError && tabError.tab === state.currentTab ? tabError : null,
      checkCurrentTab
    });
  }

  const playing = !!(currentUser && !isAdmin && state);
  const tab = state?.currentTab || 1;

  return (
    <main className="m1-page">
      <div className="m1-header">
        <div className="container">
          <Link to={isAdmin ? '/admin' : '/dashboard'} className="m1-header__label mono" style={{ display: 'inline-block' }}>
            ← {isAdmin ? 'Trang Admin' : 'Dashboard'}
          </Link>
          <p className="m1-header__label mono">{config.code}</p>
          <h1 className="m1-header__title">
            <span className="m1-header__num">{config.num}</span>
            {config.title}
          </h1>
          <p className="m1-header__desc">
            {config.desc} Hoàn thành: {config.points} điểm.
          </p>
        </div>
      </div>

      {playing && (
        <div className="m1g-tabs-bar">
          <div className="container">
            <nav className="m1g-tabs" role="tablist">
              {tabs.map(t => {
                let cls = 'm1g-tab';
                if (t.id === tab) cls += ' is-active';
                else if (t.id < maxTab || (t.id === lastTab && state.submittedAt)) cls += ' is-done';
                else if (t.id > maxTab) cls += ' is-locked';
                return (
                  <button
                    key={t.id}
                    className={cls}
                    type="button"
                    role="tab"
                    aria-selected={t.id === tab}
                    onClick={() => goToTab(t.id)}
                  >
                    {t.code} · {t.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <div className="m1-content">
        <div className="container">
          {playing && renderMyStatus()}
          {renderBody()}
        </div>
      </div>

      {playing && (
        <div className="m1-footer-nav">
          <div className="container m1-footer-nav__inner">
            {tab > 1 && (
              <button type="button" className="btn btn--outline" onClick={() => goToTab(tab - 1)}>← Quay lại</button>
            )}
            <div className="m1-footer-nav__spacer"></div>
            <button type="button" className="btn btn--outline" onClick={handleSaveAndExit} disabled={exiting} title="Tiến trình được lưu, lần sau vào sẽ chơi tiếp">
              {exiting ? 'Đang lưu…' : '💾 Lưu & thoát'}
            </button>
            {tab < lastTab && (
              <button
                type="button"
                className="btn btn--gold"
                disabled={checkTab ? !(canTryNext ? canTryNext(tab, state) : true) : tab >= maxTab}
                onClick={handleNext}
              >
                Tiếp tục →
              </button>
            )}
            {tab === lastTab && (
              <button type="button" className="btn btn--gold" disabled={!isAllValid(state) || submitting} onClick={handleSubmit}>
                {submitting ? 'Đang nộp…' : (mySubmission ? `Nộp lại ${missionLabel} →` : `Nộp ${missionLabel} →`)}
              </button>
            )}
          </div>
        </div>
      )}

      <div
        className={`m1-toast ${toastState.type ? 'toast--' + toastState.type : ''} ${toastState.visible ? 'is-visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        {toastState.msg}
      </div>
    </main>
  );
}
